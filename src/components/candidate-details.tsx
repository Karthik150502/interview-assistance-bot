import type { Candidate } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChatMessage } from "@/components/chat-message"
import { Mail, Phone, FileText, Calendar, Clock } from "lucide-react"

interface CandidateDetailsProps {
  candidate: Candidate
}

export function CandidateDetails({ candidate }: CandidateDetailsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{candidate.name}</CardTitle>
              <div className="flex-col items-start gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 py-1">
                  <Mail className="h-4 w-4" />
                  {candidate.email}
                </div>
                <div className="flex items-center gap-1 py-1">
                  <Phone className="h-4 w-4" />
                  {candidate.phone}
                </div>
              </div>
            </div>
            {candidate.score !== null && (
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{candidate.score}</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-sm py-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Started:</span>
              <span>{candidate.startedAt ? new Date(candidate.startedAt).toLocaleString() : "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm py-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Completed:</span>
              <span>{candidate.completedAt ? new Date(candidate.completedAt).toLocaleString() : "N/A"}</span>
            </div>
            {candidate.resumeFileName && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Resume:</span>
                <span>{candidate.resumeFileName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge
              variant={
                candidate.status === "completed"
                  ? "default"
                  : candidate.status === "in-progress"
                    ? "secondary"
                    : "outline"
              }
            >
              {candidate.status}
            </Badge>
          </div>

          {candidate.summary && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">AI Summary:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.summary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interview Chat History</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[500px] overflow-y-auto space-y-4">
          {candidate.messages.length > 0 ? (
            candidate.messages.map((message) => <ChatMessage key={message.id} message={message} />)
          ) : (
            <p className="text-center text-muted-foreground py-8">No messages yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
