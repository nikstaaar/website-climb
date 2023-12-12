import { useRef } from 'react'
import { useGLTF, useVideoTexture, Plane } from '@react-three/drei'

import gameStore from '../stores/gameStore'
import { handlePointerOver, handlePointerOut } from '../utils/mouseOver'

export default function Monitor() {
	const monitor = useGLTF('/public/glb/monitor.glb', true)
	const button1 = useGLTF('/public/glb/button1a.glb', true)
	const button2 = useGLTF('/public/glb/button2.glb', true)
	const texture = useVideoTexture('/public/images/example.mp4')

	const { setStage } = gameStore((state) => ({ setStage: state.setStage }))

	const ref = useRef()

	return (
		<>
			<primitive position={[0, -5.9, 0]} scale={1.2} object={monitor.scene} />
			<primitive
				position={[0.125, -5.83, 0.46]}
				rotation={[0, -1.6, -1.5]}
				scale={0.03}
				object={button1.scene}
			/>
			<primitive
				ref={ref}
				position={[0.125, -5.83, 0.46]}
				rotation={[0, -1.6, -1.5]}
				scale={0.03}
				object={button2.scene}
				onPointerUp={() => {
					ref.current.position.z = 0.46
					setStage('falling')
				}}
				onPointerDown={() => {
					ref.current.position.z = 0.45
				}}
				onPointerOver={handlePointerOver}
				onPointerOut={handlePointerOut}
			/>
			<Plane
				rotation={[-0.07, 0, 0]}
				position={[0, -5.5, 0.44]}
				args={[0.55, 0.47]}
			>
				<meshBasicMaterial map={texture} toneMapped={false} />
			</Plane>
		</>
	)
}
