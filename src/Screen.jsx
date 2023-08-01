import React, { useRef, useState } from 'react'
import { useGLTF, useFBO, PerspectiveCamera, Sky, Environment, Text, OrbitControls } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import { useThree, useFrame, createPortal } from '@react-three/fiber';
import { RenderTexture } from './RenderTexture';
import * as THREE from 'three'




function compareNames(a, b) {
  const nameA = a.name.toUpperCase(); 
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1; 
  }
  if (nameA > nameB) {
    return 1; 
  }
  return 0; 
}




export default function Screen() {

  
  
    const targetFBO = useFBO(512, 512);


    const screenModel = useGLTF('../../screen4.glb')
    const screenMeshes = screenModel.scenes[0].children

    screenMeshes.sort(compareNames)
    
    const facePlanes = screenMeshes.slice(screenMeshes.length/2, screenMeshes.length)
    const screenBlocks = screenMeshes.slice(0, screenMeshes.length/2)
  

    const screen = screenBlocks.map((block, index) => {
      return (
        <>
        <RigidBody type="fixed" colliders="hull" key={index} restitution={0.1} friction={0.5}>
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
     <RenderTexture width={512} height={512} targetFBO={targetFBO}>
          <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 5]} />
          <Text>hellooooooooooooo</Text>
          <color attach="background" args={['orange']} />
          <directionalLight args={[10, 10, 0]} intensity={1} />
          <ambientLight intensity={1} />
          <mesh onClick={() => {
            console.log('elllloooo')
          }}>
          <boxGeometry args={[1, 500, 1]} />
          <meshStandardMaterial color="red" />
          </mesh>
      </RenderTexture>
    {screen}
    
    
    </>
  }