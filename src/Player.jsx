import { Box, useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody, useRapier, CuboidCollider, vec3 } from "@react-three/rapier"
import { useRef, useEffect } from "react"
import * as THREE from 'three'
import useStore from './stores/useStore'

export default function Player () {
    const gameOn = useStore((state) => {return state.gameOn})
    const hasCollided = useStore((state) => {return state.hasCollided})
    const collide = useStore((state) => {return state.collide})
    const hasStoodUp = useStore((state) => {return state.hasStoodUp})
    const standUp = useStore((state) => {return state.standUp})

    const rapier = useRapier()
    
    const body = useRef()
    const controller = useRef()
    const collider = useRef(null)
    const refState = useRef({
        grounded: false,
        jumping: false,
        velocity: vec3()
      })

    useEffect(() => {
        if(gameOn && body.current){
            body.current.setBodyType(0)
            body.current.setEnabled(false)
            body.current.setEnabled(true)
        }
    }, [gameOn])

    useEffect(() => {
        const characterController = rapier.world.createCharacterController(0.5)
        characterController.setApplyImpulsesToDynamicBodies(true)
        characterController.setCharacterMass(0.2)
        characterController.enableSnapToGround(0.02)
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
      let moveSpeed = 0.12

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
        velocity.y = 0.25 
      }

      if (!refState.current.grounded) {
        velocity.y -= (9.807 * delta) / 20
      }   
      
      const bodyPosition = body.current.translation()
      state.camera.position.copy(bodyPosition)
      const bodyRotation = body.current.rotation()
      const bodyQuaternion = new THREE.Quaternion(bodyRotation.x, bodyRotation.y, bodyRotation.z, bodyRotation.w)
      
      if(!hasStoodUp){
        const bodyEuler = new THREE.Euler().setFromQuaternion(bodyQuaternion);
        state.camera.rotation.copy(bodyEuler)
      }

      if(hasCollided){
        body.current.setBodyType(2)

        if(hasStoodUp){
          movement.normalize()
          movement.multiplyScalar(moveSpeed)
          movement.add(velocity)
          const position = vec3 (bodyPosition)
          controller.current.computeColliderMovement(collider.current, movement)
          refState.current.grounded = controller.current.computedGrounded()
          let correctedMovement = controller.current.computedMovement()
          position.add(vec3(correctedMovement))
          body.current.setNextKinematicTranslation(position)
       }
      
      const targetRotation = new THREE.Quaternion(0, 0, 0, 1)
      const angleDifference = bodyQuaternion.angleTo(targetRotation)

      if (angleDifference > 0.05) {
        const newRotation = bodyQuaternion.clone()
        function easeOutExpo(t) {
          return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }
        let t = 0
        t += 0.004
        const step = easeOutExpo(t)
        newRotation.slerp(targetRotation, step)
        body.current.setNextKinematicRotation(newRotation)
      } else {
        standUp()
      }
      }
      }
    )
   
    return(<>
    <RigidBody
    name="player"
    type={"fixed"}
    colliders={false}
    ref={body}  
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, 20, 0]}
    onCollisionEnter={(target)=>{
        if(target.rigidBodyObject.name === "floor"){
            setTimeout(() => {
                collide()
              }, "5000")
        }
    }}
    >
        <Box args={[1, 3, 1]}>
            <meshStandardMaterial transparent opacity={0} />
        </Box>
        <CuboidCollider mass={500} restitution={0.1} args={[0.5, 1.5, 0.5]} ref={collider} />
    </RigidBody>
    </>
    )
}