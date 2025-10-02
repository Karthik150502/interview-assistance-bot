"use client"

import { useEffect, useState, useRef } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionTimerProps {
  questionId: string
  timeLimit: number
  onTimeUp: () => void
  onTimeUpdate: (timeSpent: number) => void
  isActive?: boolean
  initialTimeSpent?: number
}

export function QuestionTimer({
  questionId,
  timeLimit,
  onTimeUp,
  onTimeUpdate,
  isActive = true,
  initialTimeSpent = 0,
}: QuestionTimerProps) {
  const [timeSpent, setTimeSpent] = useState(initialTimeSpent)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasTriggeredTimeUp = useRef(false)
  const questionIdRef = useRef(questionId)
  const lastUpdatedTimeRef = useRef(initialTimeSpent)

  useEffect(() => {
    if (questionIdRef.current !== questionId) {
      console.log("Timer: Question changed, resetting", {
        oldId: questionIdRef.current,
        newId: questionId,
        timeLimit,
        initialTimeSpent,
      })

      questionIdRef.current = questionId
      setTimeSpent(initialTimeSpent)
      lastUpdatedTimeRef.current = initialTimeSpent
      hasTriggeredTimeUp.current = false

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [questionId, initialTimeSpent, timeLimit])

  useEffect(() => {
    // Only update if we're on the same question and initialTimeSpent has changed
    if (questionIdRef.current === questionId && initialTimeSpent !== timeSpent) {
      console.log("Timer: Restoring saved time", {
        questionId,
        initialTimeSpent,
        currentTimeSpent: timeSpent,
      })
      setTimeSpent(initialTimeSpent)
      lastUpdatedTimeRef.current = initialTimeSpent
    }
  }, [initialTimeSpent, questionId, timeSpent])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!isActive) {
      console.log("Timer: Inactive")
      return
    }

    console.log("Timer: Starting", { timeSpent, timeLimit, questionId })

    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => {
        const newTimeSpent = prev + 1

        // Update parent component with new time
        if (newTimeSpent !== lastUpdatedTimeRef.current) {
          lastUpdatedTimeRef.current = newTimeSpent
          setTimeout(() => onTimeUpdate(newTimeSpent), 0)
        }

        // Check if time is up
        if (newTimeSpent >= timeLimit && !hasTriggeredTimeUp.current) {
          console.log("Timer: Time limit reached!", { newTimeSpent, timeLimit })
          hasTriggeredTimeUp.current = true

          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          setTimeout(() => onTimeUp(), 0)
        }

        return newTimeSpent
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive, timeLimit, onTimeUp, questionId])

  const timeLeft = Math.max(0, timeLimit - timeSpent)
  const percentage = (timeLeft / timeLimit) * 100
  const isLow = percentage < 25

  return (
    <div className="flex items-center gap-2">
      <Clock className={cn("h-4 w-4", isLow && "text-destructive")} />
      <span className={cn("text-sm font-mono font-semibold", isLow && "text-destructive")}>
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </span>
    </div>
  )
}
