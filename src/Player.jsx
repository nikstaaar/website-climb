import { Box, useKeyboardControls, PointerLockControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody, useRapier, CuboidCollider, vec3, quat } from "@react-three/rapier"
import { useRef, useEffect, useState } from "react"
import * as THREE from 'three'
import useStore from './stores/useStore'

export default function Player () {

    const level = useStore((state) => {return state.level})
    const setLevel = useStore((state) => {return state.setLevel})
    const stage = useStore((state) => {return state.stage})
    const setStage = useStore((state) => {return state.setStage})
    const moveSpeed = useStore((state) => {return state.moveSpeed})
    const jumpHeight = useStore((state) => {return state.jumpHeight})
    const goalPositions = useStore((state) => {return state.goalPositions})
    const falling = useStore((state) => {return state.falling})
    const setFalling = useStore((state) => {return state.setFalling})
  
    const { world } = useRapier()

    const [startReset, setStartReset] = useState(false)
    const [isResetting, setIsResetting] = useState(false)
    
    const body = useRef(null)
    const controller = useRef(null)
    const collider = useRef(null)
    const pointerControls = useRef(null)
    const refState = useRef({
        grounded: false,
        jumping: false,
        velocity: vec3()
      })

   

    function goalPosition(){
      if (level === "level_0"){
        return goalPositions[0]
      } 
      if (level === "level_1"){
        return goalPositions[1]
      }
      if (level === "level_2"){
        return goalPositions[2]
      }
      if (level === "level_3"){
        return goalPositions[3]
      }
    }

    function goalReached(){
      if (level === "level_0"){
        setLevel("level_1")
      }
      if (level === "level_1"){
        setLevel("level_2")
      }
      if (level === "level_2"){
        pointerControls.current.unlock()
        setStage("reset")
      }
    }
  
    useEffect(() => {
        if(falling && body.current){
          body.current.setBodyType(0)
          body.current.setEnabled(false)
          body.current.setEnabled(true) 
        }
    }, [falling])

    useEffect(() => {
      if(stage === "floor" || stage === "walking"){
        body.current.setBodyType(2)
      }
    }, [stage])

    useEffect(() => {
      if(startReset){
        setTimeout(() => {
          setIsResetting(true)
        }, 2000)
      }
    }, [startReset])

    useEffect(() => {
        const characterController = world.createCharacterController(0.1)
        characterController.setApplyImpulsesToDynamicBodies(true)
        characterController.setCharacterMass(0.2)
        characterController.enableSnapToGround(0.02)
        characterController.enableAutostep(0.02)
        controller.current = characterController

      }, [world])

    const [subscribeKeys, getKeys] = useKeyboardControls()
    
    useFrame((state, delta) => {

      const bodyPosition = body.current.translation()
      const position = vec3(bodyPosition)
      state.camera.position.copy(position) 
      const rotation = quat(body.current.rotation())

      const { velocity } = refState.current
      const movement = vec3()
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion)
      const backward = forward.clone().negate()
      const strafeRight = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0))
      const strafeLeft = strafeRight.clone().negate()

      const keys = getKeys()

      if (keys.forward) {
        movement.add(forward)
      }

      if (keys.backward) {
        movement.add(backward)
      }
      if (keys.leftward) {
        movement.add(strafeLeft)
      }
      if (keys.rightward) {
        movement.add(strafeRight)
      }

      if (refState.current.grounded && keys.jump) {
        velocity.y = jumpHeight
      }

      if (!refState.current.grounded) {
        velocity.y -= (9.807 * delta) / 20
      }   

      if(level === "level_2" && position.y <= 30)
          { position.copy(new THREE.Vector3(13.6, 65, -19)) }
      
      if(stage === "walking"){
        movement.normalize()
        movement.multiplyScalar(moveSpeed)
        movement.add(velocity)
        controller.current.computeColliderMovement(collider.current, movement)
        refState.current.grounded = controller.current.computedGrounded()
        let correctedMovement = controller.current.computedMovement()
        position.add(vec3(correctedMovement))
        body.current.setNextKinematicTranslation(position)
        const t = body.current.translation()
        const gP = goalPosition()
        if(t.x < gP[0] + 1.5 && t.x > gP[0] -1.5 && 
          t.y < gP[1] + 2 && t.y > gP[1] + 1.8 && 
          t.z < gP[2] + 1.5 && t.z > gP[2] -1.5){ 
            goalReached() }
      }  

      if(stage !== "walking"){
        const bodyEuler = new THREE.Euler().setFromQuaternion(rotation);
        state.camera.rotation.copy(bodyEuler)
      }

      if (body.current.isSleeping() && stage === "falling") {
        setStage("floor")
      }

      function easeOutExpo(time) {
        return time === 1 ? 1 : 1 - Math.pow(2, -10 * time)
      }

      if(stage === "floor"){
        setFalling(false)
        body.current.wakeUp(true)
        const targetRotation = new THREE.Quaternion(0, 0, 0, 1)
        const angleDifference = rotation.angleTo(targetRotation)
        if (angleDifference > 0.05) {
          const newRotation = rotation.clone()
          let time = 0
          time += 0.004
          const step = easeOutExpo(time)
          newRotation.slerp(targetRotation, step)
          body.current.setNextKinematicRotation(newRotation)
        } else {
          setStage("walking")
      }}
      
      if(stage === "reset"){
        const targetRotation = new THREE.Quaternion()
        targetRotation.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))
        const targetPosition = new THREE.Vector3(0, 130.3, -0.4)
        const angleDifference = rotation.angleTo(targetRotation)
        const distance = position.distanceTo(targetPosition)
        if (angleDifference != 0 && distance != 0) {
          const newRotation = rotation.clone()
          const newPosition = position.clone()
          let time = 0
          time += 0.004
          const step = easeOutExpo(time)
          newRotation.slerp(targetRotation, step)
          newPosition.lerp(targetPosition, step)
          setStartReset(true)
          if(isResetting){
            body.current.setNextKinematicRotation(newRotation)
            body.current.setNextKinematicTranslation(newPosition)
          }
        } else { 
          body.current.setBodyType(1)
          setLevel("level_3") }
      }
  })
   
    return(
    <>
    <RigidBody 
    type={"fixed"}
    colliders={false}
    ref={body}
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, 130.3, -0.4]}
    >
      <Box args={[1, 3, 1]}>
        <meshStandardMaterial transparent opacity={0} />
      </Box>
      <CuboidCollider 
        mass={30} 
        restitution={0.2} 
        args={[0.5, 1.5, 0.5]} 
        ref={collider} 
      />
    </RigidBody>
    {stage==="walking" ? <PointerLockControls ref={pointerControls}
    /> : null}
    </>
    )
}