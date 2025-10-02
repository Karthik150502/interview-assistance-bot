"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useInterviewStore } from "@/lib/store"

interface WelcomeBackModalProps {
  open: boolean
  onClose: () => void
}

export function WelcomeBackModal({ open, onClose }: WelcomeBackModalProps) {
  const { continueSession, startNewSession } = useInterviewStore()

  const handleContinue = () => {
    continueSession()
    onClose()
  }

  const handleRestart = () => {
    startNewSession()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome Back!</DialogTitle>
          <DialogDescription>
            We found an active interview session. Would you like to continue where you left off or start a new
            interview?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleRestart}>
            Start New
          </Button>
          <Button onClick={handleContinue}>Continue Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
