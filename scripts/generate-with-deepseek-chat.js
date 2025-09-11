const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.error('❌ Faltan variables de entorno de Supabase');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para generar contenido usando DeepSeek Chat
async function generateWithDeepSeekChat() {
	const prompt = `Genera una lectura educativa para niños de 6-8 años con las siguientes especificaciones:

TÍTULO: Un título atractivo y corto
LECTURA: Una historia de 300-500 palabras que sea:
- Apropiada para niños de 6-8 años
- Con un tema educativo (amistad, naturaleza, valores, etc.)
- Con un mensaje positivo
- Fácil de entender

PREGUNTAS: 5 preguntas de comprensión lectora con 4 opciones cada una (A, B, C, D), donde solo una sea correcta.

Formato de respuesta JSON:
{
  "title": "Título de la lectura",
  "content": "Contenido de la lectura...",
  "questions": [
    {
      "question_text": "¿Cuál es el tema principal?",
      "options": [
        {"text": "Opción A", "is_correct": false},
        {"text": "Opción B", "is_correct": true},
        {"text": "Opción C", "is_correct": false},
        {"text": "Opción D", "is_correct": false}
      ]
    }
  ]
}`;

	try {
		// Simulamos la respuesta del chat (en la práctica usarías la API de DeepSeek)
		// Por ahora generamos contenido local para demostrar la estructura
		const generatedContent = {
			title: "El Conejito Valiente",
			content: `Había una vez un pequeño conejito llamado Pelusín que vivía en un bosque mágico. Pelusín era muy tímido y siempre se escondía cuando veía a otros animales.

Un día, mientras caminaba por el bosque, escuchó unos llantos que venían de un árbol cercano. Al acercarse, vio a un pajarito bebé que se había caído de su nido y no podía volver.

Pelusín sintió mucha pena por el pajarito. Aunque tenía miedo, sabía que tenía que ayudarlo. Con mucho cuidado, trepó por el árbol usando sus patitas y sus dientes para agarrarse.

Era difícil subir, pero Pelusín no se rindió. Cuando llegó hasta el pajarito, lo tomó suavemente con sus patitas y lo bajó hasta el suelo. Luego, lo ayudó a encontrar a su mamá pájaro.

La mamá pájaro estaba muy agradecida y le dio a Pelusín un abrazo con sus alas. Desde ese día, Pelusín se sintió más valiente y todos los animales del bosque lo admiraban por su bondad.

Pelusín aprendió que ser valiente no significa no tener miedo, sino hacer lo correcto aunque tengamos miedo.`,
			questions: [
				{
					question_text: "¿Cómo se llamaba el conejito de la historia?",
					options: [
						{ text: "Pelusín", is_correct: true },
						{ text: "Peludito", is_correct: false },
						{ text: "Pelusón", is_correct: false },
						{ text: "Pelusito", is_correct: false }
					]
				},
				{
					question_text: "¿Qué encontró Pelusín en el bosque?",
					options: [
						{ text: "Una flor bonita", is_correct: false },
						{ text: "Un pajarito bebé caído", is_correct: true },
						{ text: "Una zanahoria", is_correct: false },
						{ text: "Un amigo conejo", is_correct: false }
					]
				},
				{
					question_text: "¿Cómo ayudó Pelusín al pajarito?",
					options: [
						{ text: "Lo llevó volando", is_correct: false },
						{ text: "Lo trepó de vuelta al nido", is_correct: false },
						{ text: "Lo bajó del árbol con cuidado", is_correct: true },
						{ text: "Le dio de comer", is_correct: false }
					]
				},
				{
					question_text: "¿Qué aprendió Pelusín al final?",
					options: [
						{ text: "Que no debe tener miedo nunca", is_correct: false },
						{ text: "Que ser valiente es hacer lo correcto aunque tengamos miedo", is_correct: true },
						{ text: "Que los pájaros son peligrosos", is_correct: false },
						{ text: "Que no debe ayudar a otros", is_correct: false }
					]
				},
				{
					question_text: "¿Cómo se sintió Pelusín después de ayudar?",
					options: [
						{ text: "Más tímido que antes", is_correct: false },
						{ text: "Más valiente y admirado", is_correct: true },
						{ text: "Triste y arrepentido", is_correct: false },
						{ text: "Enojado con todos", is_correct: false }
					]
				}
			]
		};

		return generatedContent;
	} catch (error) {
		console.error('❌ Error generando con DeepSeek Chat:', error);
		throw error;
	}
}

// Función para insertar en Supabase
async function insertReadingToSupabase(readingData) {
	try {
		// Verificar si ya existe una lectura para hoy
		const today = new Date().toISOString().split('T')[0];
		const { data: existingReading } = await supabase
			.from('readings')
			.select('id')
			.eq('created_at', today)
			.single();

		if (existingReading) {
			console.log('⚠️ Ya existe una lectura para hoy');
			return { success: false, message: 'Ya existe una lectura para hoy' };
		}

		// Insertar la lectura
		const { data: reading, error: readingError } = await supabase
			.from('readings')
			.insert({
				title: readingData.title,
				content: readingData.content
			})
			.select()
			.single();

		if (readingError) {
			throw new Error(`Error insertando lectura: ${readingError.message}`);
		}

		console.log('✅ Lectura insertada:', reading.id);

		// Insertar preguntas y opciones
		for (const questionData of readingData.questions) {
			const { data: question, error: questionError } = await supabase
				.from('questions')
				.insert({
					reading_id: reading.id,
					question_text: questionData.question_text
				})
				.select()
				.single();

			if (questionError) {
				throw new Error(`Error insertando pregunta: ${questionError.message}`);
			}

			// Insertar opciones
			for (const option of questionData.options) {
				const { error: optionError } = await supabase
					.from('question_options')
					.insert({
						question_id: question.id,
						option_text: option.text,
						is_correct: option.is_correct
					});

				if (optionError) {
					throw new Error(`Error insertando opción: ${optionError.message}`);
				}
			}

			console.log('✅ Pregunta insertada:', question.id);
		}

		return { success: true, readingId: reading.id };
	} catch (error) {
		console.error('❌ Error insertando en Supabase:', error);
		throw error;
	}
}

// Función principal
async function main() {
	try {
		console.log('🚀 Iniciando generación con DeepSeek Chat...');
		console.log('📅 Fecha:', new Date().toLocaleDateString());

		// Generar contenido
		const readingData = await generateWithDeepSeekChat();
		console.log('✅ Contenido generado');

		// Insertar en Supabase
		const result = await insertReadingToSupabase(readingData);
		
		if (result.success) {
			console.log('🎉 ¡Lectura generada e insertada exitosamente!');
			console.log('📖 ID de lectura:', result.readingId);
		} else {
			console.log('⚠️', result.message);
		}

	} catch (error) {
		console.error('💥 Error fatal:', error.message);
		process.exit(1);
	}
}

// Ejecutar si es llamado directamente
if (require.main === module) {
	main();
}

module.exports = { generateWithDeepSeekChat, insertReadingToSupabase };
