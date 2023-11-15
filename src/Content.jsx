import { PerspectiveCamera, Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, useEffect, useState } from "react"
import useStore from "./stores/useStore"

export default function Content () {
    const camera2 = useRef()
    const group = useRef()
    const name = useRef()
    const backGround = useRef()

    const [targetY, setTargetY] = useState(0)
    const setStage = useStore((state) => {return state.setStage})
  
    const fontColor = "black"

    const handleWheel = (event) => {
        if (!group.current) return
        const zoomFactor = -0.001
        const newTargetY = targetY - event.deltaY * zoomFactor
        if ((group.current.position.y !== 0) || event.deltaY < 0) {
            setTargetY(newTargetY)
        }
      }

    useEffect(() => {
        window.addEventListener('wheel', handleWheel)
        return () => {
            window.removeEventListener('wheel', handleWheel)
        }
    })

    useFrame(() => {
        if (group.current) {
            const lerpFactor = 0.1
            group.current.position.y += (targetY - group.current.position.y) * lerpFactor;
        }
    })

    return (
    <>
    <PerspectiveCamera 
        ref={camera2}
        makeDefault
        fov={45}
        aspect={20 / 9} 
        position={[0, 0, 1.5]}    
        rotation={[0, 0, 0]}
    />
    <ambientLight intensity={0.5}></ambientLight>
    <group rotation={[0, 0, 0]} scale={[-1, 1, 1]}>
        <Text scale={0.05} position={[0.65 , 0.42, 0.2]} fontSize={0.6} color={fontColor}>about</Text>
        <Text scale={0.05} position={[0.40 , 0.42, 0.2]} fontSize={0.6} color={fontColor}>projects</Text>
        <Text scale={0.05} position={[0.13 , 0.42 , 0.2]} fontSize={0.6} color={fontColor}>contact</Text>
        <Text scale={0.05} position={[-0.1 , 0.42, 0.2]} fontSize={0.6} color={fontColor}>&#x2190;</Text>
        <Text scale={0.05} position={[-0.2 , 0.42, 0.2]} fontSize={0.6} color={fontColor}>&#x2190;</Text>
        <Text scale={0.05} position={[-0.3 , 0.42 , 0.2]} fontSize={0.6} color={fontColor}>&#x2190;</Text>
        <Text scale={0.05} position={[-0.4 , 0.42 , 0.2]} fontSize={0.6} color={fontColor}>&#x2190;</Text>
        <group ref={group} position={[0,0,0]}>
            <Text onClick={()=>{setStage("falling")}} ref={name} position={[-0.58, 0.1, 0]} textAlign ={"left"} fontSize={0.13} maxWidth={0.5} color={fontColor}
            >   Niklas Ostwald
            </Text>
            <Text scale={0.05} position={[0.25, 0.1, 0]} textAlign ={"left"} fontSize={1} maxWidth={20} color={fontColor}> 
                Hi, welcome to my homepage! You can play a game here if you want. Try to get the ball to the bottom of the page using the arrows at the top of the page. Have fun!</Text>
            <Text position={[-0.58, -0.8, 0]} textAlign ={"left"} fontSize={0.12} color={fontColor}>about me</Text>
            <Text scale={0.05} position={[0.25, -0.8, 0]} textAlign ={"left"} fontSize={1} maxWidth={20} color={fontColor}>I am web developer based in Hamburg. 
                I studied communications design before I made the switch to developement in 2022. I since picked up creative coding as a hobby you can see these products here on my p5.js. I also love gaming, music and travel.</Text>
            <Text position={[0.0, -1.5, 1]} textAlign ={"center"} fontSize={0.12} color={fontColor}>Projects</Text>
            <mesh ref={backGround} scale={10} position={[0, -1.5, -1]}>
                <planeBufferGeometry />
                <meshStandardMaterial roughness={0.4} color="white" /> 
            </mesh>
        </group>
    </group>
    </>
    )
}