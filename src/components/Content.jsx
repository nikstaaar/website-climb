import {
	Float,
	PerspectiveCamera,
	Plane,
	Text,
	Text3D,
	useScroll,
	useMatcapTexture,
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useTranslation } from 'react-i18next'

import gameStore from '../stores/gameStore'
import Language from './Language'
import Mouse from './Mouse'
import Keyboard from './Keyboard'
import Monitor from './Monitor'
import { handlePointerOver, handlePointerOut } from '../utils/mouseOver'
import useCustomShaderMaterial from '../utils/shaderMaterial'

export default function Content() {
	const { stage, language } = gameStore((state) => ({
		stage: state.stage,
		language: state.language,
	}))

	const groupRef = useRef()

	const fontColor = '#353935'
	const fontHeadURL = '/public/fonts/Oswald-SemiBold.ttf'
	const fontTextURL = '/public/fonts/Oswald-Regular.ttf'
	const font3dURL = '/public/fonts/Oswald_Regular.json'
	const mdiFontUrl = '/public/fonts/materialdesignicons-webfont.ttf'

	const [matcapTexture] = useMatcapTexture('7A7A7A_D9D9D9_BCBCBC_B4B4B4')
	const material = useCustomShaderMaterial()
	const scroll = useScroll()
	const { t } = useTranslation()

	useFrame((state) => {
		material.uTime = state.clock.getElapsedTime()
		if (stage !== 'waking') {
			material.uMouse = new THREE.Vector2(-state.mouse.x, state.mouse.y)
		}
		if (groupRef.current) {
			const targetY = scroll.offset * 6
			groupRef.current.position.y = targetY
		}
	})

	const getPosition = () => {
		if (language === 'en' || language === 'fr') {
			return [-0.545, 0.03, 0]
		} else {
			return [-0.502, 0.03, 0]
		}
	}

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
				<Language matcap={matcapTexture} />
				<Keyboard />
				<Mouse matcap={matcapTexture} />
				<Monitor />
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
				<Text
					font={fontHeadURL}
					position={[-0.848, 0.25, 0]}
					textAlign={'left'}
					fontSize={0.2}
					maxWidth={0.5}
					color={fontColor}
					lineHeight={0.8}
					anchorX="left"
				>
					WEBSITE CLIMB
				</Text>
				<Text
					font={fontTextURL}
					position={[-0.832, 0.03, 0]}
					textAlign={'left'}
					fontSize={0.05}
					color={fontColor}
					anchorX="left"
				>
					{t('description.part1')}
				</Text>
				<Text
					font={fontTextURL}
					position={getPosition()}
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
					position={[-0.832, -0.2, 0]}
					textAlign={'left'}
					fontSize={0.05}
					maxWidth={1.6}
					color={fontColor}
					anchorY={'top'}
					anchorX={'left'}
				>
					{t('description.part2')}
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
					{t('controls.part1')}
				</Text>
				<Text
					position={[-0.5, -1.35, 0]}
					fontSize={0.08}
					font={fontTextURL}
					color={fontColor}
				>
					{t('controls.part2')}
				</Text>
				<Text
					position={[-0.17, -1.35, 0]}
					fontSize={0.08}
					font={fontTextURL}
					color={fontColor}
				>
					{t('controls.part3')}
				</Text>
				<Text
					position={[0.18, -1.35, 0]}
					fontSize={0.08}
					font={fontTextURL}
					color={fontColor}
				>
					{t('controls.part4')}
				</Text>
				<Text
					position={[0.54, -1.35, 0]}
					fontSize={0.08}
					font={fontTextURL}
					color={fontColor}
				>
					{t('controls.part5')}
				</Text>
				<Text
					position={[-0.02, -2.5, 0.3]}
					fontSize={0.08}
					font={fontTextURL}
					color={fontColor}
				>
					{t('controls.part6')}
				</Text>
				<Text
					position={[0, -3, 0.3]}
					textAlign={'center'}
					fontSize={0.07}
					font={fontTextURL}
					color={fontColor}
					maxWidth={1}
				>
					{t('controls.part7')}
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
					{t('instructions.part1')}
				</Text>
				<Text
					position={[0, -4.75, 0]}
					fontSize={0.07}
					font={fontTextURL}
					color={fontColor}
					maxWidth={1}
					textAlign={'center'}
				>
					{t('instructions.part2')}
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
					{t('instructions.part3')}
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
					position={[0.9, -6.18, 0]}
					textAlign={'right'}
					anchorX={'right'}
					anchorY={'top'}
					fontSize={0.04}
					color={fontColor}
				>
					CC Attribution:
				</Text>
				<Text
					font={fontTextURL}
					position={[0.9, -6.26, 0]}
					textAlign={'right'}
					anchorX={'right'}
					anchorY={'top'}
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
					{t('misc.part1')}
				</Text>
				<Text
					font={fontTextURL}
					position={[0.9, -6.34, 0]}
					textAlign={'right'}
					anchorX={'right'}
					anchorY={'top'}
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
					{t('misc.part2')}
				</Text>
				<Text
					font={fontTextURL}
					position={[0.9, -6.42, 0]}
					textAlign={'right'}
					anchorX={'right'}
					anchorY={'top'}
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
					{t('misc.part3')}
				</Text>
				<Text
					font={fontTextURL}
					position={[0.9, -6.5, 0]}
					textAlign={'right'}
					anchorX={'right'}
					anchorY={'top'}
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
					{t('misc.part4')}
				</Text>
				<Text
					font={fontTextURL}
					position={[0.1, -6.5, 0]}
					textAlign={'right'}
					anchorX={'right'}
					anchorY={'top'}
					fontSize={0.04}
					color={fontColor}
					onClick={() => window.open('/debug/', '_blank')}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
				>
					{t('misc.part5')}
				</Text>
				<mesh rotation={[Math.PI / 10, 0, 0]} position={[0, -3, -2]}>
					<planeGeometry args={[8, 16, 256, 256]} />
					<primitive object={material} attach="material" />
				</mesh>
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
