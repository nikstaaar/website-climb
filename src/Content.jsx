import React from 'react'
import { PerspectiveCamera, Text } from "@react-three/drei"

export default function Content() {
    return (
      <>
        <PerspectiveCamera makeDefault position={[0, 0, -5]} rotation={[0, Math.PI, 0]} />
        <color attach="background" args={['orange']} />
        <Text>elllooooooooooo</Text>
      </>
    )
  }