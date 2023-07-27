import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function RenderToTexture() {
  const { gl, scene, camera, size } = useThree();
  const renderTarget = useRef(new THREE.WebGLRenderTarget(size.width, size.height));

  useFrame(() => {
    // Update your scene and camera here if needed

    // Render the scene to the render target
    gl.setRenderTarget(renderTarget.current);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  // Return a material with the render target's texture
  const texture = renderTarget.current.texture;
  return <meshBasicMaterial map={texture} />;
}
