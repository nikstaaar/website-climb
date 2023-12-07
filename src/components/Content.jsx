import {
	Float,
	PerspectiveCamera,
	Plane,
	Text,
	Text3D,
	shaderMaterial,
	useScroll,
	useMatcapTexture,
	useGLTF,
	useVideoTexture,
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

import gameStore from '../stores/gameStore'
import shaderStore from '../stores/shaderStore'
import vertexShader from '../shaders/vertex.glsl?raw'
import fragmentShader from '../shaders/fragment.glsl?raw'

export default function Content() {
	const { stage, setStage } = gameStore((state) => ({
		stage: state.stage,
		setStage: state.setStage,
	}))

	const {
		bigWavesElevation,
		bigWavesFrequencyX,
		bigWavesFrequencyY,
		bigWavesSpeed,
		depthColor,
		surfaceColor,
		colorOffset,
		colorMultiplier,
		smallWavesElevation,
		smallWavesFrequency,
		smallWavesSpeed,
		smallIterations,
	} = shaderStore((state) => ({
		bigWavesElevation: state.bigWavesElevation,
		bigWavesFrequencyX: state.bigWavesFrequencyX,
		bigWavesFrequencyY: state.bigWavesFrequencyY,
		bigWavesSpeed: state.bigWavesSpeed,
		depthColor: state.depthColor,
		surfaceColor: state.surfaceColor,
		colorOffset: state.colorOffset,
		colorMultiplier: state.colorMultiplier,
		smallWavesElevation: state.smallWavesElevation,
		smallWavesFrequency: state.smallWavesFrequency,
		smallWavesSpeed: state.smallWavesSpeed,
		smallIterations: state.smallIterations,
	}))

	const groupRef = useRef()
	const mouseRef = useRef()
	const buttonRef = useRef()

	const fontColor = '#353935'
	const fontHeadURL = '/public/fonts/Oswald-SemiBold.ttf'
	const fontTextURL = '/public/fonts/Oswald-Regular.ttf'
	const font3dURL = '/public/fonts/Oswald_Regular.json'
	const mdiFontUrl = '/public/fonts/materialdesignicons-webfont.ttf'

	const CustomShaderMaterial = shaderMaterial(
		{
			uMouse: new THREE.Vector2(0, 0),
			uMouseFactor: 0.5,
			uTime: 0,
			uBigWavesElevation: bigWavesElevation,
			uBigWavesFrequency: new THREE.Vector2(
				bigWavesFrequencyX,
				bigWavesFrequencyY
			),
			uBigWavesSpeed: bigWavesSpeed,
			uDepthColor: new THREE.Color(depthColor),
			uSurfaceColor: new THREE.Color(surfaceColor),
			uColorOffset: colorOffset,
			uColorMultiplier: colorMultiplier,
			uSmallWavesElevation: smallWavesElevation,
			uSmallWavesFrequency: smallWavesFrequency,
			uSmallWavesSpeed: smallWavesSpeed,
			uSmallIterations: smallIterations,
		},
		vertexShader,
		fragmentShader
	)

	const material = new CustomShaderMaterial()
	const [matcapTexture] = useMatcapTexture('7A7A7A_D9D9D9_BCBCBC_B4B4B4')
	const keyboard = useGLTF('/public/glb/keyboard.glb', true)
	const wKey = useGLTF('/public/glb/wKey.glb', true)
	const aKey = useGLTF('/public/glb/aKey.glb', true)
	const sKey = useGLTF('/public/glb/sKey.glb', true)
	const dKey = useGLTF('/public/glb/dKey.glb', true)
	const spacebar = useGLTF('/public/glb/spacebar.glb', true)
	const mouse = useGLTF('/public/glb/mouseplc.glb', true)
	const monitor = useGLTF('/public/glb/monitor.glb', true)
	const button1 = useGLTF('/public/glb/button1a.glb', true)
	const button2 = useGLTF('/public/glb/button2.glb', true)

	const scroll = useScroll()
	const texture = useVideoTexture('/public/images/example.mp4')

	function Mouse() {
		return (
			<group ref={mouseRef}>
				{mouse.scene.children.map((child, index) => (
					<mesh
						position={[0, -4, 0.1]}
						rotation={[1.5, -1, 0]}
						scale={0.2}
						key={index}
						geometry={child.geometry}
					>
						<meshMatcapMaterial color="#e1e1e1" matcap={matcapTexture} />
					</mesh>
				))}
			</group>
		)
	}

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

	const handlePointerOver = () => {
		document.body.style.cursor = 'pointer'
	}

	const handlePointerOut = () => {
		document.body.style.cursor = 'default'
	}

	useFrame((state, delta) => {
		let newPosition = new THREE.Vector3()
		material.uTime = state.clock.getElapsedTime()
		if (stage === 'website') {
			material.uMouse = new THREE.Vector2(-state.mouse.x, state.mouse.y)
			if (scroll.offset > 0.5 && scroll.offset < 0.65) {
				const currentPosition = mouseRef.current.position.clone()
				const mousePosition = new THREE.Vector3(
					-state.mouse.x,
					state.mouse.y,
					0
				)
				newPosition = currentPosition.lerp(mousePosition, 0.1)
			} else {
				const currentPosition = mouseRef.current.position.clone()
				newPosition = currentPosition.lerp(new THREE.Vector3(0, 0.3, 0), 0.1)
			}
			mouseRef.current.position.copy(newPosition)
		}
		if (groupRef.current) {
			const targetY = scroll.offset * 6
			groupRef.current.position.y = targetY
		}
	})

	return (
		<>
			<PerspectiveCamera
				makeDefault
				fov={45}
				aspect={20 / 9}
				position={[0, 0, 1.5]}
				rotation={[0, 0, 0]}
			/>
			<ambientLight intensity={0.2}></ambientLight>
			<spotLight intensity={0.3} position={[1, 1, 1]} />

			<group ref={groupRef} scale={[-1, 1, 1]}>
				<Float floatIntensity={0.2}>
					<Text3D
						position={[0.12, -0.09, 0]}
						size={0.5}
						font={font3dURL}
						height={0.05}
						lineHeight={0.9}
						letterSpacing={0.02}
						onClick={() =>
							window.open('https://github.com/nikstaaar/My-Website', '_blank')
						}
						onPointerOver={handlePointerOver}
						onPointerOut={handlePointerOut}
					>
						<meshMatcapMaterial color="white" matcap={matcapTexture} />
						{`<>`}
					</Text3D>
				</Float>
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
				<Mouse />
				<primitive position={[0, -5.9, 0]} scale={1.2} object={monitor.scene} />
				<primitive
					position={[0.125, -5.83, 0.46]}
					rotation={[0, -1.6, -1.5]}
					scale={0.03}
					object={button1.scene}
				/>
				<primitive
					ref={buttonRef}
					position={[0.125, -5.83, 0.46]}
					rotation={[0, -1.6, -1.5]}
					scale={0.03}
					object={button2.scene}
					onPointerUp={() => {
						buttonRef.current.position.z = 0.46
						setStage('falling')
					}}
					onPointerDown={() => {
						buttonRef.current.position.z = 0.45
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
				<Text
					position={[-0.5, -1.35, 0]}
					fontSize={0.08}
					font={fontTextURL}
					color={fontColor}
				>
					forward
				</Text>
				<Text
					position={[-0.17, -1.35, 0]}
					fontSize={0.08}
					font={fontTextURL}
					color={fontColor}
				>
					left
				</Text>
				<Text
					position={[0.18, -1.35, 0]}
					fontSize={0.08}
					font={fontTextURL}
					color={fontColor}
				>
					backward
				</Text>
				<Text
					position={[0.54, -1.35, 0]}
					fontSize={0.08}
					font={fontTextURL}
					color={fontColor}
				>
					right
				</Text>
				<Text
					position={[-0.02, -2.5, 0.3]}
					fontSize={0.08}
					font={fontTextURL}
					color={fontColor}
				>
					jump
				</Text>
				<Text
					position={[0, -3, 0.3]}
					fontSize={0.07}
					font={fontTextURL}
					color={fontColor}
				>
					you can use the mouse to look around
				</Text>
				<Text
					font={fontTextURL}
					position={[-0.735, 0.03, 0]}
					textAlign={'left'}
					fontSize={0.05}
					color={fontColor}
				>
					A game by
				</Text>
				<Text
					font={fontTextURL}
					position={[-0.545, 0.03, 0]}
					textAlign={'left'}
					fontSize={0.05}
					color={fontColor}
					onClick={() => window.open('https://github.com/nikstaaar', '_blank')}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
				>
					Nikstaaar
				</Text>
				<Text
					font={fontTextURL}
					position={[0.02, -0.4, 0]}
					textAlign={'left'}
					fontSize={0.05}
					maxWidth={1.7}
					color={fontColor}
				>
					Hi, I made this simple 3d platformer game with three.js and react.
					This is my first game ever and first real three.js project, so it's
					not perfect, but I hope you enjoy it. The controls are quake style and
					first person. You can read more about the controls in the next
					section. At the end of the page the game starts. Have Fun!
				</Text>
				<mesh rotation={[Math.PI / 10, 0, 0]} position={[0, -3, -2]}>
					<planeGeometry args={[8, 16, 256, 256]} />
					<primitive object={material} attach="material" />
				</mesh>
				<Text
					font={fontHeadURL}
					position={[-0.505, 0.25, 0]}
					textAlign={'left'}
					fontSize={0.2}
					maxWidth={0.5}
					color={fontColor}
					lineHeight={0.8}
				>
					WEBSITE CLIMB
				</Text>
				<Text
					font={fontHeadURL}
					position={[0.0, -0.95, 0]}
					textAlign={'left'}
					fontSize={0.17}
					maxWidth={0.5}
					color={fontColor}
					lineHeight={0.8}
				>
					CONTROLS
				</Text>
				<Text
					font={fontHeadURL}
					position={[0.0, -4.4, 0]}
					textAlign={'left'}
					fontSize={0.17}
					maxWidth={0.5}
					color={fontColor}
					lineHeight={0.8}
				>
					GOAL
				</Text>
				<Text
					position={[0, -4.75, 0]}
					fontSize={0.07}
					font={fontTextURL}
					color={fontColor}
					maxWidth={1}
					textAlign={'center'}
				>
					simply jump onto the next red platform you see. you will find it if
					you look around.
				</Text>
				<Text
					font={fontHeadURL}
					position={[0.55, -5.55, 0.4]}
					textAlign={'left'}
					fontSize={0.08}
					maxWidth={0.3}
					color={fontColor}
					lineHeight={1}
				>
					Press Button To Start
				</Text>
				<Text
					rotation={[0, 0, Math.PI]}
					font={mdiFontUrl}
					position={[0.49, -5.83, 0.4]}
					textAlign={'left'}
					fontSize={0.3}
					maxWidth={0.3}
					color={fontColor}
					lineHeight={1}
				>
					󰤲
				</Text>
				<Text
					font={fontTextURL}
					position={[0, -6.5, 0]}
					textAlign={'right'}
					fontSize={0.04}
					color={fontColor}
					onClick={() => window.open('/debug/', '_blank')}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
				>
					Debug Mode
				</Text>
				<Text
					font={fontTextURL}
					position={[0.735, -6.2, 0]}
					textAlign={'right'}
					fontSize={0.04}
					color={fontColor}
				>
					CC Attribution:
				</Text>
				<Text
					font={fontTextURL}
					position={[0.681, -6.5, 0]}
					textAlign={'right'}
					fontSize={0.03}
					color={fontColor}
					onClick={() =>
						window.open(
							'https://sketchfab.com/3d-models/computer-mouse-4a6e2b1cf5d54ed5b97da093ed1e74a4',
							'_blank'
						)
					}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
				>
					Computer mouse. by kubassa
				</Text>
				<Text
					font={fontTextURL}
					position={[0.595, -6.432, 0]}
					textAlign={'right'}
					fontSize={0.03}
					color={fontColor}
					onClick={() =>
						window.open(
							'https://sketchfab.com/3d-models/button-electronic-constructor-57c57c94333e482a8aa9b194953a4dbe',
							'_blank'
						)
					}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
				>
					button-electronic-constructor by Kroko.blend
				</Text>
				<Text
					font={fontTextURL}
					position={[0.58, -6.36, 0]}
					textAlign={'right'}
					fontSize={0.03}
					color={fontColor}
					onClick={() =>
						window.open(
							'https://sketchfab.com/3d-models/viewsonic-15-1546-crt-monitor-f42b0f44d8aa411b8ad6990d13841495',
							'_blank'
						)
					}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
				>
					Viewsonic 15 1546 CRT Monitor by Moomo0802
				</Text>
				<Text
					font={fontTextURL}
					position={[0.691, -6.284, 0]}
					textAlign={'right'}
					fontSize={0.03}
					color={fontColor}
					onClick={() =>
						window.open(
							'https://sketchfab.com/3d-models/keyboard-tx-130-a884bf6ce8b74648b6813564a443824a',
							'_blank'
						)
					}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
				>
					Keyboard TX-130 by Shelest
				</Text>
				<Plane
					args={[6, 1]}
					position={[0, 1, 0]}
					rotation={[0, 0, Math.PI / 8]}
				>
					<meshBasicMaterial color={'white'} />
				</Plane>
				<Plane
					args={[6, 1]}
					position={[0, -6.8, 0]}
					rotation={[0, 0, Math.PI / 8]}
				>
					<meshBasicMaterial color={'white'} />
				</Plane>
			</group>
		</>
	)
}
