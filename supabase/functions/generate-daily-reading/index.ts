import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Configuración de temas variados para niños de 6-8 años
const THEMES = [
  {
    name: 'amistad',
    title: 'Los Mejores Amigos del Bosque',
    content: `Luna era una pequeña ardilla muy tímida que vivía en un gran roble. Todos los días veía a otros animales jugando juntos, pero ella nunca se atrevía a acercarse.

Un día de otoño, mientras recogía bellotas, vio a un pequeño erizo que se había quedado atrapado en una rama. Luna sintió mucha pena y decidió ayudarlo, aunque nunca había hablado con otros animales.

Con cuidado, trepó hasta donde estaba el erizo y lo liberó. El erizo, que se llamaba Púas, estaba muy agradecido y le preguntó si quería ser su amigo.

Desde ese día, Luna y Púas se volvieron los mejores amigos. Juntos exploraban el bosque, compartían comida y se ayudaban mutuamente. Luna aprendió que tener amigos es una de las cosas más bonitas de la vida.

Pronto, otros animales se unieron a su grupo de amigos. Luna ya no era tímida y había encontrado la felicidad en la amistad.`,
    questions: [
      {
        text: '¿Cómo se llamaba la ardilla de la historia?',
        options: [
          { text: 'Luna', correct: true },
          { text: 'Estrella', correct: false },
          { text: 'Sol', correct: false },
          { text: 'Nube', correct: false }
        ]
      },
      {
        text: '¿Qué problema tenía Luna?',
        options: [
          { text: 'Era muy tímida', correct: true },
          { text: 'No sabía trepar', correct: false },
          { text: 'No tenía comida', correct: false },
          { text: 'Era muy pequeña', correct: false }
        ]
      },
      {
        text: '¿A quién ayudó Luna?',
        options: [
          { text: 'A un erizo atrapado', correct: true },
          { text: 'A un pájaro herido', correct: false },
          { text: 'A un conejo perdido', correct: false },
          { text: 'A una mariposa', correct: false }
        ]
      },
      {
        text: '¿Qué aprendió Luna?',
        options: [
          { text: 'Que tener amigos es muy bonito', correct: true },
          { text: 'Que debe evitar a otros animales', correct: false },
          { text: 'Que es mejor estar sola', correct: false },
          { text: 'Que no debe ayudar a nadie', correct: false }
        ]
      },
      {
        text: '¿Cómo se sintió Luna al final?',
        options: [
          { text: 'Feliz y con muchos amigos', correct: true },
          { text: 'Triste y sola', correct: false },
          { text: 'Enojada con todos', correct: false },
          { text: 'Asustada de todo', correct: false }
        ]
      }
    ]
  },
  {
    name: 'naturaleza',
    title: 'El Jardín Mágico de la Abuela',
    content: `La abuela Rosa tenía el jardín más hermoso del pueblo. Allí crecían flores de todos los colores, árboles frutales y muchas plantas medicinales.

Su nieta María pasaba todas las tardes ayudando en el jardín. La abuela le enseñaba los nombres de las plantas, cómo cuidarlas y por qué cada una era especial.

"Las plantas son como nosotros", le decía la abuela. "Necesitan amor, agua y paciencia para crecer fuertes y hermosas."

María aprendió que las mariposas ayudan a las flores a reproducirse, que las abejas hacen la miel más dulce, y que cada planta tiene su propio propósito en la naturaleza.

Un día, una tormenta muy fuerte dañó muchas plantas del jardín. María se puso muy triste, pero la abuela le explicó que la naturaleza es resistente y que con cuidado y tiempo, todo volvería a crecer.

Juntas trabajaron para restaurar el jardín, y María se dio cuenta de que cuidar la naturaleza es una responsabilidad muy importante que todos debemos tener.`,
    questions: [
      {
        text: '¿Cómo se llamaba la abuela?',
        options: [
          { text: 'Rosa', correct: true },
          { text: 'María', correct: false },
          { text: 'Luna', correct: false },
          { text: 'Estrella', correct: false }
        ]
      },
      {
        text: '¿Qué tenía la abuela en su jardín?',
        options: [
          { text: 'Flores, árboles y plantas medicinales', correct: true },
          { text: 'Solo flores', correct: false },
          { text: 'Solo árboles', correct: false },
          { text: 'Solo verduras', correct: false }
        ]
      },
      {
        text: '¿Qué le enseñaba la abuela a María?',
        options: [
          { text: 'Los nombres de las plantas y cómo cuidarlas', correct: true },
          { text: 'A cocinar', correct: false },
          { text: 'A coser', correct: false },
          { text: 'A leer', correct: false }
        ]
      },
      {
        text: '¿Qué pasó con el jardín?',
        options: [
          { text: 'Una tormenta lo dañó', correct: true },
          { text: 'Se secó por falta de agua', correct: false },
          { text: 'Los animales lo destruyeron', correct: false },
          { text: 'Se llenó de maleza', correct: false }
        ]
      },
      {
        text: '¿Qué aprendió María?',
        options: [
          { text: 'Que cuidar la naturaleza es importante', correct: true },
          { text: 'Que las plantas no necesitan cuidado', correct: false },
          { text: 'Que no debe preocuparse por la naturaleza', correct: false },
          { text: 'Que es mejor no tener jardín', correct: false }
        ]
      }
    ]
  },
  {
    name: 'valores',
    title: 'El Tesoro de la Honestidad',
    content: `Pedro era un niño muy curioso que siempre exploraba el parque cerca de su casa. Un día, mientras jugaba, encontró una billetera tirada en el suelo.

Al abrirla, vio que tenía mucho dinero y una tarjeta con el nombre y teléfono del dueño. Pedro se sintió tentado de quedarse con el dinero, pero recordó lo que su mamá siempre le decía sobre la honestidad.

Decidió llamar al número que estaba en la tarjeta. El dueño, un señor mayor, estaba muy agradecido porque esa billetera contenía el dinero para la medicina de su esposa enferma.

El señor le dio las gracias a Pedro y le ofreció una recompensa, pero Pedro la rechazó educadamente. "Hacer lo correcto es su propia recompensa", le dijo.

Años después, cuando Pedro creció, ese mismo señor se convirtió en su mentor y le ayudó a conseguir su primer trabajo. Pedro aprendió que la honestidad siempre trae buenas consecuencias, aunque no siempre de inmediato.`,
    questions: [
      {
        text: '¿Qué encontró Pedro en el parque?',
        options: [
          { text: 'Una billetera con dinero', correct: true },
          { text: 'Un juguete', correct: false },
          { text: 'Una pelota', correct: false },
          { text: 'Un libro', correct: false }
        ]
      },
      {
        text: '¿Qué hizo Pedro con la billetera?',
        options: [
          { text: 'Llamó al dueño para devolvérsela', correct: true },
          { text: 'Se la quedó', correct: false },
          { text: 'La tiró a la basura', correct: false },
          { text: 'Se la dio a un amigo', correct: false }
        ]
      },
      {
        text: '¿Por qué era importante la billetera para el dueño?',
        options: [
          { text: 'Tenía dinero para la medicina de su esposa', correct: true },
          { text: 'Tenía fotos importantes', correct: false },
          { text: 'Era muy cara', correct: false },
          { text: 'Era un regalo especial', correct: false }
        ]
      },
      {
        text: '¿Qué le dijo Pedro al señor sobre la recompensa?',
        options: [
          { text: 'Que hacer lo correcto es su propia recompensa', correct: true },
          { text: 'Que quería mucho dinero', correct: false },
          { text: 'Que no le importaba', correct: false },
          { text: 'Que la aceptaba', correct: false }
        ]
      },
      {
        text: '¿Qué pasó años después?',
        options: [
          { text: 'El señor se convirtió en su mentor', correct: true },
          { text: 'Pedro se olvidó del señor', correct: false },
          { text: 'El señor se enojó con Pedro', correct: false },
          { text: 'Nunca se volvieron a ver', correct: false }
        ]
      }
    ]
  }
]

