import React from 'react'
import { Canvas} from '@react-three/fiber'
import { Stats, Sky, KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

import World from './World.jsx'
import Interface from './Interface.jsx'
import Player from './Player.jsx'
import Screen from './Screen.jsx'

import './App.css'

function App() {

  return <div style={{ width: "100vw", height: "100vh" }}>
  <KeyboardControls 
    map={ [
      {name: 'forward', keys: ['ArrowUp', 'KeyW']},
      {name: 'backward', keys: ['ArrowDown', 'KeyS']},
      {name: 'leftward', keys: ['ArrowLeft', 'KeyA']},
      {name: 'rightward', keys: ['ArrowRight', 'KeyD']},
      {name: 'jump', keys: ['Space']}
    ]}
    >
    <Canvas pixelratio={Math.min(window.devicePixelRatio, 2)} >
      <Physics >
        <Screen />
        <World />
        <Player />
      </Physics>
      <Sky />
      <Stats />
    </Canvas>
    <Interface />
  </KeyboardControls>
</div>
}

   

export default App
