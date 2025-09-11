"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Star, Heart, HelpCircle, CheckCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { getDailyReading, type ReadingWithQuestions } from "@/lib/reading-service"

export default function DailyReadingPage() {
	const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
	const [showResults, setShowResults] = useState(false)
	const [todayReading, setTodayReading] = useState<ReadingWithQuestions | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadReading = async () => {
			try {
				setLoading(true)
				const reading = await getDailyReading()
				if (reading) {
					setTodayReading(reading)
				} else {
					setError("No se encontraron lecturas disponibles")
				}
			} catch (err) {
				console.error("Error loading reading:", err)
				setError("Error al cargar la lectura")
			} finally {
				setLoading(false)
			}
		}

		loadReading()
	}, [])

	// Datos de fallback si no hay lectura desde la base de datos
	const fallbackReading = {
		title: "El Pequeño Conejo Valiente",
		content: `Había una vez un pequeño conejo llamado Coco que vivía en un hermoso bosque lleno de flores coloridas. Coco era muy tímido y siempre se escondía detrás de su mamá cuando conocía a otros animales.

Un día, mientras jugaba cerca del río, escuchó un llanto muy fuerte. Era una pequeña ardilla que había caído al agua y no sabía nadar. Todos los animales grandes estaban lejos y no podían ayudar.

Coco sintió miedo, pero también sintió algo más fuerte en su corazón: quería ayudar. Sin pensarlo dos veces, saltó al agua y nadó hasta la ardilla. Con mucho cuidado, la ayudó a llegar a la orilla.

"¡Gracias, pequeño conejo valiente!" le dijo la ardilla. Desde ese día, Coco descubrió que ser valiente no significa no tener miedo, sino hacer lo correcto a pesar del miedo.`,
		questions: [
			{
				id: 1,
				reading_id: 1,
				question_text: "¿Cómo era Coco al principio de la historia?",
				correct_answer: "Tímido y se escondía",
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			},
			{
				id: 2,
				reading_id: 1,
				question_text: "¿Qué animal necesitaba ayuda?",
				correct_answer: "Una ardilla",
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			},
			{
				id: 3,
				reading_id: 1,
				question_text: "¿Qué aprendió Coco sobre la valentía?",
				correct_answer: "Que ser valiente es hacer lo correcto a pesar del miedo",
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			}
		]
	}

	// Usar datos de Supabase o fallback
	const currentReading = todayReading || fallbackReading

	const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionIndex]: answerIndex,
		}))
	}

	const handleSubmitAnswers = () => {
		setShowResults(true)
	}

	const getScore = () => {
		let correct = 0
		currentReading.questions.forEach((question, index) => {
			const options = getQuestionOptions(question)
			const correctIndex = options.indexOf(question.correct_answer)
			
			if (selectedAnswers[index] === correctIndex) {
				correct++
			}
		})
		return correct
	}

	// Obtener opciones para las preguntas
	const getQuestionOptions = (question: any) => {
		if (todayReading && question.options && question.options.length > 0) {
			// Usar opciones de la base de datos
			return question.options.map((option: any) => option.option_text)
		} else {
			// Fallback: generar opciones básicas
			return [
				question.correct_answer,
				"Opción incorrecta 1",
				"Opción incorrecta 2",
				"Opción incorrecta 3"
			]
		}
	}

	// Mostrar loading
	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Cargando lectura...</p>
				</div>
			</div>
		)
	}

	// Mostrar error
	if (error && !todayReading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<p className="text-destructive mb-4">{error}</p>
					<Button onClick={() => window.location.reload()}>
						Reintentar
					</Button>
				</div>
			</div>
		)
	}

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-primary rounded-full p-3">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">Lecturas Diarias</h1>
              <p className="text-muted-foreground">Una historia nueva cada día</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Date and Reading Info */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">
              {new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">3 minutos</span>
          </div>
        </div>

        {/* Story Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl md:text-3xl text-primary mb-2">{currentReading.title}</CardTitle>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
            </div>
          </CardHeader>
          <CardContent className="px-6 md:px-8">
            {/* <div className="flex justify-center mb-6">
              <img
                src="/cute-rabbit-helping-squirrel-by-a-river-in-colorfu.jpg"
                alt="Ilustración de la historia"
                className="rounded-lg shadow-md max-w-full h-auto"
              />
            </div> */}
            <div className="prose prose-lg max-w-none">
              {currentReading.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-foreground leading-relaxed mb-4 text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Preguntas de Comprensión
            </CardTitle>
            <p className="text-muted-foreground">¿Qué tanto entendiste de la historia?</p>
          </CardHeader>
          <CardContent className="px-6 md:px-8">
            <div className="space-y-6">
              {currentReading.questions.map((question, questionIndex) => {
                const options = getQuestionOptions(question)
                const correctIndex = options.indexOf(question.correct_answer)
                
                return (
                  <div key={questionIndex} className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">
                      {questionIndex + 1}. {question.question_text}
                    </h4>
                    <div className="grid gap-2">
                      {options.map((option: string, optionIndex: number) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                          className={`p-3 text-left rounded-lg border transition-colors ${
                            selectedAnswers[questionIndex] === optionIndex
                              ? showResults
                                ? optionIndex === correctIndex
                                  ? "bg-green-100 border-green-500 text-green-800"
                                  : "bg-red-100 border-red-500 text-red-800"
                                : "bg-primary/10 border-primary text-primary"
                              : showResults && optionIndex === correctIndex
                                ? "bg-green-100 border-green-500 text-green-800"
                                : "bg-card border-border hover:bg-accent/10"
                          }`}
                          disabled={showResults}
                        >
                          <div className="flex items-center gap-2">
                            {showResults && optionIndex === correctIndex && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {!showResults && Object.keys(selectedAnswers).length === currentReading.questions.length && (
              <div className="text-center mt-6">
                <Button onClick={handleSubmitAnswers} size="lg" className="px-8">
                  Ver Resultados
                </Button>
              </div>
            )}

            {showResults && (
              <div className="text-center mt-6 p-4 bg-accent/10 rounded-lg">
                <h3 className="text-xl font-bold text-accent mb-2">
                  ¡Obtuviste {getScore()} de {currentReading.questions.length} respuestas correctas!
                </h3>
                <p className="text-muted-foreground">
                  {getScore() === currentReading.questions.length
                    ? "¡Excelente! Entendiste perfectamente la historia."
                    : getScore() >= currentReading.questions.length / 2
                      ? "¡Muy bien! Captaste las ideas principales."
                      : "Puedes volver a leer la historia para entenderla mejor."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Moral Card */}
        <Card className="bg-accent/10 border-accent/20 mb-8">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="h-6 w-6 text-accent" />
              <h3 className="text-xl font-semibold text-accent">Mensaje del día</h3>
            </div>
            <p className="text-lg text-foreground font-medium italic">
              "{todayReading ? 'Cada historia nos enseña algo valioso sobre la vida.' : 'La verdadera valentía viene del corazón y nos ayuda a hacer el bien.'}"
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-3">
            <Heart className="h-5 w-5 mr-2" />
            Me gustó esta historia
          </Button>
          <Button variant="secondary" size="lg" className="text-lg px-8 py-3">
            <BookOpen className="h-5 w-5 mr-2" />
            Leer otra historia
          </Button>
        </div>

        {/* Fun Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">127</div>
            <div className="text-muted-foreground">Historias leídas</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-accent mb-2">45</div>
            <div className="text-muted-foreground">Días seguidos</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-secondary mb-2">⭐</div>
            <div className="text-muted-foreground">Lector estrella</div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">¡Vuelve mañana para una nueva aventura! 📚✨</p>
        </div>
      </footer>
    </div>
  )
}
