import { PerspectiveCamera, Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, useEffect } from "react"

export default function Content () {
    const camera2 = useRef()
    const group = useRef()
    const pyramid = useRef()
    
    const aspectRatio =  window.innerWidth / window.innerHeight

    const handleWheel = (event) => {
        if (!group.current) return
        const zoomFactor = 0.001
        group.current.position.y -= event.deltaY * zoomFactor
      }

    useEffect(() => {
        window.addEventListener('wheel', handleWheel)
        return () => {
            window.removeEventListener('wheel', handleWheel)
        }
    })

    useFrame(() => {
        if (pyramid.current) {
            pyramid.current.rotation.x += 0.01
            pyramid.current.rotation.y += 0.01
            pyramid.current.rotation.z += 0.01
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
    <directionalLight args={[10, 10, 0]} intensity={1} />
    <ambientLight intensity={1} />
    <color attach="background" args={['darkred']} />
    <Text scale={[-1, 1, 1]} position={[0, 0, 0.2]} fontSize={0.1}>Niklas Ostwald</Text>
    <group scale={[-1, 1, 1]} ref={group}>
        <Text position={[-0.67, 1.9 , 0]} fontSize={0.03}>{window.innerWidth / window.innerHeight}</Text>
        <Text position={[-0.50, 1.85 , 0]} fontSize={0.03}>{aspectRatio}</Text>
        <mesh ref={pyramid} position={[0, 0, 0]} scale={0.15}>
          <tetrahedronGeometry attach="geometry" args={[2, 0]} />
          <meshStandardMaterial attach="material" color="green" />
        </mesh>
    </group>
    </>
    )
}