import { create } from 'zustand'

export default create((set) => {
	return {
		goalPositions: [
			[50, 1, -19],
			[13.6, 58, -19],
			[0, 128, 3],
			[0, 0, 0],
		],
		language: 'en',
		stage: 'website',
		level: 0,
		cycle: 0,
		debug: false,
		falling: false,
		jumpHeight: 0.35,
		moveSpeed: 0.25,

		setLanguage: (language) => {
			set(() => {
				return { language: language }
			})
		},
		setStage: (stage) => {
			set(() => {
				return { stage: stage }
			})
		},
		setLevel: (level) => {
			set(() => {
				return { level: level }
			})
		},
		addCycle: () => {
			set((state) => {
				return { cycle: state.cycle + 1 }
			})
		},
		setDebug: () => {
			set((state) => {
				return { debug: !state.debug }
			})
		},
		setJumpHeight: (jumpHeight) => {
			set(() => {
				return { jumpHeight: jumpHeight }
			})
		},
		setMoveSpeed: (moveSpeed) => {
			set(() => {
				return { moveSpeed: moveSpeed }
			})
		},
		setFalling: (falling) => {
			set(() => {
				return { falling: falling }
			})
		},
	}
})
