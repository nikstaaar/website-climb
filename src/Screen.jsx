import React from 'react'
import { useGLTF, RenderTexture } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"

import Content from "./Content"


export default function Screen() {

    const screen = useGLTF('../../screen2.glb')
    const face = useGLTF('../../face2.glb')
  
    const faceBlocks = face.scenes[0].children 
    const screenBlocks = screen.scenes[0].children.map((block, index) => {
      return (
        <RigidBody colliders="hull" key={index} restitution={0.1} friction={0.5}>
          <mesh geometry={block.geometry} scale={block.scale} rotation-x={Math.PI * 0.5} rotation-y={Math.PI * 0.5}>
            <meshBasicMaterial color="blue"/>
          </mesh>
          <mesh geometry={faceBlocks[index].geometry} scale={faceBlocks[index].scale} position={[0, 1.01, 0]} rotation-y={Math.PI}>
            <meshBasicMaterial>
              <RenderTexture attach="map" anisotropy={0}>
                <Content />
              </RenderTexture>
            </meshBasicMaterial>
          </mesh>
        </RigidBody>
      )
    })
  
    
    return <>{screenBlocks}</>
  }