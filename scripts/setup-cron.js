const { exec } = require('child_process')
const path = require('path')

/**
 * Script para configurar la generación automática diaria de lecturas
 * Este script puede ser ejecutado en un servidor o servicio de cron
 */

console.log('⏰ Configurando generación automática de lecturas diarias...')

// Ruta absoluta al script de generación
const scriptPath = path.join(__dirname, 'generate-daily-reading.js')
const projectPath = path.join(__dirname, '..')

console.log('📁 Ruta del proyecto:', projectPath)
console.log('📄 Script de generación:', scriptPath)

// Comando para ejecutar la generación diaria
const command = `cd "${projectPath}" && node "${scriptPath}"`

console.log('\n🔧 Comandos para configurar cron:')
console.log('=' * 50)

// Para Linux/Mac (cron)
console.log('\n🐧 Para Linux/Mac (cron):')
console.log('1. Abrir crontab: crontab -e')
console.log('2. Agregar esta línea para ejecutar todos los días a las 6:00 AM:')
console.log(`   0 6 * * * cd "${projectPath}" && node "${scriptPath}"`)

// Para Windows (Task Scheduler)
console.log('\n🪟 Para Windows (Task Scheduler):')
console.log('1. Abrir "Programador de tareas"')
console.log('2. Crear tarea básica')
console.log('3. Configurar para ejecutar diariamente a las 6:00 AM')
console.log(`4. Acción: Iniciar programa`)
console.log(`   Programa: node`)
console.log(`   Argumentos: "${scriptPath}"`)
console.log(`   Directorio de inicio: "${projectPath}"`)

// Para servicios en la nube
console.log('\n☁️  Para servicios en la nube:')
console.log('• Vercel Cron Jobs: https://vercel.com/docs/cron-jobs')
console.log('• GitHub Actions: Crear workflow con schedule')
console.log('• Heroku Scheduler: Add-on para tareas programadas')
console.log('• AWS Lambda + EventBridge: Para ejecución serverless')

console.log('\n📋 Comando manual para probar:')
console.log(`npm run generate:daily`)

console.log('\n✅ Configuración completada!')
console.log('💡 Recuerda que el script verificará si ya existe una lectura para el día actual.')

