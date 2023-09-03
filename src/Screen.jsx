import React, { useRef } from 'react'
import { useGLTF, useFBO, PerspectiveCamera, Text3D, Text } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import { useFrame } from '@react-three/fiber'
import { RenderTexture } from './RenderTexture'
import * as THREE from 'three'

import useStore from './stores/useStore'



function compareNames(a, b) {
  const nameA = a.name.toUpperCase()
  const nameB = b.name.toUpperCase()

  if (nameA < nameB) {
    return -1; 
  }
  if (nameA > nameB) {
    return 1; 
  }
  return 0; 
}




export default function Screen() {

    const gameOn = useStore((state) => {return state.gameOn})

    const pyramidRef = useRef()
  
    const targetFBO = useFBO(2048 * window.devicePixelRatio, 2048 * window.devicePixelRatio)

    const screenModel = useGLTF('../../screen4.glb')
    const screenMeshes = screenModel.scenes[0].children
    screenMeshes.sort(compareNames)
    
    const facePlanes = screenMeshes.slice(screenMeshes.length/2, screenMeshes.length)
    const screenBlocks = screenMeshes.slice(0, screenMeshes.length/2)

    useFrame(() => {
      if (pyramidRef.current) {
          pyramidRef.current.rotation.x += 0.01;
          pyramidRef.current.rotation.y += 0.01;
          pyramidRef.current.rotation.z += 0.01;
      }
    });
  

    const screen = screenBlocks.map((block, index) => {
      return (
        <>
        <RigidBody key={gameOn} type={gameOn? "dynamic" : "fixed"} colliders="hull" key={index} restitution={0.1} friction={0.5}>
          <mesh geometry={block.geometry} scale={block.scale} rotation-x={Math.PI * 0.5} rotation-y={Math.PI * 0.5}>
            <meshBasicMaterial color="blue"/>
          </mesh>
          <mesh geometry={facePlanes[index].geometry} scale={facePlanes[index].scale} position={[0, 1.01, 0]} rotation-y={Math.PI}>
          <meshBasicMaterial map={targetFBO.texture}/>
          </mesh>
        </RigidBody>
        </>
      )
    })
  
    
    return <>
     <RenderTexture size={[2048 * window.devicePixelRatio, 2048 * window.devicePixelRatio]} targetFBO={targetFBO}>
          <PerspectiveCamera makeDefault manual aspect={16 / 12} resolution={1080} position={[0, 0, 2]}  />
          <directionalLight args={[10, 10, 0]} intensity={1} />
          <ambientLight intensity={1} />
          <color attach="background" args={['darkred']} />
          <group scale={[-1, 1, 1]}>
              <Text scale={[1, 1, 1]} fontSize={0.1} >hellooooooooooooo</Text>
              <mesh ref={pyramidRef} position={[0, -0.5, 0]} scale={0.15}>
                <tetrahedronGeometry attach="geometry" args={[2, 0]} />
                <meshStandardMaterial attach="material" color="green" />
              </mesh>
          </group>
      </RenderTexture>
    {screen}
    
    
    </>
  }