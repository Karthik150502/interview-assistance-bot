"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInterviewStore } from "@/lib/store"
import { Upload, Loader2 } from "lucide-react"
import { UserDetailsSchema } from "@/lib/schema/zod"
import { useForm } from "react-hook-form"
import z from "zod"

export function ResumeUpload() {
  const { createCandidate, updateCandidateInfo, currentCandidate } = useInterviewStore()
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState(false)
  const [manualEntry, setManualEntry] = useState(false)

  const form = useForm<z.infer<typeof UserDetailsSchema>>({
    resolver: zodResolver(UserDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    }
  });
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
        createCandidate(data.name || "", data.email || "", data.phone || "", file.name)
      }
    } catch {
      showAlert("Processing Error", "Error processing resume. Please enter your details manually.")
      setManualEntry(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualSubmit = (values: z.infer<typeof UserDetailsSchema>) => {
    startTransition(() => {
      if (currentCandidate) {
        updateCandidateInfo(values.name, values.email, values.phone)
      } else {
        createCandidate(values.name, values.email, values.phone)
      }
    });
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleManualSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder='Steve Rogers'
                            type="text"
                            autoComplete="name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className='w-full bg-red h-full relative'>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder='(e.g. steverogers11545@gmail.com)'
                              type={"email"}
                              autoComplete="email"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />

                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <div className='w-full bg-red h-full relative'>
                            <Input
                              {...field}
                              disabled={isPending}
                              type={"text"}
                              placeholder="(e.g. +91 98765 43210)"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isPending} className='w-full'>
                  {isPending && (
                    <>
                      <Loader2 className='animate-spin mr-2' size={18} />
                      <span>Submitting</span>
                    </>
                  )}
                  {!isPending && <span>Continue</span>}
                </Button>
              </form>
            </Form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button variant={"secondary"} disabled={isPending} className='w-full' onClick={() => setManualEntry(false)}>
              Upload Resume
            </Button>
          </CardContent>
        </Card >

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
