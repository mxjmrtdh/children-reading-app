import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug: verificar que las variables se cargan correctamente
console.log('🔍 Debug - Variables de entorno:')
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Cargada' : '❌ No encontrada')
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Cargada' : '❌ No encontrada')

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Reading {
	id: number
	title: string
	content: string
	created_at: string
	updated_at: string
}

export interface Question {
	id: number
	reading_id: number
	question_text: string
	correct_answer: string
	created_at: string
	updated_at: string
}
