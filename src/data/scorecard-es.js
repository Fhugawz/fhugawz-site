export const scorecardEs = {
	meta: {
		title: 'Diagnóstico de Identidad Artística y Preparación de Lanzamiento',
		description: 'Un diagnóstico gratuito para artistas independientes sobre identidad, dirección sonora, universo visual, preparación de lanzamiento y sistema de contenido.',
	},
	intro: {
		kicker: 'DIAGNÓSTICO GRATUITO PARA ARTISTAS',
		title: '¿Qué tan preparado está tu universo artístico para el próximo lanzamiento?',
		body: 'Evalúa cinco áreas de tu proyecto en 5–8 minutos. Recibirás una puntuación, tus áreas más fuertes y débiles, y tres próximos pasos prácticos.',
		privacy: 'Este prototipo funciona completamente en tu navegador. No recopila tu correo ni guarda tus respuestas.',
		start: 'COMENZAR DIAGNÓSTICO',
	},
	ui: {
		question: 'Pregunta', of: 'de', previous: 'ANTERIOR', next: 'SIGUIENTE', results: 'VER RESULTADOS',
		answerRequired: 'Selecciona una respuesta antes de continuar.', restart: 'REINICIAR DIAGNÓSTICO',
		totalScore: 'PUNTUACIÓN TOTAL', strongest: 'Área más fuerte', weakest: 'Área prioritaria',
		categoryScores: 'Puntuación por área', nextSteps: 'Tus próximos tres pasos', recommendation: 'Dirección recomendada',
	},
	scale: [
		{ value: 0, label: 'No iniciado', detail: 'Esto todavía no existe.' },
		{ value: 1, label: 'Idea inicial', detail: 'Existe una idea vaga o aislada.' },
		{ value: 2, label: 'Parcialmente definido', detail: 'Hay avances, pero faltan claridad o consistencia.' },
		{ value: 3, label: 'Mayormente claro', detail: 'Funciona, aunque todavía necesita ajustes.' },
		{ value: 4, label: 'Completamente definido', detail: 'Está claro, documentado y aplicado con consistencia.' },
	],
	categories: {
		artistIdentity: {
			name: 'Identidad artística',
			description: 'Claridad sobre quién es el artista y qué representa el proyecto.',
			questions: [
				'Puedo explicar en una frase clara quién soy como artista y qué hace distinto mi proyecto.',
				'Tengo definidos los temas, emociones o conflictos que aparecen de forma recurrente en mi obra.',
				'Sé qué tipo de experiencia quiero que una persona sienta al descubrir mi proyecto.',
				'Mis decisiones creativas parten de una identidad propia y no únicamente de imitar referencias.',
			],
		},
		sonicDirection: {
			name: 'Dirección sonora',
			description: 'Definición y coherencia del lenguaje musical.',
			questions: [
				'Puedo describir mi dirección sonora sin depender solamente de nombres de otros artistas.',
				'Tengo una paleta reconocible de géneros, texturas, instrumentos, producción o atmósferas.',
				'Mis canciones o demos recientes parecen pertenecer al mismo universo, incluso cuando varían.',
				'Sé qué elementos musicales deben permanecer constantes y cuáles pueden cambiar entre lanzamientos.',
			],
		},
		visualNarrative: {
			name: 'Universo visual y narrativo',
			description: 'Conexión entre imagen, historia, símbolos y emoción.',
			questions: [
				'Tengo una dirección visual definida para color, tipografía, imagen, textura y composición.',
				'Mis portadas, perfiles, imágenes y materiales visuales comunican una sensación coherente.',
				'Existen símbolos, historias, personajes, lugares o conceptos que amplían el significado de mi música.',
				'Puedo traducir el mundo emocional de una canción a decisiones visuales y narrativas concretas.',
			],
		},
		releasePreparation: {
			name: 'Preparación de lanzamiento',
			description: 'Estado concreto del próximo lanzamiento.',
			questions: [
				'Tengo definido cuál será mi próximo lanzamiento y qué función cumple dentro de mi proyecto.',
				'La canción, el arte, los créditos, la metadata y los archivos necesarios tienen un estado claro.',
				'Tengo una fecha o ventana realista y un calendario de acciones previo y posterior al lanzamiento.',
				'Sé qué debe ocurrir antes de publicar y qué indicadores observaré después.',
			],
		},
		audienceContent: {
			name: 'Audiencia y sistema de contenido',
			description: 'Capacidad de comunicar, publicar y sostener atención.',
			questions: [
				'Sé con qué tipo de persona quiero conectar y por qué mi proyecto podría importarle.',
				'Tengo temas o pilares de contenido relacionados con mi identidad y no solo publicaciones promocionales.',
				'Puedo transformar una canción, concepto o proceso en varias piezas de contenido útiles.',
				'Tengo un sistema sostenible para crear, revisar, publicar y medir contenido sin depender de inspiración diaria.',
			],
		},
	},
	results: {
		fragmented: { title: 'Fundamento fragmentado', diagnosis: 'Existen ideas y materiales, pero todavía no forman una identidad ni un sistema de lanzamiento utilizables.', priority: 'Define fundamento, intención y dirección antes de aumentar producción o promoción.' },
		emerging: { title: 'Dirección emergente', diagnosis: 'Tu identidad empieza a tomar forma, pero varias decisiones siguen dispersas o dependen demasiado de referencias externas.', priority: 'Documenta la dirección y conecta sonido, imagen, narrativa y lanzamiento.' },
		disconnected: { title: 'Definido pero desconectado', diagnosis: 'La mayoría de los componentes existen, aunque todavía no funcionan como un sistema consistente y repetible.', priority: 'Cierra las brechas entre áreas y convierte decisiones creativas en procesos.' },
		ready: { title: 'Sistema listo para lanzamiento', diagnosis: 'Existe una dirección sólida y coherente, suficientemente preparada para sostener un lanzamiento intencional.', priority: 'Ejecuta, mide y mejora sin perder coherencia.' },
	},
	actions: {
		artistIdentity: ['Escribe una definición del artista en una sola frase.', 'Enumera tres temas o conflictos emocionales recurrentes.', 'Define qué debe sentir una persona al descubrir el proyecto.'],
		sonicDirection: ['Describe tu sonido sin mencionar nombres de artistas.', 'Crea una paleta sonora breve de elementos recurrentes.', 'Define qué debe mantenerse constante entre lanzamientos.'],
		visualNarrative: ['Define un sistema visual compacto.', 'Elige símbolos o elementos narrativos recurrentes.', 'Traduce una canción a una página de dirección visual.'],
		releasePreparation: ['Define la función del próximo lanzamiento.', 'Crea una lista de estado para cada activo necesario.', 'Construye un calendario realista antes y después del lanzamiento.'],
		audienceContent: ['Describe a la persona con la que quieres conectar.', 'Define tres pilares de contenido vinculados a tu identidad.', 'Convierte una idea de lanzamiento en cinco piezas de contenido.'],
	},
	recommendations: {
		artistIdentity: 'Comienza con un ejercicio de fundamento de identidad o una sesión de dirección de Artist World Building.',
		sonicDirection: 'Construye un mapa de identidad sonora antes de añadir más decisiones de producción.',
		visualNarrative: 'Crea un canvas de world building y un sistema compacto de dirección visual.',
		releasePreparation: 'Utiliza una lista de lanzamiento y convierte el proyecto en un sistema repetible.',
		audienceContent: 'Construye pilares de contenido y un flujo sostenible alrededor de cada lanzamiento.',
	},
};
