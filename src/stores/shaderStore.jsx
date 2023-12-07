import { create } from 'zustand'

export default create((set) => {
	return {
		bigWavesElevation: 0.64,
		bigWavesFrequencyX: 0.6,
		bigWavesFrequencyY: 1.9,
		bigWavesSpeed: 0.21,
		depthColor: '#ff5f64',
		surfaceColor: '#63b376',
		colorOffset: 0.72,
		colorMultiplier: 2,
		smallWavesElevation: 0.48,
		smallWavesFrequency: 1,
		smallWavesSpeed: 0.01,
		smallIterations: 2,

		setBigWavesElevation: (bigWavesElevation) => {
			set(() => {
				return { bigWavesElevation: bigWavesElevation }
			})
		},
		setBigWavesFrequencyX: (bigWavesFrequencyX) => {
			set(() => {
				return { bigWavesFrequencyX: bigWavesFrequencyX }
			})
		},
		setBigWavesFrequencyY: (bigWavesFrequencyY) => {
			set(() => {
				return { bigWavesFrequencyY: bigWavesFrequencyY }
			})
		},
		setBigWavesSpeed: (bigWavesSpeed) => {
			set(() => {
				return { bigWavesSpeed: bigWavesSpeed }
			})
		},
		setDepthColor: (depthColor) => {
			set(() => {
				return { depthColor: depthColor }
			})
		},
		setSurfaceColor: (surfaceColor) => {
			set(() => {
				return { surfaceColor: surfaceColor }
			})
		},
		setColorOffset: (colorOffset) => {
			set(() => {
				return { colorOffset: colorOffset }
			})
		},
		setColorMultiplier: (colorMultiplier) => {
			set(() => {
				return { colorMultiplier: colorMultiplier }
			})
		},
		setSmallWavesElevation: (smallWavesElevation) => {
			set(() => {
				return { smallWavesElevation: smallWavesElevation }
			})
		},
		setSmallWavesFrequency: (smallWavesFrequency) => {
			set(() => {
				return { smallWavesFrequency: smallWavesFrequency }
			})
		},
		setSmallWavesSpeed: (smallWavesSpeed) => {
			set(() => {
				return { smallWavesSpeed: smallWavesSpeed }
			})
		},
		setSmallIterations: (smallIterations) => {
			set(() => {
				return { smallIterations: smallIterations }
			})
		},
	}
})
