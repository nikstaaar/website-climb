import { Box, useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody, useRapier, CuboidCollider, vec3, quat } from "@react-three/rapier"
import { useRef, useEffect } from "react"
import { useControls } from "leva"
import * as THREE from 'three'
import useStore from './stores/useStore'

export default function Player () {

    const level = useStore((state) => {return state.level})
    const stage = useStore((state) => {return state.stage})
    const setStage = useStore((state) => {return state.setStage})

    const rapier = useRapier()
    
    const body = useRef()
    const controller = useRef()
    const collider = useRef(null)
    const refState = useRef({
        grounded: false,
        jumping: false,
        velocity: vec3()
      })

    const controls = useControls({
      jumpHeight: 0.27,
    })
  
    useEffect(() => {
        if(stage==="falling" && body.current){
            setTimeout(() => {
              body.current.setBodyType(0)
              body.current.setEnabled(false)
              body.current.setEnabled(true)
            }, "7000") 
        }
    }, [stage])

    useEffect(() => {
        const characterController = rapier.world.createCharacterController(0.5)
        characterController.setApplyImpulsesToDynamicBodies(true)
        characterController.setCharacterMass(0.2)
        characterController.enableSnapToGround(0.02)
        characterController.enableAutostep(0.02)
        controller.current = characterController

      }, [rapier])

    const [subscribeKeys, getKeys] = useKeyboardControls()
    
    useFrame((state, delta) => {
      const keys = getKeys()
      const { velocity } = refState.current
      const movement = vec3()
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion)
      const backward = forward.clone().negate()
      const strafeRight = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0))
      const strafeLeft = strafeRight.clone().negate();
      let moveSpeed = 0.15

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
        velocity.y = controls.jumpHeight
      }

      if (!refState.current.grounded) {
        velocity.y -= (9.807 * delta) / 20
      }   
      
      const bodyPosition = body.current.translation()
      const position = vec3(bodyPosition)
      state.camera.position.copy(bodyPosition)
      const bodyQuaternion = quat(body.current.rotation())
      
      if (body.current.isSleeping() && stage === "falling") {
        setStage("floor")
      }

      if(stage !== "walking"){
        const bodyEuler = new THREE.Euler().setFromQuaternion(bodyQuaternion);
        state.camera.rotation.copy(bodyEuler)
      }

      if(stage === "floor" || stage === "walking" ){
      body.current.setBodyType(2)
      const targetRotation = new THREE.Quaternion(0, 0, 0, 1)
      const angleDifference = bodyQuaternion.angleTo(targetRotation)

      if (angleDifference > 0.05) {
        const newRotation = bodyQuaternion.clone()
        function easeOutExpo(t) {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        }
        let t = 0
        t += 0.004
        const step = easeOutExpo(t)
        newRotation.slerp(targetRotation, step)
        body.current.setNextKinematicRotation(newRotation)
      } else {
        setStage("walking")
      }

      if(level==="level_2" && position.y <= 30)
          {
            console.log("resetting")
            position.copy(new THREE.Vector3(13.6, 65, -19))
          }

      if(stage === "walking"){
        movement.normalize()
        movement.multiplyScalar(moveSpeed)
        movement.add(velocity)
        controller.current.computeColliderMovement(collider.current, movement)
        refState.current.grounded = controller.current.computedGrounded()
        let correctedMovement = controller.current.computedMovement()
        position.add(vec3(correctedMovement))
        body.current.setNextKinematicTranslation(position)
      }}}
      )
   
    return(<>
    <RigidBody
    name="player"
    type={"fixed"}
    colliders={false}
    ref={body}
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, 129.80, 0]}
    >
        <Box args={[1, 3, 1]}>
            <meshStandardMaterial transparent opacity={0} />
        </Box>
        <CuboidCollider mass={30} restitution={0.2} args={[0.5, 1.5, 0.5]} ref={collider} />
    </RigidBody>
    </>
    )
}