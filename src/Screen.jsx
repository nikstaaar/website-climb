import React, { useRef } from 'react'
import { useGLTF, RenderTexture } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import { useThree, useFrame } from '@react-three/fiber';
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

  const { gl, scene, camera, size } = useThree();
  const renderTarget = useRef(new THREE.WebGLRenderTarget(size.width, size.height));
  const scene2 = new THREE.Scene()
  scene2.background = new THREE.Color(0xD61C4E)
  const camera2 = new THREE.PerspectiveCamera()


  useFrame(() => {
    // Update your scene and camera here if needed

    // Render the scene to the render target
    gl.setRenderTarget(renderTarget.current);
    gl.render(scene2, camera2);
    gl.setRenderTarget(null);
  });

  // Return a material with the render target's texture
    const texture = renderTarget.current.texture;

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
          <meshBasicMaterial map={texture}/>
          </mesh>
        </RigidBody>
      )
    })
  
    
    return <>
    {screen}</>
  }