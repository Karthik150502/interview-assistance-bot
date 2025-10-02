"use client"

import type { Candidate } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface CandidateListProps {
  candidates: Candidate[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CandidateList({ candidates, selectedId, onSelect }: CandidateListProps) {
  if (candidates.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No candidates yet</div>
  }

  return (
    <div className="space-y-2">
      {candidates.map((candidate) => (
        <button
          key={candidate.id}
          onClick={() => onSelect(candidate.id)}
          className={cn(
            "w-full text-left p-4 rounded-lg border transition-colors",
            selectedId === candidate.id ? "bg-primary/10 border-primary" : "bg-card hover:bg-muted border-border",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{candidate.email}</p>
            </div>
            {candidate.score !== null && (
              <Badge variant={candidate.score >= 70 ? "default" : "secondary"}>{candidate.score}</Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
