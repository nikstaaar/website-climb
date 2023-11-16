import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useGLTF, useFBO, FaceLandmarkerDefaults } from '@react-three/drei'
import { RigidBody, vec3, quat } from '@react-three/rapier'
import { useThree, useFrame } from '@react-three/fiber'
import { RenderTexture } from './RenderTexture'
import seedrandom from 'seedrandom'
import * as THREE from 'three'
import Content from './Content'
import useStore from './stores/useStore'

export default function Screen() {
	const { level, setLevel, stage, setStage, setFalling, cycle, addCycle } =
		useStore((state) => ({
			level: state.level,
			setLevel: state.setLevel,
			stage: state.stage,
			setStage: state.setStage,
			setFalling: state.setFalling,
			cycle: state.cycle,
			addCycle: state.addCycle,
		}))

	const [updateCount, setUpdateCount] = useState(0)

	const { size, viewport } = useThree()
	const targetFBO = useFBO(
		size.height * (21 / 9) * viewport.dpr,
		size.height * viewport.dpr
	)

	const screenModel = useGLTF('../../screen22.glb')
	const screenMeshes = screenModel.scenes[0].children
	screenMeshes.sort(compareNames)
	const facePlanes = screenMeshes.slice(
		screenMeshes.length / 2,
		screenMeshes.length
	)
	const screenBlocks = screenMeshes.slice(0, screenMeshes.length / 2)

	const rigidBodyRefs = useRef([])
	const resetRefs = useRef(new Set()).current
	const fallingRefs = useRef(new Set()).current

	const screen = screenBlocks.map((block, index) => {
		if (!rigidBodyRefs.current[index]) {
			rigidBodyRefs.current[index] = React.createRef()
		}
		const plane = facePlanes[index]
		return (
			<RigidBody
				ref={rigidBodyRefs.current[index]}
				position={[0, 110, 0]}
				type={'fixed'}
				colliders="hull"
				key={index}
				restitution={0.5}
				mass={20}
				friction={0.5}
			>
				<mesh
					geometry={block.geometry}
					position={block.position}
					scale={block.scale}
					rotation={block.rotation}
				>
					<meshStandardMaterial
						color="blue"
						emissive="blue"
						wireframe={true}
						emissiveIntensity={1.5}
					></meshStandardMaterial>
				</mesh>
				<mesh
					geometry={plane.geometry}
					position={plane.position}
					scale={plane.scale}
					rotation={plane.rotation}
				>
					<meshStandardMaterial map={targetFBO.texture} />
				</mesh>
				<mesh
					geometry={plane.geometry}
					position-x={plane.position.x}
					position-y={plane.position.y - 0.01}
					position-z={plane.position.z}
					scale={plane.scale}
					rotation={plane.rotation}
				>
					<meshStandardMaterial side={THREE.BackSide} color={'blue'} />
				</mesh>
			</RigidBody>
		)
	})

	function compareNames(a, b) {
		const nameA = a.name.toUpperCase()
		const nameB = b.name.toUpperCase()
		if (nameA < nameB) {
			return -1
		}
		if (nameA > nameB) {
			return 1
		}
		return 0
	}

	useEffect(() => {
		if (stage === 'falling') {
			rigidBodyRefs.current.forEach((ref, index) => {
				const delay = 40
				setTimeout(
					() => {
						ref.current.setBodyType(0)
						fallingRefs.add(index)
					},
					delay * index + (index - 1) * delay
				)
			})
		}
	}, [stage])

	useEffect(() => {
		if (level === 1) {
			rigidBodyRefs.current.forEach((ref) => {
				ref.current.setBodyType(0)
			})
		}
	}, [level])

	useFrame((time) => {
		switch (level) {
			case 0:
				updateForLevel0()
				break
			case 1:
				updateForLevel1(time.clock.elapsedTime)
				break
			case 2:
				updateForLevel2(time.clock.elapsedTime)
				break
			case 3:
				updateForLevel3()
				break
		}
	})

	function updateForLevel0() {
		rigidBodyRefs.current.forEach((ref) => {
			if (stage === 'walking' && !ref.current.isMoving()) {
				ref.current.setBodyType(1)
			}
		})
		if (
			stage === 'falling' &&
			fallingRefs.size >= rigidBodyRefs.current.length
		) {
			setFalling(true)
		}
	}

	function updateForLevel1(time) {
		fallingRefs.clear()
		resetRefs.clear()
		rigidBodyRefs.current.forEach((ref, index) => {
			const height = 1.2
			const variance = 0.5
			const targetPosition = getTargetPosition(time, index, height, variance)
			const targetRotation = getTargetRotation('seed15', index)
			updateRigidBody(ref, targetPosition, targetRotation, index)
		})
	}

	function updateForLevel2(time) {
		rigidBodyRefs.current.forEach((ref, index) => {
			const height = 61
			const variance = 10.5
			const targetPosition = getTargetPosition(time, index, height, variance)
			const adjustedPosition = new THREE.Vector3(
				targetPosition.x + 10,
				targetPosition.y,
				targetPosition.z
			)
			const targetRotation = getTargetRotation('seed12', index)
			updateRigidBody(ref, adjustedPosition, targetRotation, index)
		})
	}

	function updateForLevel3() {
		rigidBodyRefs.current.forEach((ref, index) => {
			let reset = false
			const targetPosition = new THREE.Vector3(0, 110, 0)
			const targetRotation = new THREE.Quaternion().setFromEuler(
				new THREE.Euler(0, 0, 0)
			)
			const position = vec3(ref.current.translation())
			const rotation = quat(ref.current.rotation())
			const angleDifference = rotation.angleTo(targetRotation)
			const distance = position.distanceTo(targetPosition)
			if (angleDifference < 0.05 && distance < 0.05) {
				reset = true
			}
			if (reset) {
				ref.current.setBodyType(1)
				ref.current.setTranslation(targetPosition)
				ref.current.setRotation(targetRotation)
				resetRefs.add(index)
			}
			if (resetRefs.size >= rigidBodyRefs.current.length) {
				setLevel(0)
				setStage('website')
				setUpdateCount(0)
				addCycle()
			}
			updateRigidBody(ref, targetPosition, targetRotation, index)
		})
	}

	function getTargetPosition(time, index, height, variance) {
		const degreeIncrement = 360 / rigidBodyRefs.current.length
		const thetaInRadians = index * degreeIncrement * (Math.PI / 180)
		const radius = 20
		let seed = `${index}`
		if (cycle > 0) {
			seed = `${index}${cycle}`
		}
		const rng = seedrandom(seed)
		const indexOffset = index * 0.075
		const verticalDisplacement =
			Math.sin(rng() * time * 2 * Math.PI * 0.1) * variance * indexOffset
		return new THREE.Vector3(
			radius * Math.cos(thetaInRadians),
			index * 0.6 + height + verticalDisplacement,
			radius * Math.sin(thetaInRadians)
		)
	}

	function getTargetRotation(seed, index) {
		const rng = seedrandom(`${seed}${index}`)
		const randomYRotationInDegrees = rng() * 360
		const randomYRotationInRadians = randomYRotationInDegrees * (Math.PI / 180)
		let randomZRotationInDegrees
		if (index % 4 === 0) {
			randomZRotationInDegrees = 180 + (rng() * 50 - 25)
		} else {
			randomZRotationInDegrees = rng() * 50 - 25
		}
		const randomZRotationInRadians = randomZRotationInDegrees * (Math.PI / 180)
		return new THREE.Quaternion().setFromEuler(
			new THREE.Euler(0, randomYRotationInRadians, randomZRotationInRadians)
		)
	}

	function updateRigidBody(ref, targetPosition, targetRotation) {
		ref.current.setBodyType(2)
		const position = vec3(ref.current.translation())
		const rotation = quat(ref.current.rotation())
		position.lerp(targetPosition, 0.005)
		ref.current.setNextKinematicTranslation(position)
		rotation.slerp(targetRotation, 0.005)
		ref.current.setNextKinematicRotation(rotation)
		if (updateCount < 100) setUpdateCount(updateCount + 1)
	}

	return (
		<>
			<RenderTexture targetFBO={targetFBO}>
				<Content />
			</RenderTexture>
			{screen}
		</>
	)
}
