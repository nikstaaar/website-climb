import {
	Box,
	useKeyboardControls,
	PointerLockControls,
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import {
	RigidBody,
	useRapier,
	CuboidCollider,
	vec3,
	quat,
} from '@react-three/rapier'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

import gameStore from '../stores/gameStore'

export default function Player() {
	const {
		level,
		setLevel,
		stage,
		setStage,
		moveSpeed,
		jumpHeight,
		goalPositions,
		falling,
		setFalling,
	} = gameStore((state) => ({
		level: state.level,
		setLevel: state.setLevel,
		stage: state.stage,
		setStage: state.setStage,
		moveSpeed: state.moveSpeed,
		jumpHeight: state.jumpHeight,
		goalPositions: state.goalPositions,
		falling: state.falling,
		setFalling: state.setFalling,
	}))

	const { world } = useRapier()
	const [subscribeKeys, getKeys] = useKeyboardControls()

	const [startReset, setStartReset] = useState(false)
	const [isResetting, setIsResetting] = useState(false)

	const bodyRef = useRef(null)
	const controllerRef = useRef(null)
	const colliderRef = useRef(null)
	const controlsRef = useRef(null)
	const refState = useRef({
		grounded: false,
		jumping: false,
		velocity: vec3(),
	})

	useEffect(() => {
		if (falling && bodyRef.current) {
			bodyRef.current.setBodyType(0)
			bodyRef.current.setEnabled(false)
			bodyRef.current.setEnabled(true)
		}
	}, [falling])

	useEffect(() => {
		if (stage === 'standUp' || stage === 'walking') {
			bodyRef.current.setBodyType(2)
		}
	}, [stage])

	useEffect(() => {
		if (startReset) {
			setTimeout(() => {
				setIsResetting(true)
			}, 2000)
		}
	}, [startReset])

	useEffect(() => {
		const characterController = world.createCharacterController(0.1)
		characterController.setApplyImpulsesToDynamicBodies(true)
		characterController.setCharacterMass(0.2)
		characterController.enableSnapToGround(0.02)
		characterController.enableAutostep(0.02)
		controllerRef.current = characterController
	}, [world])

	useFrame((state, delta) => {
		const position = vec3(bodyRef.current.translation())
		const rotation = quat(bodyRef.current.rotation())
		const { velocity } = refState.current
		const movement = vec3()

		const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
			state.camera.quaternion
		)
		const backward = forward.clone().negate()
		const strafeRight = new THREE.Vector3().crossVectors(
			forward,
			new THREE.Vector3(0, 1, 0)
		)
		const strafeLeft = strafeRight.clone().negate()
		const keys = getKeys()
		const { grounded } = refState.current
		const gravity = 9.807

		if (grounded) {
			if (keys.jump) {
				velocity.y = jumpHeight
			}
		} else {
			velocity.y -= (gravity * delta) / 20
		}
		if (keys.forward) {
			movement.add(forward)
		}
		if (keys.backward) {
			movement.add(backward)
		}
		if (keys.leftward) {
			movement.add(strafeLeft)
		}
		if (keys.rightward) {
			movement.add(strafeRight)
		}

		state.camera.position.copy(position)

		if (level === 2 && position.y <= 30) {
			position.copy(new THREE.Vector3(13.6, 65, -19))
		}

		updateStage(state, position, rotation, movement, velocity)
	})

	function updateStage(state, position, rotation, movement, velocity) {
		if (stage !== 'walking') {
			const bodyEuler = new THREE.Euler().setFromQuaternion(rotation)
			state.camera.rotation.copy(bodyEuler)
		}

		switch (stage) {
			case 'falling':
				if (bodyRef.current.isSleeping()) {
					setStage('standUp')
				}
				break
			case 'standUp':
				standUp(rotation)
				break
			case 'walking':
				walk(movement, velocity, position)
				break
			case 'reset':
				reset(rotation, position)
		}
	}

	function goalReached() {
		switch (level) {
			case 0:
			case 1:
				setLevel(level + 1)
				break
			case 2:
				controlsRef.current.unlock()
				setStage('reset')
				break
		}
	}

	function walk(movement, velocity, position) {
		movement.normalize()
		movement.multiplyScalar(moveSpeed)
		movement.add(velocity)
		controllerRef.current.computeColliderMovement(colliderRef.current, movement)
		refState.current.grounded = controllerRef.current.computedGrounded()
		let correctedMovement = controllerRef.current.computedMovement()
		position.add(vec3(correctedMovement))
		bodyRef.current.setNextKinematicTranslation(position)
		const t = bodyRef.current.translation()
		const gP = goalPositions[level]
		if (
			t.x < gP[0] + 1.5 &&
			t.x > gP[0] - 1.5 &&
			t.y < gP[1] + 2 &&
			t.y > gP[1] + 1.8 &&
			t.z < gP[2] + 1.5 &&
			t.z > gP[2] - 1.5
		) {
			goalReached()
		}
	}

	function easeOutExpo(time) {
		return time === 1 ? 1 : 1 - Math.pow(2, -10 * time)
	}

	function standUp(rotation) {
		setFalling(false)
		bodyRef.current.wakeUp(true)
		const targetRotation = new THREE.Quaternion(0, 0, 0, 1)
		const angleDifference = rotation.angleTo(targetRotation)
		if (angleDifference > 0.05) {
			const newRotation = rotation.clone()
			let time = 0
			time += 0.004
			const step = easeOutExpo(time)
			newRotation.slerp(targetRotation, step)
			bodyRef.current.setNextKinematicRotation(newRotation)
		} else {
			setStage('walking')
		}
	}

	function reset(rotation, position) {
		const targetRotation = new THREE.Quaternion()
		targetRotation.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))
		const targetPosition = new THREE.Vector3(0, 130.3, -0.4)
		const angleDifference = rotation.angleTo(targetRotation)
		const distance = position.distanceTo(targetPosition)
		if (angleDifference != 0 && distance != 0) {
			const newRotation = rotation.clone()
			const newPosition = position.clone()
			let time = 0
			time += 0.004
			const step = easeOutExpo(time)
			newRotation.slerp(targetRotation, step)
			newPosition.lerp(targetPosition, step)
			setStartReset(true)
			if (isResetting) {
				bodyRef.current.setNextKinematicRotation(newRotation)
				bodyRef.current.setNextKinematicTranslation(newPosition)
			}
		} else {
			bodyRef.current.setBodyType(1)
			setLevel(3)
		}
	}

	return (
		<>
			<RigidBody
				type={'fixed'}
				colliders={false}
				ref={bodyRef}
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, 130.3, -0.4]}
			>
				<Box args={[1, 3, 1]}>
					<meshStandardMaterial transparent opacity={0} />
				</Box>
				<CuboidCollider
					mass={30}
					restitution={0.2}
					args={[0.5, 1.5, 0.5]}
					ref={colliderRef}
				/>
			</RigidBody>
			{stage === 'walking' ? <PointerLockControls ref={controlsRef} /> : null}
		</>
	)
}
