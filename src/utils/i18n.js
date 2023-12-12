import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		debug: true,
		fallbackLng: 'en',
		resources: {
			en: {
				translation: {
					description: {
						part1: 'A game by',
						part2:
							'Hi, I made this simple 3d platformer game with three.js and react. This is my first game ever and first real three.js project, so it is not perfect, but I hope you enjoy it. The controls are Quake-style and first person. You can read more about the controls in the next section. At the end of the page the game starts. Have Fun!',
					},
					controls: {
						part1: 'Controls',
						part2: 'forward',
						part3: 'left',
						part4: 'backward',
						part5: 'right',
						part6: 'jump',
						part7: 'You can use the mouse to look around',
						part8: 'left click to look around',
					},
					instructions: {
						part1: 'Goal',
						part2:
							'Simply jump onto the next red platform you see. You will find it if you look around.',
						part3: 'Press Button To Start',
					},
					misc: {
						part1: 'computer mouse by kubassa',
						part2: 'button-electronic-constructor by Kroko.blend',
						part3: 'viewsonic 15 1546 CRT monitor by Moomo0802',
						part4: 'keyboard TX-130 by Shelest',
						part5: 'Debug Mode',
					},
				},
			},
			de: {
				translation: {
					description: {
						part1: 'Ein Spiel von',
						part2:
							'Hallo, ich habe dieses einfache 3D-Plattformspiel mit three.js und react erstellt. Dies ist mein erstes Spiel und mein erstes echtes three.js-Projekt, daher ist es nicht perfekt, aber ich hoffe, es gefällt dir. Die Steuerung ist im Stil von Quake und First Person. du mehr über die Steuerung im nächsten Abschnitt lesen. Am Ende der Seite beginnt das Spiel. Viel Spaß!',
					},
					controls: {
						part1: 'Steuerung',
						part2: 'vorwärts',
						part3: 'links',
						part4: 'rückwärts',
						part5: 'rechts',
						part6: 'springen',
						part7: 'Benutze die Maus, um dich umzusehen',
						part8: 'Linksklick zum Umsehen',
					},
					instructions: {
						part1: 'Ziel',
						part2:
							'Springe einfach auf die nächste rote Plattform, die du siehst. Du wirst sie finden, wenn du dich umschaust.',
						part3: 'Drücke Knopf, um zu starten',
					},
					misc: {
						part1: 'computer mouse von kubassa',
						part2: 'button-electronic-constructor von Kroko.blend',
						part3: 'viewsonic 15 1546 CRT monitor von Moomo0802',
						part4: 'keyboard TX-130 von Shelest',
						part5: 'Debug Modus',
					},
				},
			},
			fr: {
				translation: {
					description: {
						part1: 'Un jeu par',
						part2:
							"Salut, j'ai fait ce simple jeu de plateforme 3D avec three.js et react. C'est mon premier jeu et mon premier vrai projet three.js, donc ce n'est pas parfait, mais j'espère que vous l'apprécierez. Les contrôles sont de style Quake et à la première personne. tu peux en savoir plus sur les contrôles dans la section suivante. À la fin de la page, le jeu commence. Amusez-vous bien!",
					},
					controls: {
						part1: 'Contrôles',
						part2: 'en avant',
						part3: 'à gauche',
						part4: 'en arrière',
						part5: 'à droite',
						part6: 'sauter',
						part7:
							'Vous pouvez utiliser la souris pour regarder autour de vous',
						part8: 'clic gauche pour regarder autour de vous',
					},
					instructions: {
						part1: 'But',
						part2:
							'Sautez simplement sur la prochaine plateforme rouge que vous voyez. Vous le trouverez si vous regardez autour de vous.',
						part3: 'Appuyez bouton pour démarrer',
					},
					misc: {
						part1: 'computer mouse par kubassa',
						part2: 'button-electronic-constructor par Kroko.blend',
						part3: 'viewsonic 15 1546 CRT monitor par Moomo0802',
						part4: 'keyboard TX-130 par Shelest',
						part5: 'Mode de débogage',
					},
				},
			},
		},
	})

export default i18n
