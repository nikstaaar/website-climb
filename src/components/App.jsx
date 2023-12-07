import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls, ScrollControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import World from './World.jsx'
import Interface from './Interface.jsx'
import Player from './Player.jsx'
import Screen from './Screen.jsx'
import gameStore from '../stores/gameStore.jsx'

import '/styles/App.css'

function App() {
	const debug = gameStore((state) => {
		return state.debug
	})

	const [dimensions, setDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	})

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

	return (
		<div style={dimensions}>
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
						<ScrollControls pages={7}>
							<Screen />
						</ScrollControls>
						<World />
						<Player />
					</Physics>
				</Canvas>
				<Interface />
			</KeyboardControls>
		</div>
	)
}

export default App