// Función para seleccionar tema basado en la fecha
function selectThemeByDate(): typeof THEMES[0] {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const themeIndex = dayOfYear % THEMES.length
  return THEMES[themeIndex]
}

// Función para verificar si ya existe una lectura para hoy
async function checkExistingReading(supabase: any): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('readings')
    .select('id')
    .eq('created_at', today)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw new Error(`Error verificando lectura existente: ${error.message}`)
  }
  
  return !!data
}

// Función para insertar la lectura en la base de datos
async function insertReading(supabase: any, theme: typeof THEMES[0]): Promise<{ success: boolean; readingId?: number; error?: string }> {
  try {
    // Insertar la lectura
    const { data: reading, error: readingError } = await supabase
      .from('readings')
      .insert({
        title: theme.title,
        content: theme.content
      })
      .select()
      .single()

    if (readingError) {
      throw new Error(`Error insertando lectura: ${readingError.message}`)
    }

    // Insertar preguntas y opciones
    for (const questionData of theme.questions) {
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert({
          reading_id: reading.id,
          question_text: questionData.text
        })
        .select()
        .single()

      if (questionError) {
        throw new Error(`Error insertando pregunta: ${questionError.message}`)
      }

      // Insertar opciones
      for (const option of questionData.options) {
        const { error: optionError } = await supabase
          .from('question_options')
          .insert({
            question_id: question.id,
            option_text: option.text,
            is_correct: option.correct
          })

        if (optionError) {
          throw new Error(`Error insertando opción: ${optionError.message}`)
        }
      }
    }

    return { success: true, readingId: reading.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Función principal del Edge Function
Deno.serve(async (req: Request) => {
  try {
    // Verificar método HTTP
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método no permitido' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verificar secret de seguridad (opcional)
    const authHeader = req.headers.get('authorization')
    const expectedSecret = Deno.env.get('CRON_SECRET')
    
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Inicializar cliente de Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Faltan variables de entorno de Supabase')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verificar si ya existe una lectura para hoy
    const hasExistingReading = await checkExistingReading(supabase)
    if (hasExistingReading) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Ya existe una lectura para hoy'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Seleccionar tema para hoy
    const selectedTheme = selectThemeByDate()

    // Insertar la lectura
    const result = await insertReading(supabase, selectedTheme)

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Lectura generada exitosamente',
        readingId: result.readingId,
        theme: selectedTheme.name
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.error
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    console.error('Error en generate-daily-reading:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
