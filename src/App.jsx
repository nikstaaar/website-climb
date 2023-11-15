import React, { useState, useEffect } from 'react'
import { Canvas} from '@react-three/fiber'
import { Stats, KeyboardControls} from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import World from './World.jsx'
import Interface from './Interface.jsx'
import Player from './Player.jsx'
import Screen from './Screen.jsx'
import Controls from './Controls.jsx'
import useStore from './stores/useStore.jsx'

import './App.css'

function App() {

    const debug = useStore((state) => {return state.debug})

    const [dimensions, setDimensions] = useState({
      width: window.innerWidth,
      height: window.innerHeight
    })
 
    useEffect(() => {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []); 

  return <div style={ dimensions }>
  <KeyboardControls 
    map={[
      {name: 'forward', keys: ['ArrowUp', 'KeyW']},
      {name: 'backward', keys: ['ArrowDown', 'KeyS']},
      {name: 'leftward', keys: ['ArrowLeft', 'KeyA']},
      {name: 'rightward', keys: ['ArrowRight', 'KeyD']},
      {name: 'jump', keys: ['Space']}
    ]}
    >
    <Canvas dpr={[1, 2]}>
      <Physics debug={debug}>
        <Screen />
        <World />
        <Player />
      </Physics>
      <Controls />
      <Stats />
    </Canvas>
    <Interface />
  </KeyboardControls>
</div>
}

export default App
