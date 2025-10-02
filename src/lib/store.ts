import { create } from "zustand"
import { persist } from "zustand/middleware"

export type QuestionDifficulty = "easy" | "medium" | "hard"

export interface Question {
  id: string
  text: string
  difficulty: QuestionDifficulty
  timeLimit: number // in seconds
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
}

export interface TimerState {
  questionId: string
  startTime: number
  timeSpent: number
  isPaused: boolean
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  resumeFileName?: string
  messages: Message[]
  questions: Question[]
  currentQuestionIndex: number
  answers: { questionId: string; answer: string; timeSpent: number }[]
  score: number | null
  summary: string | null
  status: "pending" | "in-progress" | "completed"
  startedAt: number | null
  completedAt: number | null
  timerState: TimerState | null
}

interface InterviewState {
  currentCandidate: Candidate | null
  candidates: Candidate[]

  // Actions
  createCandidate: (name: string, email: string, phone: string, resumeFileName?: string) => void
  updateCandidateInfo: (name: string, email: string, phone: string) => void
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void
  setQuestions: (questions: Question[]) => void
  submitAnswer: (answer: string, timeSpent: number) => void
  nextQuestion: () => void
  completeInterview: (score: number, summary: string) => void
  resetCurrentInterview: () => void
  hasActiveSession: () => boolean
  continueSession: () => void
  startNewSession: () => void
  updateTimerState: (timerState: TimerState) => void
  clearTimerState: () => void
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      currentCandidate: null,
      candidates: [],

      createCandidate: (name, email, phone, resumeFileName) => {
        const candidate: Candidate = {
          id: `candidate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          email,
          phone,
          resumeFileName,
          messages: [],
          questions: [],
          currentQuestionIndex: 0,
          answers: [],
          score: null,
          summary: null,
          status: "pending",
          startedAt: null,
          completedAt: null,
          timerState: null,
        }
        set({ currentCandidate: candidate })
      },

      updateCandidateInfo: (name, email, phone) => {
        set((state) => {
          if (!state.currentCandidate) return state
          return {
            currentCandidate: {
              ...state.currentCandidate,
              name,
              email,
              phone,
            },
          }
        })
      },

      addMessage: (message) => {
        set((state) => {
          if (!state.currentCandidate) return state
          const newMessage: Message = {
            ...message,
            id: `msg-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
          }
          return {
            currentCandidate: {
              ...state.currentCandidate,
              messages: [...state.currentCandidate.messages, newMessage],
            },
          }
        })
      },

      setQuestions: (questions) => {
        set((state) => {
          if (!state.currentCandidate) return state
          return {
            currentCandidate: {
              ...state.currentCandidate,
              questions,
              status: "in-progress",
              startedAt: Date.now(),
            },
          }
        })
      },

      submitAnswer: (answer, timeSpent) => {
        set((state) => {
          if (!state.currentCandidate) return state
          const currentQuestion = state.currentCandidate.questions[state.currentCandidate.currentQuestionIndex]
          if (!currentQuestion) return state

          return {
            currentCandidate: {
              ...state.currentCandidate,
              answers: [
                ...state.currentCandidate.answers,
                {
                  questionId: currentQuestion.id,
                  answer,
                  timeSpent,
                },
              ],
            },
          }
        })
      },

      nextQuestion: () => {
        set((state) => {
          if (!state.currentCandidate) return state
          return {
            currentCandidate: {
              ...state.currentCandidate,
              currentQuestionIndex: state.currentCandidate.currentQuestionIndex + 1,
              timerState: null,
            },
          }
        })
      },

      completeInterview: (score, summary) => {
        set((state) => {
          if (!state.currentCandidate) return state
          const completedCandidate: Candidate = {
            ...state.currentCandidate,
            score,
            summary,
            status: "completed",
            completedAt: Date.now(),
          }
          return {
            currentCandidate: null,
            candidates: [...state.candidates, completedCandidate],
          }
        })
      },

      resetCurrentInterview: () => {
        set({ currentCandidate: null })
      },

      hasActiveSession: () => {
        const state = get()
        return state.currentCandidate !== null && state.currentCandidate.status !== "completed"
      },

      continueSession: () => {
        // Session is already loaded from localStorage
      },

      startNewSession: () => {
        set({ currentCandidate: null })
      },

      updateTimerState: (timerState) => {
        set((state) => {
          if (!state.currentCandidate) return state
          return {
            currentCandidate: {
              ...state.currentCandidate,
              timerState,
            },
          }
        })
      },

      clearTimerState: () => {
        set((state) => {
          if (!state.currentCandidate) return state
          return {
            currentCandidate: {
              ...state.currentCandidate,
              timerState: null,
            },
          }
        })
      },
    }),
    {
      name: "interview-storage",
    },
  ),
)
