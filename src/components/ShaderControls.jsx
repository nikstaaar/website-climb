import shaderStore from '../stores/shaderStore'
import { useControls } from 'leva'
import { useEffect } from 'react'

export default function ShaderControls() {
	const {
		setBigWavesElevation,
		bigWavesElevation,
		setBigWavesFrequencyX,
		bigWavesFrequencyX,
		setBigWavesFrequencyY,
		bigWavesFrequencyY,
		setBigWavesSpeed,
		bigWavesSpeed,
		setDepthColor,
		depthColor,
		setSurfaceColor,
		surfaceColor,
		setColorOffset,
		colorOffset,
		setColorMultiplier,
		colorMultiplier,
		setSmallWavesElevation,
		smallWavesElevation,
		setSmallWavesFrequency,
		smallWavesFrequency,
		setSmallWavesSpeed,
		smallWavesSpeed,
		setSmallIterations,
		smallIterations,
	} = shaderStore((state) => ({
		setBigWavesElevation: state.setBigWavesElevation,
		bigWavesElevation: state.bigWavesElevation,
		setBigWavesFrequencyX: state.setBigWavesFrequencyX,
		bigWavesFrequencyX: state.bigWavesFrequencyX,
		setBigWavesFrequencyY: state.setBigWavesFrequencyY,
		bigWavesFrequencyY: state.bigWavesFrequencyY,
		setBigWavesSpeed: state.setBigWavesSpeed,
		bigWavesSpeed: state.bigWavesSpeed,
		setDepthColor: state.setDepthColor,
		depthColor: state.depthColor,
		setSurfaceColor: state.setSurfaceColor,
		surfaceColor: state.surfaceColor,
		setColorOffset: state.setColorOffset,
		colorOffset: state.colorOffset,
		setColorMultiplier: state.setColorMultiplier,
		colorMultiplier: state.colorMultiplier,
		setSmallWavesElevation: state.setSmallWavesElevation,
		smallWavesElevation: state.smallWavesElevation,
		setSmallWavesFrequency: state.setSmallWavesFrequency,
		smallWavesFrequency: state.smallWavesFrequency,
		setSmallWavesSpeed: state.setSmallWavesSpeed,
		smallWavesSpeed: state.smallWavesSpeed,
		setSmallIterations: state.setSmallIterations,
		smallIterations: state.smallIterations,
	}))

	const controls = useControls('shader', {
		depthColor: depthColor,
		surfaceColor: surfaceColor,
		bigWavesFrequencyX: {
			value: bigWavesFrequencyX,
			min: 0,
			max: 10,
			step: 0.01,
		},
		bigWavesFrequencyY: {
			value: bigWavesFrequencyY,
			min: 0,
			max: 10,
			step: 0.01,
		},
		bigWavesSpeed: { value: bigWavesSpeed, min: 0, max: 10, step: 0.01 },
		bigWavesElevation: {
			value: bigWavesElevation,
			min: 0,
			max: 1,
			step: 0.001,
		},
		colorOffset: { value: colorOffset, min: 0, max: 1, step: 0.001 },
		colorMultiplier: { value: colorMultiplier, min: 0, max: 10, step: 0.01 },
		smallWavesElevation: {
			value: smallWavesElevation,
			min: 0,
			max: 1,
			step: 0.001,
		},
		smallWavesFrequency: {
			value: smallWavesFrequency,
			min: 0,
			max: 10,
			step: 1,
		},
		smallWavesSpeed: { value: smallWavesSpeed, min: 0, max: 2, step: 0.002 },
		smallIterations: { value: smallIterations, min: 0, max: 10, step: 1 },
	})

	useEffect(() => {
		setBigWavesFrequencyX(controls.bigWavesFrequencyX)
	}, [controls.bigWavesFrequencyX])

	useEffect(() => {
		setBigWavesFrequencyY(controls.bigWavesFrequencyY)
	}, [controls.bigWavesFrequencyY])

	useEffect(() => {
		setBigWavesElevation(controls.bigWavesElevation)
	}, [controls.bigWavesElevation])

	useEffect(() => {
		setBigWavesSpeed(controls.bigWavesSpeed)
	}, [controls.bigWavesSpeed])

	useEffect(() => {
		setDepthColor(controls.depthColor)
	}, [controls.depthColor])

	useEffect(() => {
		setSurfaceColor(controls.surfaceColor)
	}, [controls.surfaceColor])

	useEffect(() => {
		setColorOffset(controls.colorOffset)
	}, [controls.colorOffset])

	useEffect(() => {
		setColorMultiplier(controls.colorMultiplier)
	}, [controls.colorMultiplier])

	useEffect(() => {
		setSmallWavesElevation(controls.smallWavesElevation)
	}, [controls.smallWavesElevation])

	useEffect(() => {
		setSmallWavesFrequency(controls.smallWavesFrequency)
	}, [controls.smallWavesFrequency])

	useEffect(() => {
		setSmallWavesSpeed(controls.smallWavesSpeed)
	}, [controls.smallWavesSpeed])

	useEffect(() => {
		setSmallIterations(controls.smallIterations)
	}, [controls.smallIterations])
}
