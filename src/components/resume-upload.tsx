"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useInterviewStore } from "@/lib/store"
import { Upload, Loader2 } from "lucide-react"

export function ResumeUpload() {
  const { createCandidate, updateCandidateInfo, currentCandidate } = useInterviewStore()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [manualEntry, setManualEntry] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean
    title: string
    description: string
  }>({
    open: false,
    title: "",
    description: "",
  })

  const showAlert = (title: string, description: string) => {
    setAlertDialog({ open: true, title, description })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".docx")) {
        setFile(selectedFile)
      } else {
        showAlert("Invalid File Type", "Please upload a PDF or DOCX file")
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("resume", file)

      const response = await fetch("/api/parse-doc-ai", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.name && data.email && data.phone) {
        createCandidate(data.name, data.email, data.phone, file.name)
      } else {
        // Missing info, show manual entry
        setManualEntry(true)
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        })
        createCandidate(data.name || "", data.email || "", data.phone || "", file.name)
      }
    } catch (error) {
      showAlert("Processing Error", "Error processing resume. Please enter your details manually.")
      setManualEntry(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      showAlert("Missing Information", "Please fill in all fields")
      return
    }

    if (currentCandidate) {
      updateCandidateInfo(formData.name, formData.email, formData.phone)
    } else {
      createCandidate(formData.name, formData.email, formData.phone)
    }
  }

  if (
    manualEntry ||
    (currentCandidate && (!currentCandidate.name || !currentCandidate.email || !currentCandidate.phone))
  ) {
    return (
      <>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Complete Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>

            <Button onClick={handleManualSubmit} className="w-full">
              Continue
            </Button>
          </CardContent>
        </Card>

        <AlertDialog open={alertDialog.open} onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
              <AlertDialogDescription>{alertDialog.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Upload your resume (PDF or DOCX)</p>
              <Input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="cursor-pointer" />
            </div>
            {file && <p className="text-sm text-primary">Selected: {file.name}</p>}
          </div>

          <Button onClick={handleUpload} disabled={!file || isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Upload & Continue"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button variant="outline" onClick={() => setManualEntry(true)} className="w-full">
            Enter Details Manually
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={alertDialog.open} onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
