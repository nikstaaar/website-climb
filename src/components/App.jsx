import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, Loader, ScrollControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import World from './World.jsx'
import Interface from './Interface.jsx'
import Player from './Player.jsx'
import Screen from './Screen.jsx'
import gameStore from '../stores/gameStore.jsx'

import '/styles/App.css'

function App() {
	const { stage, debug } = gameStore((state) => ({
		stage: state.stage,
		debug: state.debug,
	}))

	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	})

	const [scrollEnabled, setScrollEnabled] = useState(true)

	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	const handleKeyDown = (event) => {
		if (event.code === 'Space' && stage === 'walking') {
			setScrollEnabled(false)
		}
	}

	const handleKeyUp = (event) => {
		if (event.code === 'Space') {
			setScrollEnabled(true)
		}
	}

	return (
		<div
			style={dimensions}
			onKeyDown={handleKeyDown}
			onKeyUp={handleKeyUp}
			tabIndex={0}
		>
			<KeyboardControls
				map={[
					{ name: 'forward', keys: ['ArrowUp', 'KeyW'] },
					{ name: 'backward', keys: ['ArrowDown', 'KeyS'] },
					{ name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
					{ name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
					{ name: 'jump', keys: ['Space'] },
					{ name: 'options', keys: ['KeyO'] },
				]}
			>
				<Canvas dpr={[1, 2]}>
					<Physics debug={debug}>
						<Suspense fallback={null}>
							<Player />
						</Suspense>
						<Suspense fallback={null}>
							<World />
						</Suspense>
						<Suspense fallback={null}>
							<ScrollControls pages={7} enabled={scrollEnabled}>
								<Screen />
							</ScrollControls>
						</Suspense>
					</Physics>
				</Canvas>
				<Loader />
				<Interface />
			</KeyboardControls>
		</div>
	)
}

export default App
