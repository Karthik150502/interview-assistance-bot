"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useInterviewStore } from "@/lib/store"
import { ResumeUpload } from "@/components/resume-upload"
import { ChatMessage } from "@/components/chat-message"
import { QuestionTimer } from "@/components/question-timer"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import Editdetails from "./edit-details"
import { UserDetailsSchema } from "@/lib/schema/zod"
import z from "zod"

export function IntervieweeTab() {
  const {
    currentCandidate,
    addMessage,
    setQuestions,
    submitAnswer,
    nextQuestion,
    completeInterview,
    updateTimerState,
    updateCandidateInfo
  } = useInterviewStore()

  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isSubmittingRef = useRef(false)
  const currentQuestionIdRef = useRef<string | null>(null)
  const currentCandidateIdRef = useRef<string | null>(null)
  const [editDetails, showEditDetailsModal] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  useEffect(() => {
    if (!currentCandidate) {
      setCurrentAnswer("")
      setTimeSpent(0)
      setIsTimerActive(false)
      isSubmittingRef.current = false
      currentQuestionIdRef.current = null
      currentCandidateIdRef.current = null
      return
    }

    if (currentCandidateIdRef.current !== currentCandidate.id) {
      console.log("New candidate detected, resetting all state")
      setCurrentAnswer("")
      setTimeSpent(0)
      setIsTimerActive(false)
      isSubmittingRef.current = false
      currentQuestionIdRef.current = null
      currentCandidateIdRef.current = currentCandidate.id
    }
  }, [currentCandidate])

  useEffect(() => {
    if (!currentCandidate || currentCandidate.status !== "in-progress") {
      setIsTimerActive(false)
      return
    }

    const currentQuestion = currentCandidate.questions[currentCandidate.currentQuestionIndex]
    if (!currentQuestion) return

    const isNewQuestion = currentQuestionIdRef.current !== currentQuestion.id

    if (isNewQuestion) {
      console.log("New question detected, resetting timer", {
        questionId: currentQuestion.id,
        timeLimit: currentQuestion.timeLimit,
      })

      currentQuestionIdRef.current = currentQuestion.id
      isSubmittingRef.current = false

      // Check if we're restoring from a page refresh
      if (currentCandidate.timerState?.questionId === currentQuestion.id) {
        const savedTimeSpent = currentCandidate.timerState.timeSpent
        console.log("Restoring timer from page refresh", { savedTimeSpent })
        setTimeSpent(savedTimeSpent)
        setIsTimerActive(!currentCandidate.timerState.isPaused)
      } else {
        console.log("Starting fresh timer for new question")
        setTimeSpent(0)
        setIsTimerActive(true)
      }
    }
  }, [currentCandidate])

  const handleTimeUpdate = (newTimeSpent: number) => {
    setTimeSpent(newTimeSpent)

    if (!currentCandidate) return

    const currentQuestion = currentCandidate.questions[currentCandidate.currentQuestionIndex]
    if (!currentQuestion) return

    updateTimerState({
      questionId: currentQuestion.id,
      startTime: Date.now(),
      timeSpent: newTimeSpent,
      isPaused: !isTimerActive,
    })
  }

  const handleGenerateQuestions = async () => {
    if (!currentCandidate) return

    const results = UserDetailsSchema.safeParse({
      name: currentCandidate.name,
      email: currentCandidate.email,
      phone: currentCandidate.phone
    });;

    if (!results.success) {
      showEditDetailsModal(true);
      return
    }

    setIsGenerating(true)
    addMessage({
      role: "system",
      content: "Generating interview questions...",
    })

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: currentCandidate.name,
        }),
      })

      const data = await response.json()
      setQuestions(data.questions)

      addMessage({
        role: "assistant",
        content: `Great! I've prepared 6 coding questions for you. Let's begin with question 1.`,
      })

      addMessage({
        role: "assistant",
        content: data.questions[0].text,
      })
    } catch (error) {
      addMessage({
        role: "system",
        content: "Error generating questions. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!currentCandidate || isSubmittingRef.current) {
      console.log("Submission blocked", { isSubmitting: isSubmittingRef.current })
      return
    }

    isSubmittingRef.current = true
    console.log("Starting submission", { timeSpent, questionIndex: currentCandidate.currentQuestionIndex })

    const answerToSubmit = currentAnswer.trim() || "No answer provided"
    const currentQuestion = currentCandidate.questions[currentCandidate.currentQuestionIndex]
    const finalTimeSpent = timeSpent

    if (!currentQuestion) {
      isSubmittingRef.current = false
      return
    }

    setIsTimerActive(false)

    addMessage({
      role: "user",
      content: answerToSubmit,
    })

    submitAnswer(answerToSubmit, finalTimeSpent)

    setCurrentAnswer("")

    if (currentCandidate.currentQuestionIndex === currentCandidate.questions.length - 1) {
      addMessage({
        role: "system",
        content: "Evaluating your answers...",
      })

      try {
        const response = await fetch("/api/evaluate-answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questions: currentCandidate.questions,
            answers: [
              ...currentCandidate.answers,
              { questionId: currentQuestion.id, answer: answerToSubmit, timeSpent: finalTimeSpent },
            ],
          }),
        })

        const data = await response.json()
        completeInterview(data.score, data.summary)

        addMessage({
          role: "assistant",
          content: `Interview completed! Your score: ${data.score}/100\n\n${data.summary}`,
        })
      } catch (error) {
        addMessage({
          role: "system",
          content: "Error evaluating answers. Please contact support.",
        })
      }

      isSubmittingRef.current = false
    } else {
      nextQuestion()
      setTimeSpent(0)

      setTimeout(() => {
        const nextQ = currentCandidate.questions[currentCandidate.currentQuestionIndex + 1]
        if (nextQ) {
          addMessage({
            role: "assistant",
            content: nextQ.text,
          })
        }
      }, 100)
    }
  }

  const handleTimeUp = () => {
    console.log("Time up called", { isSubmitting: isSubmittingRef.current })

    if (isSubmittingRef.current) {
      console.log("Already submitting, ignoring time up")
      return
    }

    // Set the answer if empty
    if (!currentAnswer.trim()) {
      setCurrentAnswer("No answer provided (time expired)")
    }

    // Wait for state to update, then submit
    setTimeout(() => {
      handleSubmitAnswer()
    }, 100)
  }

  if (!currentCandidate) {
    return <ResumeUpload />
  }

  if (currentCandidate.status === "pending") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ready to Start?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Name:</strong> {currentCandidate.name}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> {currentCandidate.email}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Phone:</strong> {currentCandidate.phone}
            </p>
          </div>
          <Editdetails
            setOpenModal={showEditDetailsModal}
            openModal={editDetails}
            values={{
              name: currentCandidate.name,
              email: currentCandidate.email,
              phone: currentCandidate.phone
            }}
            updateCandidate={(values: z.infer<typeof UserDetailsSchema>) => {
              updateCandidateInfo(values.name, values.email, values.phone)
            }}
          />
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Interview Format:</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>6 coding questions (2 Easy, 2 Medium, 2 Hard)</li>
              <li>Easy: 20 seconds each</li>
              <li>Medium: 60 seconds each</li>
              <li>Hard: 120 seconds each</li>
              <li>Questions auto-submit when time expires</li>
            </ul>
          </div>

          <Button onClick={handleGenerateQuestions} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              "Start Interview"
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (currentCandidate.status === "completed") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Interview Completed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-primary">{currentCandidate.score}/100</div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Summary:</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentCandidate.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = currentCandidate.questions[currentCandidate.currentQuestionIndex]
  const progress = ((currentCandidate.currentQuestionIndex + 1) / currentCandidate.questions.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Question {currentCandidate.currentQuestionIndex + 1} of {currentCandidate.questions.length}
            </CardTitle>
            {currentQuestion && (
              <QuestionTimer
                questionId={currentQuestion.id}
                timeLimit={currentQuestion.timeLimit}
                onTimeUp={handleTimeUp}
                onTimeUpdate={handleTimeUpdate}
                isActive={isTimerActive}
                initialTimeSpent={timeSpent}
              />
            )}
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      <Card className="h-[400px] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentCandidate.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <Textarea
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button onClick={handleSubmitAnswer} className="w-full" disabled={isSubmittingRef.current}>
            Submit Answer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
