import * as THREE from 'three'
import React, {
	useState,
	useCallback,
	useRef,
	useImperativeHandle,
} from 'react'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'

// This is a modified version of the RenderTexture component from @react-three/drei

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
		const { size, viewport } = useThree()
		const fbo = useFBO(
			(width || size.width) * viewport.dpr,
			(height || size.height) * viewport.dpr,
			{
				samples,
				stencilBuffer,
				depthBuffer,
				generateMipmaps,
			}
		)
		const [vScene] = useState(() => new THREE.Scene())

		const uvCompute = useCallback(
			(event, state, previous) => {
				let parent = targetFBO.texture.__r3f.parent
				while (parent && !(parent instanceof THREE.Object3D)) {
					parent = parent.__r3f.parent
				}
				if (!parent) return false
				if (!previous.raycaster.camera)
					previous.events.compute(
						event,
						previous,
						previous.previousRoot?.getState()
					)
				const [intersection] = previous.raycaster.intersectObject(parent)
				if (!intersection) return false
				const uv = intersection.uv
				if (!uv) return false
				state.raycaster.setFromCamera(
					state.pointer.set(uv.x * 2 - 1, uv.y * 2 - 1),
					state.camera
				)
			},
			[fbo.texture]
		)

		useImperativeHandle(forwardRef, () => fbo.texture, [fbo])

		return (
			<>
				{createPortal(
					<Container
						renderPriority={renderPriority}
						frames={frames}
						fbo={fbo}
						targetFBO={targetFBO}
					>
						{children}
						<group onPointerOver={() => null} />
					</Container>,
					vScene,
					{ events: { compute: compute || uvCompute, priority: eventPriority } }
				)}
				<primitive object={targetFBO.texture || fbo.texture} {...props} />
			</>
		)
	}
)

function Container({ frames, renderPriority, children, fbo, targetFBO }) {
	const count = useRef(0)
	const oldAutoClear = useRef()

	useFrame((state) => {
		if (frames === Infinity || count.current < frames) {
			const renderCamera = state.camera
			oldAutoClear.current = state.gl.autoClear
			state.gl.autoClear = true
			state.gl.setRenderTarget(targetFBO || fbo) // Use the targetFBO provided or the default fbo if not provided
			state.gl.render(state.scene, renderCamera)
			state.gl.setRenderTarget(null)
			state.gl.autoClear = oldAutoClear.current
			count.current++
		}
	}, renderPriority)

	return <>{children}</>
}

export { RenderTexture }
