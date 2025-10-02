"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IntervieweeTab } from "@/components/interviewee-tab"
import { InterviewerTab } from "@/components/interviewer-tab"
import { WelcomeBackModal } from "@/components/welcome-back-modal"
import { useInterviewStore } from "@/lib/store"
import { useEffect, useState } from "react"

export default function Home() {
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const { hasActiveSession } = useInterviewStore()

  useEffect(() => {
    // Check if there's an active session on mount
    if (hasActiveSession()) {
      setShowWelcomeBack(true)
    }
  }, [hasActiveSession])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">AI Interview Assistant</h1>
          <p className="text-muted-foreground">Powered by AI for smarter recruitment</p>
        </div>

        <Tabs defaultValue="interviewee" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="interviewee">Interviewee</TabsTrigger>
            <TabsTrigger value="interviewer">Interviewer</TabsTrigger>
          </TabsList>

          <TabsContent value="interviewee">
            <IntervieweeTab />
          </TabsContent>

          <TabsContent value="interviewer">
            <InterviewerTab />
          </TabsContent>
        </Tabs>
      </div>

      <WelcomeBackModal open={showWelcomeBack} onClose={() => setShowWelcomeBack(false)} />
    </main>
  )
}
