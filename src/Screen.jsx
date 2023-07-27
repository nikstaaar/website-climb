import React from 'react'
import { useGLTF, RenderTexture } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"

import Content from "./Content"

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

    const screenModel = useGLTF('../../screen4.glb')
    const screenMeshes = screenModel.scenes[0].children

    screenMeshes.sort(compareNames)
    
    const facePlanes = screenMeshes.slice(screenMeshes.length/2, screenMeshes.length)
    const screenBlocks = screenMeshes.slice(0, screenMeshes.length/2)
  

    const screen = screenBlocks.map((block, index) => {
      return (
        <RigidBody type="dynamic" colliders="hull" key={index} restitution={0.1} friction={0.5}>
          <mesh geometry={block.geometry} scale={block.scale} rotation-x={Math.PI * 0.5} rotation-y={Math.PI * 0.5}>
            <meshBasicMaterial color="blue"/>
          </mesh>
          <mesh geometry={facePlanes[index].geometry} scale={facePlanes[index].scale} position={[0, 1.01, 0]} rotation-y={Math.PI}>
            <meshBasicMaterial>
              <RenderTexture attach="map" anisotropy={0}>
                <Content />
              </RenderTexture>
            </meshBasicMaterial>
          </mesh>
        </RigidBody>
      )
    })
  
    
    
    return <>{screen}</>
  }