-- Script SQL para generar lecturas diarias en Supabase
-- Este script se puede ejecutar directamente en el SQL Editor de Supabase

-- Función para generar una lectura diaria
CREATE OR REPLACE FUNCTION generate_daily_reading()
RETURNS JSON AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
    reading_id INTEGER;
    question_id INTEGER;
    option_record RECORD;
    result JSON;
BEGIN
    -- Verificar si ya existe una lectura para hoy
    IF EXISTS (SELECT 1 FROM readings WHERE DATE(created_at) = today_date) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Ya existe una lectura para hoy'
        );
    END IF;

    -- Insertar la nueva lectura
    INSERT INTO readings (title, content, created_at, updated_at)
    VALUES (
        'La Aventura del Pequeño Dragón',
        'Había una vez un pequeño dragón llamado Chispitas que vivía en una montaña muy alta. A diferencia de otros dragones, Chispitas no sabía volar muy bien y siempre se caía cuando intentaba hacerlo.

Un día, mientras practicaba volar, vio a una pequeña ave que se había lastimado el ala y no podía volar de vuelta a su nido. Chispitas sintió mucha pena por el ave y decidió ayudarla.

Aunque tenía miedo de volar, Chispitas sabía que tenía que intentarlo. Con mucho cuidado, tomó al ave en sus garras y voló lentamente hacia el árbol donde estaba el nido. Era difícil mantener el equilibrio, pero Chispitas no se rindió.

Cuando llegó al nido, colocó suavemente al ave junto a sus hermanitos. La mamá ave estaba muy agradecida y le dio las gracias a Chispitas con un hermoso canto.

Desde ese día, Chispitas se sintió más confiado para volar. Había aprendido que cuando ayudamos a otros, también nos ayudamos a nosotros mismos. Y aunque seguía siendo un dragón pequeño, ahora sabía que tenía un gran corazón.

Todos los animales de la montaña admiraban a Chispitas por su valentía y bondad. Y él se sintió muy feliz de haber podido ayudar a su amiga ave.',
        NOW(),
        NOW()
    ) RETURNING id INTO reading_id;

    -- Insertar preguntas y opciones
    -- Pregunta 1
    INSERT INTO questions (reading_id, question_text, created_at, updated_at)
    VALUES (reading_id, '¿Cómo se llamaba el pequeño dragón?', NOW(), NOW())
    RETURNING id INTO question_id;

    INSERT INTO question_options (question_id, option_text, is_correct, created_at, updated_at) VALUES
    (question_id, 'Chispitas', true, NOW(), NOW()),
    (question_id, 'Fueguito', false, NOW(), NOW()),
    (question_id, 'Dragoncito', false, NOW(), NOW()),
    (question_id, 'Volador', false, NOW(), NOW());

    -- Pregunta 2
    INSERT INTO questions (reading_id, question_text, created_at, updated_at)
    VALUES (reading_id, '¿Qué problema tenía Chispitas?', NOW(), NOW())
    RETURNING id INTO question_id;

    INSERT INTO question_options (question_id, option_text, is_correct, created_at, updated_at) VALUES
    (question_id, 'No sabía volar muy bien', true, NOW(), NOW()),
    (question_id, 'No tenía amigos', false, NOW(), NOW()),
    (question_id, 'Era muy pequeño', false, NOW(), NOW()),
    (question_id, 'No sabía hablar', false, NOW(), NOW());

    -- Pregunta 3
    INSERT INTO questions (reading_id, question_text, created_at, updated_at)
    VALUES (reading_id, '¿A quién ayudó Chispitas?', NOW(), NOW())
    RETURNING id INTO question_id;

    INSERT INTO question_options (question_id, option_text, is_correct, created_at, updated_at) VALUES
    (question_id, 'A un ave lastimada', true, NOW(), NOW()),
    (question_id, 'A otro dragón', false, NOW(), NOW()),
    (question_id, 'A un conejo', false, NOW(), NOW()),
    (question_id, 'A un gato', false, NOW(), NOW());

    -- Pregunta 4
    INSERT INTO questions (reading_id, question_text, created_at, updated_at)
    VALUES (reading_id, '¿Cómo se sintió Chispitas después de ayudar?', NOW(), NOW())
    RETURNING id INTO question_id;

    INSERT INTO question_options (question_id, option_text, is_correct, created_at, updated_at) VALUES
    (question_id, 'Más confiado para volar', true, NOW(), NOW()),
    (question_id, 'Más triste', false, NOW(), NOW()),
    (question_id, 'Más enojado', false, NOW(), NOW()),
    (question_id, 'Más asustado', false, NOW(), NOW());

    -- Pregunta 5
    INSERT INTO questions (reading_id, question_text, created_at, updated_at)
    VALUES (reading_id, '¿Qué aprendió Chispitas?', NOW(), NOW())
    RETURNING id INTO question_id;

    INSERT INTO question_options (question_id, option_text, is_correct, created_at, updated_at) VALUES
    (question_id, 'Que cuando ayudamos a otros, también nos ayudamos a nosotros mismos', true, NOW(), NOW()),
    (question_id, 'Que no debe ayudar a nadie', false, NOW(), NOW()),
    (question_id, 'Que volar es muy difícil', false, NOW(), NOW()),
    (question_id, 'Que los dragones son mejores que otros animales', false, NOW(), NOW());

    -- Retornar resultado exitoso
    RETURN json_build_object(
        'success', true,
        'reading_id', reading_id,
        'message', 'Lectura generada exitosamente'
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Error generando lectura'
        );
