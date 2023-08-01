import React from 'react'
import * as THREE from 'three'
import { Canvas} from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import { RigidBody, Physics } from '@react-three/rapier'


import Screen from './Screen.jsx'


import './App.css'

function App() {

  const groundGeometry = new THREE.PlaneGeometry()

  return <div style={{ width: "100vw", height: "100vh" }}>
  <Canvas >
  <Physics debug>
    <OrbitControls />
    <ambientLight intensity={0.5} />
    <Screen />
    <RigidBody type="fixed" restitution={0.2} friction={0.7}>
        <mesh position={[0, -28, 0]} geometry={groundGeometry} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
    </RigidBody>
  </Physics>
  <Stats />
</Canvas>
</div>
}

   

export default App
