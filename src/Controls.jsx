import useStore from './stores/useStore'
import { useControls } from 'leva'
import { useEffect, useState } from 'react'

export default function Controls() {
	const {
		setLevel,
		level,
		setStage,
		stage,
		setMoveSpeed,
		moveSpeed,
		setJumpHeight,
		jumpHeight,
		setDebug,
		debug,
	} = useStore((state) => ({
		setLevel: state.setLevel,
		level: state.level,
		setStage: state.setStage,
		stage: state.stage,
		setMoveSpeed: state.setMoveSpeed,
		moveSpeed: state.moveSpeed,
		setJumpHeight: state.setJumpHeight,
		jumpHeight: state.jumpHeight,
		setDebug: state.setDebug,
		debug: state.debug,
	}))

	const [isInitialRender, setIsInitialRender] = useState(true)

	const controls = useControls({
		level: level,
		stage: stage,
		jumpHeight: jumpHeight,
		moveSpeed: moveSpeed,
		debug: debug,
	})

	useEffect(() => {
		setLevel(controls.level)
	}, [controls.level])

	useEffect(() => {
		setStage(controls.stage)
	}, [controls.stage])

	useEffect(() => {
		setMoveSpeed(controls.moveSpeed)
	}, [controls.moveSpeed])

	useEffect(() => {
		setJumpHeight(controls.jumpHeight)
	}, [controls.jumpHeight])

	useEffect(() => {
		if (isInitialRender) {
			setIsInitialRender(false)
			return
		}
		setDebug()
	}, [controls.debug])
}
