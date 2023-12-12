import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useScroll } from '@react-three/drei'
import * as THREE from 'three'

export default function Keyboard() {
	const keyboard = useGLTF('/public/glb/keyboard.glb', true)
	const wKey = useGLTF('/public/glb/wKey.glb', true)
	const aKey = useGLTF('/public/glb/aKey.glb', true)
	const sKey = useGLTF('/public/glb/sKey.glb', true)
	const dKey = useGLTF('/public/glb/dKey.glb', true)
	const spacebar = useGLTF('/public/glb/spacebar.glb', true)

	const scroll = useScroll()

	function Key({ object, target, offsetMin, offsetMax }) {
		const ref = useRef()

		const position = new THREE.Vector3(0.04, -2, 0)
		const rotation = new THREE.Euler(-0.9, 0, 0)
		let newPosition = new THREE.Vector3()
		let newRotation = new THREE.Euler()

		useFrame(() => {
			if (scroll.offset > offsetMin && scroll.offset < offsetMax) {
				const currentPosition = ref.current.position.clone()
				newPosition = currentPosition.lerp(target, 0.03)
				newRotation.set(0, 0, 0)
			} else {
				const currentPosition = ref.current.position.clone()
				newPosition = currentPosition.lerp(position, 0.03)
				newRotation.set(-0.9, 0, 0)
			}

			ref.current.position.copy(newPosition)
			ref.current.rotation.copy(newRotation)
		})
		return (
			<primitive
				ref={ref}
				position={position}
				rotation={rotation}
				scale={0.4}
				object={object.scenes[0]}
			></primitive>
		)
	}

	return (
		<>
			<primitive
				position={[0.04, -2, 0]}
				rotation={[-0.9, 0, 0]}
				scale={0.4}
				object={keyboard.scene}
			/>
			<Key
				object={wKey}
				target={new THREE.Vector3(-0.04, -1.62, 0)}
				offsetMin={0.1}
				offsetMax={0.3}
			/>
			<Key
				object={aKey}
				target={new THREE.Vector3(0.355, -1.522, 0)}
				offsetMin={0.1}
				offsetMax={0.3}
			/>
			<Key
				object={sKey}
				target={new THREE.Vector3(0.6, -1.522, 0)}
				offsetMin={0.1}
				offsetMax={0.3}
			/>
			<Key
				object={dKey}
				target={new THREE.Vector3(0.84, -1.522, 0)}
				offsetMin={0.1}
				offsetMax={0.3}
			/>
			<Key
				object={spacebar}
				target={new THREE.Vector3(0.04, -2.15, 0.3)}
				offsetMin={0.32}
				offsetMax={0.6}
			/>
		</>
	)
}
