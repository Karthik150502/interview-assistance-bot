"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useInterviewStore } from "@/lib/store"
import { CandidateList } from "@/components/candidate-list"
import { CandidateDetails } from "@/components/candidate-details"
import { Search, ArrowUpDown } from "lucide-react"

export function InterviewerTab() {
  const { candidates } = useInterviewStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"score" | "name">("score")
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)

  const filteredCandidates = candidates
    .filter((candidate) => {
      const query = searchQuery.toLowerCase()
      return (
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        candidate.phone.includes(query)
      )
    })
    .sort((a, b) => {
      if (sortBy === "score") {
        return (b.score || 0) - (a.score || 0)
      } else {
        return a.name.localeCompare(b.name)
      }
    })

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Candidates ({candidates.length})</CardTitle>
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => setSortBy(sortBy === "score" ? "name" : "score")}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Sorted by: {sortBy === "score" ? "Score" : "Name"}</p>
          </CardHeader>
          <CardContent>
            <CandidateList
              candidates={filteredCandidates}
              selectedId={selectedCandidateId}
              onSelect={setSelectedCandidateId}
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {selectedCandidate ? (
          <CandidateDetails candidate={selectedCandidate} />
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-[600px]">
              <p className="text-muted-foreground">Select a candidate to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
