import { PerspectiveCamera, Environment, Cylinder } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import gameStore from '../stores/gameStore'

function Wall({ position, rotation }) {
	return (
		<RigidBody type="fixed" colliders="cuboid">
			<mesh
				position={[position[0], position[1], position[2]]}
				rotation={[rotation[0], rotation[1], rotation[2]]}
			>
				<boxGeometry args={[200, 200, 1]}></boxGeometry>
				<meshBasicMaterial opacity={0} transparent />
			</mesh>
		</RigidBody>
	)
}

export default function World() {
	const { stage, level, goalPositions } = gameStore((state) => ({
		stage: state.stage,
		level: state.level,
		goalPositions: state.goalPositions,
	}))
	return (
		<>
			<Environment background files={'/public/env/puresky_8k.hdr'} />
			<PerspectiveCamera makeDefault manual aspect={16 / 9} />
			<ambientLight intensity={1} />
			<RigidBody
				name="floor"
				type="fixed"
				colliders="cuboid"
				restitution={0.1}
				friction={0.7}
			>
				<mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
					<boxGeometry args={[200, 200, 1]}></boxGeometry>
					<meshStandardMaterial
						roughness={0.6}
						metalness={0}
						color={'#202026'}
					/>
				</mesh>
			</RigidBody>
			<Wall rotation={[0, Math.PI / 2, 0]} position={[100, 100, 0]}></Wall>
			<Wall rotation={[0, Math.PI / 2, 0]} position={[-100, 100, 0]}></Wall>
			<Wall rotation={[0, 0, Math.PI / 2]} position={[0, 100, 100]}></Wall>
			<Wall rotation={[0, 0, Math.PI / 2]} position={[0, 100, -100]}></Wall>
			<Wall rotation={[Math.PI / 2, 0, 0]} position={[0, 200, 0]}></Wall>
			{stage === 'walking' && (level === 0 || level === 1) ? (
				<RigidBody
					type={'fixed'}
					colliders="cuboid"
					position={goalPositions[0]}
				>
					<Cylinder args={[2, 2, 0.6]}>
						<meshBasicMaterial color={level === 0 ? '#ff5f64' : '#63b376'} />
					</Cylinder>
				</RigidBody>
			) : null}
			{level === 1 || level === 2 ? (
				<RigidBody type="fixed" colliders="cuboid">
					<Cylinder args={[2, 2, 0.6]} position={goalPositions[1]}>
						<meshBasicMaterial color={level === 2 ? '#63b376' : '#ff5f64'} />
					</Cylinder>
				</RigidBody>
			) : null}
			{level === 2 && stage === 'walking' ? (
				<RigidBody type="fixed" colliders="cuboid">
					<Cylinder args={[2, 2, 0.6]} position={goalPositions[2]}>
						<meshBasicMaterial color={'#ff5f64'} />
					</Cylinder>
				</RigidBody>
			) : null}
		</>
	)
}