END;
$$ LANGUAGE plpgsql;

-- Función para generar lecturas con temas variados
CREATE OR REPLACE FUNCTION generate_varied_reading()
RETURNS JSON AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
    reading_id INTEGER;
    question_id INTEGER;
    themes TEXT[] := ARRAY['amistad', 'naturaleza', 'valores', 'aventura', 'familia'];
    selected_theme TEXT;
    title_text TEXT;
    content_text TEXT;
    result JSON;
BEGIN
    -- Verificar si ya existe una lectura para hoy
    IF EXISTS (SELECT 1 FROM readings WHERE DATE(created_at) = today_date) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Ya existe una lectura para hoy'
        );
    END IF;

    -- Seleccionar tema basado en el día del año
    selected_theme := themes[1 + (EXTRACT(DOY FROM today_date) % array_length(themes, 1))];

    -- Generar contenido basado en el tema
    CASE selected_theme
        WHEN 'amistad' THEN
            title_text := 'Los Mejores Amigos del Bosque';
            content_text := 'Luna era una pequeña ardilla muy tímida que vivía en un gran roble. Todos los días veía a otros animales jugando juntos, pero ella nunca se atrevía a acercarse.

Un día de otoño, mientras recogía bellotas, vio a un pequeño erizo que se había quedado atrapado en una rama. Luna sintió mucha pena y decidió ayudarlo, aunque nunca había hablado con otros animales.

Con cuidado, trepó hasta donde estaba el erizo y lo liberó. El erizo, que se llamaba Púas, estaba muy agradecido y le preguntó si quería ser su amigo.

Desde ese día, Luna y Púas se volvieron los mejores amigos. Juntos exploraban el bosque, compartían comida y se ayudaban mutuamente. Luna aprendió que tener amigos es una de las cosas más bonitas de la vida.

Pronto, otros animales se unieron a su grupo de amigos. Luna ya no era tímida y había encontrado la felicidad en la amistad.';
            
        WHEN 'naturaleza' THEN
            title_text := 'El Jardín Mágico de la Abuela';
            content_text := 'La abuela Rosa tenía el jardín más hermoso del pueblo. Allí crecían flores de todos los colores, árboles frutales y muchas plantas medicinales.

Su nieta María pasaba todas las tardes ayudando en el jardín. La abuela le enseñaba los nombres de las plantas, cómo cuidarlas y por qué cada una era especial.

"Las plantas son como nosotros", le decía la abuela. "Necesitan amor, agua y paciencia para crecer fuertes y hermosas."

María aprendió que las mariposas ayudan a las flores a reproducirse, que las abejas hacen la miel más dulce, y que cada planta tiene su propio propósito en la naturaleza.

Un día, una tormenta muy fuerte dañó muchas plantas del jardín. María se puso muy triste, pero la abuela le explicó que la naturaleza es resistente y que con cuidado y tiempo, todo volvería a crecer.

Juntas trabajaron para restaurar el jardín, y María se dio cuenta de que cuidar la naturaleza es una responsabilidad muy importante que todos debemos tener.';
            
        WHEN 'valores' THEN
            title_text := 'El Tesoro de la Honestidad';
            content_text := 'Pedro era un niño muy curioso que siempre exploraba el parque cerca de su casa. Un día, mientras jugaba, encontró una billetera tirada en el suelo.

Al abrirla, vio que tenía mucho dinero y una tarjeta con el nombre y teléfono del dueño. Pedro se sintió tentado de quedarse con el dinero, pero recordó lo que su mamá siempre le decía sobre la honestidad.

Decidió llamar al número que estaba en la tarjeta. El dueño, un señor mayor, estaba muy agradecido porque esa billetera contenía el dinero para la medicina de su esposa enferma.

El señor le dio las gracias a Pedro y le ofreció una recompensa, pero Pedro la rechazó educadamente. "Hacer lo correcto es su propia recompensa", le dijo.

