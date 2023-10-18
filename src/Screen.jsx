import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useGLTF, useFBO } from "@react-three/drei"
import { RigidBody, vec3, quat } from "@react-three/rapier"
import { useThree, useFrame } from '@react-three/fiber'
import { RenderTexture } from './RenderTexture'
import { useControls } from 'leva'
import seedrandom from 'seedrandom'
import * as THREE from 'three'
import Content from './Content'
import useStore from './stores/useStore'

function compareNames(a, b) {
   const nameA = a.name.toUpperCase()
   const nameB = b.name.toUpperCase()
   if (nameA < nameB) {
     return -1
   }
   if (nameA > nameB) {
     return 1
   }
   return 0
}

export default function Screen() {
    const controls = useControls({
    level: "level_0",
    })

    const stage = useStore((state) => {return state.stage})
    const setStage = useStore((state) => {return state.setStage})
    const level = useStore((state) => {return state.level})
    const setLevel = useStore((state) => {return state.setLevel})
    const [updateCount, setUpDateCount] = useState(0)
    const [hasResetted, setHasResetted] = useState(false)

    useEffect(() => {
      setLevel(controls.level)
    },[controls.level]) 
    
    const { size, viewport } = useThree()
    const targetFBO = useFBO((size.height * (21/9) * viewport.dpr), (size.height * viewport.dpr))

    const screenModel = useGLTF("../../screen22.glb")
    const screenMeshes = screenModel.scenes[0].children
    screenMeshes.sort(compareNames)
    const facePlanes = screenMeshes.slice(screenMeshes.length/2, screenMeshes.length)
    const screenBlocks = screenMeshes.slice(0, screenMeshes.length/2)

    const rigidBodyRefs = useRef([])

    const screen = screenBlocks.map((block, index) => {
      if (!rigidBodyRefs.current[index]) {
        rigidBodyRefs.current[index] = React.createRef()
      }
      const plane = facePlanes[index]
      return (
        <RigidBody 
        ref={rigidBodyRefs.current[index]}  
        position={[0, 110, 0]} 
        type={"fixed"} 
        colliders="hull" 
        key={index} 
        restitution={0.5} 
        mass={20} 
        friction={0.5}
        >
          <mesh geometry={block.geometry} position={block.position} scale={block.scale} rotation={block.rotation}>
            <meshStandardMaterial 
            color="blue"
            emissive="blue"
            wireframe={true}
            emissiveIntensity={1.5}>
            </meshStandardMaterial>
          </mesh>
          <mesh geometry={plane.geometry} position={plane.position} scale={plane.scale} rotation={plane.rotation}>
            <meshStandardMaterial map={targetFBO.texture} />
          </mesh>
          <mesh 
          geometry={plane.geometry} 
          position-x={plane.position.x} 
          position-y={plane.position.y-0.003}
          position-z={plane.position.z}
          scale={plane.scale} 
          rotation={plane.rotation}>
            <meshStandardMaterial side={THREE.BackSide} color={"blue"} />
          </mesh>
        </RigidBody>
      )
    })

    useEffect(() => {
      if(stage==="falling"){
          rigidBodyRefs.current.forEach((ref, index) => {
          const delay = 40
          setTimeout(() => {
            ref.current.setBodyType(0)
          }, (delay * index) + ((index-1)*delay))
        })
      }
    }, [stage])

    useEffect(() => {
      if(level === "level_1"){
        rigidBodyRefs.current.forEach((ref) => {
          ref.current.setBodyType(0)
        })
      }
    }, [level])

    useFrame((time) => {
      switch (level) {
          case "level_0":
              updateForLevel0();
              break
          case "level_1":
              updateForLevel1(time.clock.elapsedTime)
              break
          case "level_2":
              updateForLevel2(time.clock.elapsedTime)
              break
          case "level_3":
              updateForLevel3()
              break
      }
  })
  
  function updateForLevel0() {
      rigidBodyRefs.current.forEach((ref) => {
          if (stage === "walking" && !ref.current.isMoving()) {
              ref.current.setBodyType(1)
          }
          if (stage === "website") {
              const targetPosition = new THREE.Vector3(0, 110, 0)
              const targetRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler( 0, 0, 0))
              ref.current.setBodyType(1)
              ref.current.setTranslation(targetPosition)
              ref.current.setRotation(targetRotation)
          }
      })
  }
  
  function updateForLevel1(time) {
      rigidBodyRefs.current.forEach((ref, index) => {
          const height = 1.2
          const variance = 0.5
          const targetPosition = getTargetPosition(time, index, height, variance)
          const targetRotation = getTargetRotation("seed15", index)
          updateRigidBody(ref, targetPosition, targetRotation, index)
      })
  }

  function updateForLevel2(time) {
    rigidBodyRefs.current.forEach((ref, index) => {
        const height = 61
        const variance = 10.5
        const targetPosition = getTargetPosition(time, index, height, variance)
        const adjustedPosition = new THREE.Vector3(targetPosition.x + 10, targetPosition.y, targetPosition.z)
        const targetRotation = getTargetRotation("seed12", index)
        updateRigidBody(ref, adjustedPosition, targetRotation, index)
    })
}

  function updateForLevel3() {
  rigidBodyRefs.current.forEach((ref, index) => {
      const targetPosition = new THREE.Vector3(0, 110, 0)
      const targetRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler( 0, 0, 0))
      updateRigidBody(ref, targetPosition, targetRotation, index)
      if (!hasResetted){
        setHasResetted(true)
        setTimeout(() => {
          setStage("website")
          setLevel("level_0")
      }, 30000)
      }
  })
}
  
  function getTargetPosition(time, index, height, variance) {
      const degreeIncrement = 360 / rigidBodyRefs.current.length
      const thetaInRadians = (index * degreeIncrement) * (Math.PI / 180)
      const radius = 20
      const rng = seedrandom(`${index}`)
      const indexOffset = index * 0.075
      const verticalDisplacement = Math.sin(rng()* time * 2 * Math.PI * 0.1) * variance * indexOffset
      return new THREE.Vector3(
          radius * Math.cos(thetaInRadians),
          (index * 0.60) + height + verticalDisplacement,
          radius * Math.sin(thetaInRadians)
      );
  }

  function getTargetRotation(seed, index) {
    const rng = seedrandom(`${seed}${index}`)
    const randomYRotationInDegrees = rng() * 360;
    const randomYRotationInRadians = randomYRotationInDegrees * (Math.PI / 180);
    let randomZRotationInDegrees;
    if (index % 4 === 0) {
        randomZRotationInDegrees = 180 + (rng() * 50 - 25)
    } else {
        randomZRotationInDegrees = rng() * 50 - 25
    }
    const randomZRotationInRadians = randomZRotationInDegrees * (Math.PI / 180)
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(
        0,
        randomYRotationInRadians,
        randomZRotationInRadians
    ));
}

  function updateRigidBody(ref, targetPosition, targetRotation) {
      ref.current.setBodyType(2)
      const position = vec3(ref.current.translation())
      const rotation = quat(ref.current.rotation())
      position.lerp(targetPosition, 0.005)
      ref.current.setNextKinematicTranslation(position)
      rotation.slerp(targetRotation, 0.005)
      ref.current.setNextKinematicRotation(rotation)
      if(updateCount < 100)
      setUpDateCount(updateCount + 1)
  }
  
    return <>
      <RenderTexture targetFBO={targetFBO}>
        <Content />
      </RenderTexture>
    {screen}
    </>
  }