import React from 'react'
import { Canvas} from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import { Physics } from '@react-three/rapier'


import Screen from './Screen.jsx'
import World from './World.jsx'

import './App.css'

function App() {

  return <div style={{ width: "100vw", height: "100vh" }}>
  <Canvas pixelratio={Math.min(window.devicePixelRatio, 2)} >
  <Physics debug>
    <Screen />
    <World />
  </Physics>
  <Stats />
</Canvas>
</div>
}

   

export default App
