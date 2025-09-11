import { supabase, type Reading, type Question } from './supabase'

export interface QuestionOption {
	id: number
	question_id: number
	option_text: string
	is_correct: boolean
}

export interface QuestionWithOptions extends Question {
	options: QuestionOption[]
}

export interface ReadingWithQuestions extends Reading {
	questions: QuestionWithOptions[]
}

export async function getReadingsOrderedByUpdatedAt(): Promise<ReadingWithQuestions[]> {
	try {
		// Obtener lecturas ordenadas por updated_at (más recientes primero)
		const { data: readings, error: readingsError } = await supabase
			.from('readings')
			.select('*')
			.order('updated_at', { ascending: false })

		if (readingsError) {
			console.error('Error fetching readings:', readingsError)
			return []
		}

		if (!readings || readings.length === 0) {
			return []
		}

		// Obtener preguntas para cada lectura
		const readingsWithQuestions: ReadingWithQuestions[] = []

		for (const reading of readings) {
			const { data: questions, error: questionsError } = await supabase
				.from('questions')
				.select('*')
				.eq('reading_id', reading.id)
				.order('created_at', { ascending: true })

			if (questionsError) {
				console.error(`Error fetching questions for reading ${reading.id}:`, questionsError)
			}

			readingsWithQuestions.push({
				...reading,
				questions: questions || []
			})
		}

		return readingsWithQuestions
	} catch (error) {
		console.error('Error in getReadingsOrderedByUpdatedAt:', error)
		return []
	}
}

export async function getLatestReading(): Promise<ReadingWithQuestions | null> {
	try {
		const readings = await getReadingsOrderedByUpdatedAt()
		return readings.length > 0 ? readings[0] : null
	} catch (error) {
		console.error('Error in getLatestReading:', error)
		return null
	}
}

export async function getDailyReading(): Promise<ReadingWithQuestions | null> {
	try {
		const today = new Date()
		const todayString = today.toISOString().split('T')[0] // YYYY-MM-DD
		
		// Obtener todas las lecturas ordenadas por fecha de creación
		const { data: readings, error: readingsError } = await supabase
			.from('readings')
			.select('*')
			.order('created_at', { ascending: true })

		if (readingsError) {
			console.error('Error fetching readings:', readingsError)
			return null
		}

		if (!readings || readings.length === 0) {
			return null
		}

		// Calcular qué lectura corresponde al día actual
		// Usar el día del año para seleccionar la lectura
		const startOfYear = new Date(today.getFullYear(), 0, 1)
		const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
		const readingIndex = dayOfYear % readings.length
		const selectedReading = readings[readingIndex]

		// Obtener preguntas para la lectura seleccionada con sus opciones
		const { data: questions, error: questionsError } = await supabase
			.from('questions')
			.select(`
				*,
				question_options (*)
			`)
			.eq('reading_id', selectedReading.id)
			.order('created_at', { ascending: true })

		if (questionsError) {
			console.error(`Error fetching questions for reading ${selectedReading.id}:`, questionsError)
		}

		// Procesar las preguntas para incluir las opciones
		const processedQuestions: QuestionWithOptions[] = (questions || []).map(q => {
			const options = (q as any).question_options || []
			return {
				...q,
				// Derivar correct_answer si no existe
				correct_answer: q.correct_answer || options.find((o: any) => o.is_correct)?.option_text || '',
				options
			}
		})

		return {
			...selectedReading,
			questions: processedQuestions
		}
	} catch (error) {
		console.error('Error in getDailyReading:', error)
		return null
	}
}

export async function saveUserProgress(
	userId: number,
	readingId: number,
	questionId: number,
	isCorrect: boolean
): Promise<boolean> {
	try {
		const { error } = await supabase
			.from('progress')
			.insert({
				user_id: userId,
				reading_id: readingId,
				question_id: questionId,
				is_correct: isCorrect
			})

		if (error) {
			console.error('Error saving progress:', error)
			return false
		}

		return true
	} catch (error) {
		console.error('Error in saveUserProgress:', error)
		return false
	}
}
