import { PerspectiveCamera, PointerLockControls, Environment, Cylinder } from '@react-three/drei'
import { RigidBody, quat } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import useStore from './stores/useStore'
import * as THREE from 'three'

function Wall ({position, rotation}){
    return(
        <RigidBody type='fixed' colliders="cuboid">
        <mesh 
        position={[position[0], position[1], position[2]]} 
        rotation={[rotation[0], rotation[1], rotation[2]]}
        >
            <boxGeometry args={[200, 200, 1]}></boxGeometry>
            <meshBasicMaterial opacity={0} transparent/>
        </mesh>
        </RigidBody>
    )
}

export default function World () {
    const stage = useStore((state) => {return state.stage})
    const level = useStore((state) => {return state.level})
    const cylinder = useRef()

    useFrame(() => {
        const rotation = quat(cylinder.current.rotation())
        const eulerRotation = new THREE.Euler().setFromQuaternion(rotation)
        let yRotation = eulerRotation.x
        const newRotation = quat().setFromEuler(new THREE.Euler(yRotation+=0.01, 0, 0))
        cylinder.current.setNextKinematicRotation(newRotation)
    })

    return (
    <>
    {stage==="walking"? <PointerLockControls/> : null}
    <Environment 
    background
    files={"Artboard-1.hdr"} />
    <PerspectiveCamera
    makeDefault 
    manual 
    aspect={16 / 9} 
    />
    <spotLight color={"cyan"} intensity={0.5} position={[0, 120, 0]} />
    <ambientLight intensity={0.5} />
    <RigidBody name="floor" type="fixed" colliders="cuboid" restitution={0.1} friction={0.7} >
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[200, 200, 1]}></boxGeometry>
            <meshStandardMaterial 
            roughness={0.6}
            metalness={0}
            color={"#202026"} />
        </mesh>
    </RigidBody>
    <Wall rotation={[0, Math.PI/2, 0]} position={[100, 100, 0]}></Wall>
    <Wall rotation={[0, Math.PI/2, 0]} position={[-100, 100, 0]}></Wall>
    <Wall rotation={[0, 0, Math.PI/2]} position={[0, 100, 100]}></Wall>
    <Wall rotation={[0, 0, Math.PI/2]} position={[0, 100, -100]}></Wall>
    <Wall rotation={[Math.PI/2, 0, 0]} position={[0, 200, 0]}></Wall>
    {level === "level_1" || level === "level_2" ? 
    <RigidBody type="fixed" colliders="cuboid">
    <Cylinder args={[2, 2, 0.6]} position={[13.6, 58, -19]}>
        <meshStandardMaterial color={"red"} />
    </Cylinder>
    </RigidBody>
    : null}
    <RigidBody type="fixed" colliders="cuboid">
    <Cylinder args={[2, 2, 0.6]} position={[0, 137, -15]}>
        <meshStandardMaterial color={"green"} />
    </Cylinder>
    </RigidBody>
    <RigidBody ref={cylinder} type={"kinematicPosition"} colliders="cuboid" position={[13.6,3,-19]}>
    <Cylinder args={[2, 2, 0.6]}>
        <meshStandardMaterial color={"red"} />
    </Cylinder>
    </RigidBody>
    </>
    )
}   