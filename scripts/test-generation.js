// Cargar variables de entorno desde .env.local
try {
	require('dotenv').config({ path: '.env.local' })
} catch (_) {}
// Cargar variables de entorno desde .env.local
try {
	require('dotenv').config({ path: '.env.local' })
} catch (_) {}
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

async function testGeneration() {
	console.log('🧪 Probando generación (API)...')
	const url = process.env.GENERATE_API_URL || 'http://localhost:3000/api/generate-reading'
	const headers = { 'Content-Type': 'application/json' }
	if (process.env.CRON_SECRET) headers['x-cron-secret'] = process.env.CRON_SECRET
	
	try {
		const resp = await fetch(url, { method: 'POST', headers })
		const json = await resp.json()
		if (!resp.ok || !json.ok) {
			console.error('❌ Error API:', json)
			process.exit(1)
		}
		console.log('✅ ¡Prueba exitosa!')
		console.log(`📚 Lectura creada con ID: ${json.readingId}`)
		console.log(`❓ Preguntas: ${json.questionsCount}`)
		console.log(`🔘 Opciones: ${json.optionsCount}`)
	} catch (error) {
		console.error('💥 Error en la prueba:', error)
	}
}

testGeneration()
