import { Cylinder, Float, Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import gameStore from '../stores/gameStore'

import { handlePointerOver, handlePointerOut } from '../utils/mouseOver'

export default function Language({ matcap }) {
	const fontColor = '#353935'
	const fontTextURL = '/public/fonts/Oswald-Regular.ttf'
	const mdiFontUrl = '/public/fonts/materialdesignicons-webfont.ttf'

	const { language, setLanguage } = gameStore((state) => ({
		language: state.language,
		setLanguage: state.setLanguage,
	}))

	const cylinderRef = useRef()
	const [open, setOpen] = useState(false)
	const { i18n } = useTranslation()

	const resolvedLanguage = i18n.resolvedLanguage

	useEffect(() => {
		setLanguage(resolvedLanguage)
	}, [resolvedLanguage])

	const handleOpen = () => {
		if (open) {
			cylinderRef.current.scale.set(0.02, 0.07, 0.07)
			cylinderRef.current.position.set(-0.1, 0.1, 0)
			setOpen(false)
		} else {
			cylinderRef.current.scale.set(0.02, 0.07, 0.25)
			cylinderRef.current.position.set(-0.1, 0.01, 0)
			setOpen(true)
		}
	}

	const handleSelect = (lang) => {
		setLanguage(lang)
		handleOpen()
		i18n.changeLanguage(lang)
	}

	const positions = [
		[-0.091, 0.1, 0.01],
		[-0.091, 0.02, 0.01],
		[-0.091, -0.06, 0.01],
	]

	const getPositionEng = () => {
		if (language === 'en') {
			return positions[0]
		} else {
			return positions[1]
		}
	}

	const getPositionGer = () => {
		if (language === 'de') {
			return positions[0]
		} else {
			if (language === 'fr') {
				return positions[2]
			} else {
				return positions[1]
			}
		}
	}

	const getPositionFr = () => {
		if (language === 'fr') {
			return positions[0]
		} else {
			return positions[2]
		}
	}

	return (
		<Float floatIntensity={0.3}>
			<Text
				textAlign="left"
				fontSize={0.06}
				color={fontColor}
				font={mdiFontUrl}
				position={[-0.17, 0.1, 0.01]}
			>
				󰗊
			</Text>
			{open || language === 'en' ? (
				<Text
					textAlign="left"
					fontSize={0.05}
					color={fontColor}
					font={fontTextURL}
					position={getPositionEng()}
					onPointerEnter={() => handlePointerOver(false)}
					onPointerLeave={handlePointerOut}
					onClick={() => handleSelect('en')}
				>
					en
				</Text>
			) : null}
			{open || language === 'de' ? (
				<Text
					fontSize={0.05}
					color={fontColor}
					font={fontTextURL}
					position={getPositionGer()}
					onPointerEnter={() => handlePointerOver(false)}
					onPointerLeave={handlePointerOut}
					onClick={() => handleSelect('de')}
				>
					de
				</Text>
			) : null}
			{open || language === 'fr' ? (
				<Text
					textAlign="left"
					fontSize={0.05}
					color={fontColor}
					font={fontTextURL}
					position={getPositionFr()}
					onPointerEnter={() => handlePointerOver(false)}
					onPointerLeave={handlePointerOut}
					onClick={() => handleSelect('fr')}
				>
					fr
				</Text>
			) : null}

			<Text
				fontSize={0.05}
				color={fontColor}
				font={mdiFontUrl}
				position={[-0.04, 0.093, 0.01]}
				onPointerEnter={() => handlePointerOver(true)}
				onPointerLeave={handlePointerOut}
				onClick={handleOpen}
			>
				󰄼
			</Text>
			<Cylinder
				ref={cylinderRef}
				position={[-0.1, 0.1, 0]}
				rotation={[Math.PI / 2, 0, Math.PI / 2]}
				scale={[0.02, 0.07, 0.07]}
				args={[0.5, 0.5, 3]}
			>
				<meshMatcapMaterial color="white" matcap={matcap} />
			</Cylinder>
		</Float>
	)
}
