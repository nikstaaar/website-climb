import { useEffect, useRef } from 'react';
import * as THREE from 'three'
import { Sphere, PerspectiveCamera, PointerLockControls } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

import useStore from './stores/useStore';

export default function World () {

    const gameOn = useStore((state) => {return state.gameOn})
    const hasCollided = useStore((state) => {return state.gameOn})
    const start = useStore((state) => {return state.start})

    const groundGeometry = new THREE.PlaneGeometry()

    return (
    <>
    {hasCollided? <PointerLockControls/> : null}
    <PerspectiveCamera
    makeDefault 
    manual 
    aspect={16 / 12} 
    />
    <ambientLight intensity={0.5} />
    <RigidBody key={gameOn} type={gameOn? "dynamic" : "fixed"} position={[5, 9.5, -10.5]} colliders="ball">
        <Sphere args={[5, 32, 32]} scale={0.1} onClick={()=>{
        start()
        console.log(gameOn)
        }}> 
            <meshStandardMaterial attach="material" color="blue" />
        </Sphere>
    </RigidBody>
    <RigidBody name="floor" type="fixed" restitution={0.2} friction={0.7} >
        <mesh position={[0, -108, 0]} geometry={groundGeometry} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <meshBasicMaterial color={"lavender"} />
        </mesh>
    </RigidBody>
    </>
    )
}