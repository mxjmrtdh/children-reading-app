// Cargar variables de entorno desde .env.local
try {
	require('dotenv').config({ path: '.env.local' })
} catch (_) {}
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

async function main() {
	console.log('🚀 Iniciando generador de lectura diaria (API)...')
	console.log('📅 Fecha:', new Date().toLocaleDateString('es-ES'))
	
	try {
		const url = process.env.GENERATE_API_URL || 'http://localhost:3000/api/generate-reading'
		const headers = { 'Content-Type': 'application/json' }
		if (process.env.CRON_SECRET) headers['x-cron-secret'] = process.env.CRON_SECRET
		
		const resp = await fetch(url, { method: 'POST', headers })
		const json = await resp.json()
		if (!resp.ok || !json.ok) {
			console.error('❌ Error API:', json)
			process.exit(1)
		}
		
		console.log('✅ ¡Lectura diaria generada vía API!')
		console.log(`📚 ID de lectura: ${json.readingId}`)
		console.log(`❓ Preguntas creadas: ${json.questionsCount}`)
		console.log(`🔘 Opciones creadas: ${json.optionsCount}`)
	} catch (error) {
		console.error('💥 Error fatal:', error)
		process.exit(1)
	}
}

// Ejecutar si es llamado directamente
if (require.main === module) {
	main()
}

module.exports = { main }