Años después, cuando Pedro creció, ese mismo señor se convirtió en su mentor y le ayudó a conseguir su primer trabajo. Pedro aprendió que la honestidad siempre trae buenas consecuencias, aunque no siempre de inmediato.';
            
        WHEN 'aventura' THEN
            title_text := 'La Expedición al Monte Perdido';
            content_text := 'Ana y su hermano Carlos decidieron explorar el Monte Perdido, una montaña que nadie en el pueblo había escalado. Sus padres les dieron permiso, pero les advirtieron que tuvieran mucho cuidado.

Durante la subida, encontraron una cueva misteriosa con pinturas antiguas en las paredes. Las pinturas mostraban animales y personas de hace muchos años. Ana y Carlos se sintieron como verdaderos exploradores.

En la cueva también encontraron un mapa antiguo que los llevó a un tesoro escondido: una caja con monedas de oro y una carta que explicaba la historia del lugar.

Pero lo más importante que encontraron fue la confianza en sí mismos. Habían logrado algo que pensaban era imposible. Juntos, Ana y Carlos aprendieron que con determinación y trabajo en equipo, pueden lograr cualquier cosa que se propongan.

Cuando regresaron al pueblo, contaron su aventura y se convirtieron en los héroes del lugar. Pero sabían que el verdadero tesoro era la experiencia y la confianza que habían ganado.';
            
        WHEN 'familia' THEN
            title_text := 'La Reunión Familiar de los Abuelos';
            content_text := 'Todos los domingos, la familia de Sofía se reunía en la casa de los abuelos. Era una tradición que llevaban años manteniendo, y Sofía la esperaba con mucha ilusión cada semana.

Su abuela preparaba la comida más deliciosa, su abuelo contaba historias de cuando era joven, y todos los primos jugaban en el jardín. Era el día más especial de la semana.

Un domingo, Sofía se dio cuenta de que su abuelo se veía un poco triste. Cuando le preguntó qué pasaba, él le explicó que extrañaba a su hermano que vivía muy lejos.

Sofía tuvo una idea: organizar una videollamada para que el abuelo pudiera hablar con su hermano. Cuando lo lograron, el abuelo se puso muy feliz y todos celebraron.

Desde ese día, las reuniones familiares incluyeron también a los familiares que vivían lejos. Sofía aprendió que la familia no solo son las personas que vives cerca, sino todas las personas que amas, sin importar qué tan lejos estén.

La tradición familiar se volvió aún más especial, y Sofía se sintió orgullosa de haber ayudado a mantener unida a toda su familia.';
    END CASE;

    -- Insertar la lectura
    INSERT INTO readings (title, content, created_at, updated_at)
    VALUES (title_text, content_text, NOW(), NOW())
    RETURNING id INTO reading_id;

    -- Insertar preguntas genéricas que funcionan para cualquier tema
    INSERT INTO questions (reading_id, question_text, created_at, updated_at)
    VALUES (reading_id, '¿Cuál es el tema principal de esta historia?', NOW(), NOW())
    RETURNING id INTO question_id;

    INSERT INTO question_options (question_id, option_text, is_correct, created_at, updated_at) VALUES
    (question_id, selected_theme, true, NOW(), NOW()),
    (question_id, 'aventura', false, NOW(), NOW()),
    (question_id, 'misterio', false, NOW(), NOW()),
    (question_id, 'ciencia', false, NOW(), NOW());

    -- Más preguntas genéricas...
    INSERT INTO questions (reading_id, question_text, created_at, updated_at)
    VALUES (reading_id, '¿Qué aprendió el personaje principal?', NOW(), NOW())
    RETURNING id INTO question_id;

    INSERT INTO question_options (question_id, option_text, is_correct, created_at, updated_at) VALUES
    (question_id, 'Una lección importante sobre la vida', true, NOW(), NOW()),
    (question_id, 'A no hacer nada', false, NOW(), NOW()),
    (question_id, 'A ser egoísta', false, NOW(), NOW()),
    (question_id, 'A evitar problemas', false, NOW(), NOW());

    -- Retornar resultado exitoso
    RETURN json_build_object(
        'success', true,
        'reading_id', reading_id,
        'theme', selected_theme,
        'message', 'Lectura generada exitosamente'
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Error generando lectura'
        );
END;
$$ LANGUAGE plpgsql;

-- Función para ejecutar la generación diaria
CREATE OR REPLACE FUNCTION run_daily_generation()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Intentar generar con tema variado primero
    SELECT generate_varied_reading() INTO result;
    
    -- Si falla, usar la función básica
    IF (result->>'success')::boolean = false THEN
        SELECT generate_daily_reading() INTO result;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Comentarios de uso:
-- Para ejecutar la generación diaria, usa:
-- SELECT run_daily_generation();

-- Para generar una lectura específica:
-- SELECT generate_daily_reading();
-- SELECT generate_varied_reading();
