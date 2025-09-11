# Métodos de Generación de Lecturas Diarias

Este documento explica las diferentes alternativas para generar lecturas diarias automáticamente.

## 🚀 Métodos Disponibles

### 1. API Route de Next.js (Recomendado)
**Archivo:** `app/api/generate-reading/route.ts`
**Comando:** `npm run generate:daily`

**Características:**
- ✅ Usa OpenAI como primaria
- ✅ Fallback automático a DeepSeek si OpenAI falla
- ✅ Ejecuta desde tu aplicación Next.js
- ✅ Fácil de programar con cron jobs

**Configuración necesaria:**
```env
OPENAI_API_KEY=tu_clave_openai
DEEPSEEK_API_KEY=tu_clave_deepseek
CRON_SECRET=tu_secreto_opcional
```

### 2. Script con DeepSeek Chat
**Archivo:** `scripts/generate-with-deepseek-chat.js`
**Comando:** `npm run generate:deepseek`

**Características:**
- ✅ Usa contenido predefinido (simula chat de DeepSeek)
- ✅ No requiere API keys externas
- ✅ Funciona offline
- ✅ Ideal para pruebas y desarrollo

**Uso:**
```bash
npm run generate:deepseek
```

### 3. Script SQL de Supabase
**Archivo:** `scripts/supabase-generate-reading.sql`
**Comando:** `npm run generate:supabase` (solo muestra instrucciones)

**Características:**
- ✅ Se ejecuta directamente en Supabase
- ✅ No requiere servidor externo
- ✅ Temas variados automáticos
- ✅ Funciones SQL reutilizables

**Cómo usar:**
1. Ve al SQL Editor de Supabase
2. Copia y pega el contenido de `scripts/supabase-generate-reading.sql`
3. Ejecuta: `SELECT run_daily_generation();`

### 4. Edge Function de Supabase
**Archivo:** `supabase/functions/generate-daily-reading/index.ts`

**Características:**
- ✅ Se ejecuta en la infraestructura de Supabase
- ✅ Temas variados automáticos
- ✅ Programable con cron jobs
- ✅ No requiere servidor propio

**Cómo usar:**
1. Despliega la función en Supabase
2. Configura un cron job para llamarla diariamente
3. O llama manualmente: `POST /functions/v1/generate-daily-reading`

## 📋 Comparación de Métodos

| Método | Complejidad | Costo | Flexibilidad | Automatización |
|--------|-------------|-------|--------------|----------------|
| API Route | Media | Medio | Alta | Fácil |
| DeepSeek Script | Baja | Bajo | Media | Fácil |
| SQL Script | Baja | Bajo | Media | Media |
| Edge Function | Alta | Bajo | Alta | Fácil |

## 🔧 Configuración de Cron Jobs

### Para API Route (Recomendado)
```bash
# Ejecutar diariamente a las 6:00 AM
0 6 * * * curl -X POST http://localhost:3000/api/generate-reading -H "Authorization: Bearer tu_cron_secret"
```

### Para Edge Function
```bash
# Ejecutar diariamente a las 6:00 AM
0 6 * * * curl -X POST https://tu-proyecto.supabase.co/functions/v1/generate-daily-reading -H "Authorization: Bearer tu_supabase_anon_key"
```

## 🎯 Temas Disponibles

Los métodos que usan temas variados incluyen:
- **Amistad:** Historias sobre hacer amigos y mantener relaciones
- **Naturaleza:** Aventuras en el mundo natural y cuidado del medio ambiente
- **Valores:** Lecciones sobre honestidad, bondad y responsabilidad
- **Aventura:** Exploraciones y descubrimientos emocionantes
- **Familia:** Relaciones familiares y tradiciones

## 🚨 Solución de Problemas

### Error: "Falta OPENAI_API_KEY"
- Configura la variable en `.env.local`
- O usa el script de DeepSeek como alternativa

### Error: "Ya existe una lectura para hoy"
- Es normal, significa que ya se generó la lectura del día
- Para forzar nueva generación, elimina la lectura existente

### Error: "Insufficient Balance" (DeepSeek)
- Agrega saldo a tu cuenta de DeepSeek
- O usa el script SQL como alternativa

### Error: "ECONNREFUSED"
- Asegúrate de que el servidor Next.js esté ejecutándose
- Ejecuta `npm run dev` antes de usar la API route

## 📝 Recomendaciones

1. **Para producción:** Usa la API Route con fallback a DeepSeek
2. **Para desarrollo:** Usa el script de DeepSeek Chat
3. **Para máxima simplicidad:** Usa el script SQL de Supabase
4. **Para escalabilidad:** Usa Edge Functions de Supabase

## 🔄 Flujo de Trabajo Recomendado

1. **Desarrollo:** Prueba con `npm run generate:deepseek`
2. **Testing:** Usa `npm run generate:test` con la API route
3. **Producción:** Configura cron job para `npm run generate:daily`
4. **Backup:** Mantén el script SQL como respaldo
