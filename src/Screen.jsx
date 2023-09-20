import React from 'react'
import { useGLTF, useFBO } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import { useThree } from '@react-three/fiber'
import { RenderTexture } from './RenderTexture'
import Content from './Content'
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
    
    const { size, viewport } = useThree();
    const targetFBO = useFBO((size.width * viewport.dpr), (size.height * viewport.dpr))
    
    const screenModel = useGLTF('../../screen7.glb')
    const screenMeshes = screenModel.scenes[0].children
    screenMeshes.sort(compareNames)
    const facePlanes = screenMeshes.slice(screenMeshes.length/2, screenMeshes.length)
    const screenBlocks = screenMeshes.slice(0, screenMeshes.length/2)
  
    const screen = screenBlocks.map((block, index) => {
      return (
        <>
        <RigidBody type={gameOn? "dynamic" : "fixed"} colliders="hull" key={index} restitution={0.1} friction={0.5}>
          <group rotation={[0, 0, 0]}>
          <mesh geometry={block.geometry} scale={block.scale}  rotation={[Math.PI * 0.5, Math.PI * 0.5 , 0]}>
            <meshBasicMaterial color="blue"/>
          </mesh>
          <mesh geometry={facePlanes[index].geometry} scale={facePlanes[index].scale} position={[0, 1.01, 0]} rotation-y={Math.PI}>
          <meshBasicMaterial map={targetFBO.texture}/>
          </mesh>
          </ group>
        </RigidBody>
        </>
      )
    })
  
    return <>
      <RenderTexture targetFBO={targetFBO}>
        <Content />
      </RenderTexture>
    {screen}
    </>
  }