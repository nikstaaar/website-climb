import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

import shaderStore from '../stores/shaderStore'
import vertexShader from '../shaders/vertex.glsl?raw'
import fragmentShader from '../shaders/fragment.glsl?raw'

export default function useCustomShaderMaterial() {
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

	return new CustomShaderMaterial()
}
