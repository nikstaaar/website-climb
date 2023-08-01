import * as THREE from 'three';
import React, { useState, useCallback, useRef, useImperativeHandle } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';

const RenderTexture = React.forwardRef(
  (
    {
      children,
      compute,
      width,
      height,
      samples = 8,
      renderPriority = 0,
      eventPriority = 0,
      frames = Infinity,
      stencilBuffer = false,
      depthBuffer = true,
      generateMipmaps = false,
      targetFBO,
      ...props
    },
    forwardRef
  ) => {
    const { size, viewport } = useThree();
    const fbo = useFBO((width || size.width) * viewport.dpr, (height || size.height) * viewport.dpr, {
      samples,
      stencilBuffer,
      depthBuffer,
      generateMipmaps,
    });
    const [vScene] = useState(() => new THREE.Scene());

    const uvCompute = useCallback((event, state, previous) => {
      // Since this is only a texture it does not have an easy way to obtain the parent, which we
      // need to transform event coordinates to local coordinates. We use r3f internals to find the
      // next Object3D.
      let parent = (targetFBO.texture).__r3f.parent;
      while (parent && !(parent instanceof THREE.Object3D)) {
        parent = parent.__r3f.parent;
      }
      if (!parent) return false;
      // First, we call the previous state-onion-layers compute, this is what makes it possible to nest portals
      if (!previous.raycaster.camera) previous.events.compute(event, previous, previous.previousRoot?.getState());
      // We run a quick check against the parent, if it isn't hit there's no need to raycast at all
      const [intersection] = previous.raycaster.intersectObject(parent);
      if (!intersection) return false;
      // We take that hit's UV coords, set up this layer's raycaster, et voilà, we have raycasting on arbitrary surfaces
      const uv = intersection.uv;
      if (!uv) return false;
      state.raycaster.setFromCamera(state.pointer.set(uv.x * 2 - 1, uv.y * 2 - 1), state.camera);
    }, [fbo.texture]);

    useImperativeHandle(forwardRef, () => fbo.texture, [fbo]);

    return (
      <>
        {createPortal(
          <Container renderPriority={renderPriority} frames={frames} fbo={fbo} targetFBO={targetFBO}>
            {children}
            {/* Without an element that receives pointer events, state.pointer will always be 0/0 */}
            <group onPointerOver={() => null} />
          </Container>,
          vScene,
          { events: { compute: compute || uvCompute, priority: eventPriority } }
        )}
         <primitive object={ targetFBO.texture || fbo.texture} {...props} />
      </>
    );
  }
);

function Container({ frames, renderPriority, children, fbo, targetFBO }) {
  const count = useRef(0);
  const oldAutoClear = useRef();
  
  useFrame((state) => {
    if (frames === Infinity || count.current < frames) {
      const renderCamera = state.camera  
      oldAutoClear.current = state.gl.autoClear;
      state.gl.autoClear = true;
      state.gl.setRenderTarget(targetFBO || fbo); // Use the targetFBO provided or the default fbo if not provided
      state.gl.render(state.scene, renderCamera);
      state.gl.setRenderTarget(null);
      state.gl.autoClear = oldAutoClear.current;
      count.current++;
    }
  }, renderPriority);

  return <>{children}</>;
}

export { RenderTexture };
