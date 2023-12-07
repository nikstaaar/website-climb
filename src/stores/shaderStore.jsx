import { create } from 'zustand'

export default create((set) => {
	return {
		bigWavesElevation: 0.2,
		bigWavesFrequencyX: 2,
		bigWavesFrequencyY: 6,
		bigWavesSpeed: 0.85,
		depthColor: '#ff5f64',
		surfaceColor: '#63b376',
		colorOffset: 0.25,
		colorMultiplier: 5,
		smallWavesElevation: 0.15,
		smallWavesFrequency: 2,
		smallWavesSpeed: 0.2,
		smallIterations: 4,

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
