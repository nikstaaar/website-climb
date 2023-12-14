import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

import gameStore from '../stores/gameStore'

export default function Mouse({ matcap }) {
	const mouse = useGLTF('/public/glb/mouseplc.glb', true)
	const ref = useRef()
	const scroll = useScroll()
	const { stage } = gameStore((state) => ({
		stage: state.stage,
	}))

	useFrame((state) => {
		if (ref.current && stage != 'walking') {
			let newPosition = new THREE.Vector3()
			if (scroll.offset > 0.5 && scroll.offset < 0.65) {
				const currentPosition = ref.current.position.clone()
				const mousePosition = new THREE.Vector3(
					-state.mouse.x,
					state.mouse.y,
					0
				)
				newPosition = currentPosition.lerp(mousePosition, 0.1)
			} else {
				const currentPosition = ref.current.position.clone()
				newPosition = currentPosition.lerp(new THREE.Vector3(0, 0.3, 0), 0.1)
			}
			ref.current.position.copy(newPosition)
		}
	})

	return (
		<group ref={ref}>
			{mouse.scene.children.map((child, index) => (
				<mesh
					position={[0, -4, 0.1]}
					rotation={[1.5, -1, 0]}
					scale={0.2}
					key={index}
					geometry={child.geometry}
				>
					<meshMatcapMaterial color="#e1e1e1" matcap={matcap} />
				</mesh>
			))}
		</group>
	)
}
