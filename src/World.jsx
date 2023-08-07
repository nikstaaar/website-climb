import { useEffect, useRef } from 'react';
import * as THREE from 'three'
import { Sphere, PerspectiveCamera } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

import useStore from './stores/useStore';

export default function World () {

    const gameOn = useStore((state) => {return state.gameOn})
    const start = useStore((state) => {return state.start})

    const cameraRef = useRef();

    const handleWheel = (event) => {
        if (!cameraRef.current || gameOn) return;
      
        const zoomAmount = event.deltaY * 0.01;
        
        const minZ = -7;
        const maxZ = 7;  
      
        const desiredZ = cameraRef.current.position.z + zoomAmount;
      
        cameraRef.current.position.z = Math.max(minZ, Math.min(maxZ, desiredZ));
        cameraRef.current.updateProjectionMatrix();
      };

    useEffect(() => {
        
        window.addEventListener('wheel', handleWheel);
      
        return () => {
          window.removeEventListener('wheel', handleWheel);
        };
      }, []);

    const groundGeometry = new THREE.PlaneGeometry()

    return (
    <>
    <PerspectiveCamera  
    ref={cameraRef}
    makeDefault 
    manual 
    aspect={16 / 12} 
    position={[0, 20, -7]} 
    rotation={[-Math.PI / 2, 0, 0]} 
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
    <RigidBody type="fixed" restitution={0.2} friction={0.7}>
        <mesh position={[0, -108, 0]} geometry={groundGeometry} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
    </RigidBody>
    </>
    )
}