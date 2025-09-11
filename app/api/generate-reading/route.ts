import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface GeneratedReading {
	title: string
	content: string
	questions: Array<{
		question_text: string
		options: Array<{
			text: string
			is_correct: boolean
		}>
	}>
}

function buildPrompt(): string {
	return `Eres un experto contenido educativo infantil. busca o genera UNA sola lectura ORIGINAL en español, apta para niños de 6 a 8 años, con un lenguaje simple, frases cortas y un mensaje positivo.

Requisitos:
- 300 a 500 palabras
- Tema cotidiano o de fantasía suave; variedad a lo largo del tiempo
- Tono amable, claro y motivador
- Evitar violencia, miedo intenso o vocabulario complejo
- Incluir una moraleja implícita

Además, crea exactamente 5 preguntas de comprensión lectora.
Cada pregunta debe incluir 4 opciones (una correcta y tres incorrectas plausibles, todas cortas).

Devuelve EXCLUSIVAMENTE JSON con esta forma:
{
  "title": "...",
  "content": "...", // párrafos separados por \n\n
  "questions": [
    {
      "question_text": "...",
      "options": [
        { "text": "...", "is_correct": true },
        { "text": "...", "is_correct": false },
        { "text": "...", "is_correct": false },
        { "text": "...", "is_correct": false }
      ]
    },
    { ... },
    { ... }
  ]
}`
}

async function generateWithOpenAI(): Promise<GeneratedReading> {
	const apiKey = process.env.OPENAI_API_KEY
	if (!apiKey) {
		throw new Error('Falta OPENAI_API_KEY en variables de entorno')
	}

	const body = {
		model: 'gpt-4o-mini',
		messages: [
			{ role: 'system', content: 'Eres un asistente que devuelve estrictamente JSON válido.' },
			{ role: 'user', content: buildPrompt() }
		],
		temperature: 0.8,
	}

	const resp = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		},
		body: JSON.stringify(body)
	})

	if (!resp.ok) {
		const text = await resp.text()
		throw new Error(`OpenAI error ${resp.status}: ${text}`)
	}

	const data = await resp.json()
	const content = data.choices?.[0]?.message?.content
	if (!content) {
		throw new Error('Respuesta de OpenAI sin contenido')
	}

	let parsed: GeneratedReading
	try {
		parsed = JSON.parse(content)
	} catch (e) {
		// Intento de limpiar posibles envolturas de código
		const cleaned = String(content).replace(/^```json\n?|```$/g, '').trim()
		parsed = JSON.parse(cleaned)
	}
	// Validaciones mínimas
	if (!parsed.title || !parsed.content || !Array.isArray(parsed.questions) || parsed.questions.length !== 3) {
		throw new Error('JSON inválido o incompleto devuelto por OpenAI')
	}
	for (const q of parsed.questions) {
		if (!q.question_text || !Array.isArray(q.options) || q.options.length !== 4) {
			throw new Error('Pregunta inválida en JSON de OpenAI')
		}
		const correctCount = q.options.filter(o => o.is_correct === true).length
		if (correctCount !== 1) throw new Error('Cada pregunta debe tener exactamente 1 opción correcta')
	}
	return parsed
}

async function generateWithDeepseek(): Promise<GeneratedReading> {
	const apiKey = process.env.DEEPSEEK_API_KEY
	if (!apiKey) {
		throw new Error('Falta DEEPSEEK_API_KEY en variables de entorno')
	}

	const body = {
		model: 'deepseek-chat',
		messages: [
			{ role: 'system', content: 'Eres un asistente que devuelve estrictamente JSON válido.' },
			{ role: 'user', content: buildPrompt() }
		],
		temperature: 0.8
	}

	const resp = await fetch('https://api.deepseek.com/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		},
		body: JSON.stringify(body)
	})

	if (!resp.ok) {
		const text = await resp.text()
		throw new Error(`Deepseek error ${resp.status}: ${text}`)
	}

	const data = await resp.json()
	const content = data.choices?.[0]?.message?.content
	if (!content) throw new Error('Respuesta de Deepseek sin contenido')

	let parsed: GeneratedReading
	try {
		parsed = JSON.parse(content)
	} catch (e) {
		const cleaned = String(content).replace(/^```json\n?|```$/g, '').trim()
		parsed = JSON.parse(cleaned)
	}

	if (!parsed.title || !parsed.content || !Array.isArray(parsed.questions) || parsed.questions.length !== 3) {
		throw new Error('JSON inválido o incompleto devuelto por Deepseek')
	}
	for (const q of parsed.questions) {
		if (!q.question_text || !Array.isArray(q.options) || q.options.length !== 4) {
			throw new Error('Pregunta inválida en JSON de Deepseek')
		}
		const correctCount = q.options.filter(o => o.is_correct === true).length
		if (correctCount !== 1) throw new Error('Cada pregunta debe tener exactamente 1 opción correcta')
	}

	return parsed
}

export async function POST(req: Request) {
	try {
		// Seguridad opcional con token
		const cronSecret = process.env.CRON_SECRET
		if (cronSecret) {
			const header = req.headers.get('x-cron-secret')
			if (header !== cronSecret) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
			}
		}

		// Evitar duplicados el mismo día
		const today = new Date()
		const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
		const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()
		const { data: existing } = await supabase
			.from('readings')
			.select('id')
			.gte('created_at', start)
			.lt('created_at', end)
			.limit(1)
		if (existing && existing.length > 0) {
			return NextResponse.json({ ok: true, skipped: true, reason: 'already_created_today' })
		}

		// Generar con OpenAI; si falla, intentar con Deepseek
		let generated: GeneratedReading
		try {
			generated = await generateWithOpenAI()
		} catch (err: any) {
			console.warn('OpenAI falló, intentando con Deepseek:', err?.message || err)
			generated = await generateWithDeepseek()
		}

		// Insertar lectura
		const { data: reading, error: readingError } = await supabase
			.from('readings')
			.insert({ title: generated.title, content: generated.content })
			.select()
			.single()
		if (readingError) throw readingError

		let questionsCount = 0
		let optionsCount = 0

		for (const q of generated.questions) {
			const { data: question, error: qErr } = await supabase
				.from('questions')
				.insert({ reading_id: reading.id, question_text: q.question_text })
				.select()
				.single()
			if (qErr) throw qErr
			questionsCount++

			for (const opt of q.options) {
				const { error: oErr } = await supabase
					.from('question_options')
					.insert({ question_id: question.id, option_text: opt.text, is_correct: !!opt.is_correct })
				if (oErr) throw oErr
				optionsCount++
			}
		}

		return NextResponse.json({ ok: true, readingId: reading.id, questionsCount, optionsCount })
	} catch (error: any) {
		console.error('API generate-reading error:', error)
		return NextResponse.json({ ok: false, error: error?.message ?? 'unknown_error' }, { status: 500 })
	}
}


