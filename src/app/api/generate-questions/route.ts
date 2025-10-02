import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import type { Question } from "@/lib/store"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export async function POST(request: NextRequest) {
  try {
    const { candidateName } = await request.json()

    //   if (!process.env.OPENAI_API_KEY) {
    //     console.warn("OPENAI_API_KEY not configured, using fallback questions")
    //     return NextResponse.json({ questions: getFallbackQuestions() })
    //   }

    //   const completion = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //       {
    //         role: "system",
    //         content: `You are an expert technical interviewer specializing in React and Node.js.
    // Generate 6 coding interview questions with the following distribution:
    // - 2 Easy questions (20 seconds each) - Basic concepts (One Line or Word Answers)
    // - 2 Medium questions (60 seconds each) - Intermediate concepts (One Line or Word Answers)
    // - 2 Hard questions (120 seconds each) - Advanced concepts (One Liner or Pratical Questions)

    // The questions must be designed so that the answer can be given in **one line or a single word**. Avoid long explanations or multi-step solutions. Focus on practical, testable React and Node.js topics.

    // Return ONLY a valid JSON array with this exact structure:
    // [
    //   {
    //     "id": "q1",
    //     "text": "question text here",
    //     "difficulty": "easy",
    //     "timeLimit": 20
    //   }
    // ]

    // Ensure each question is clear and concise.`
    //       },
    //       {
    //         role: "user",
    //         content: `Generate 6 interview questions for ${candidateName} focusing on React and Node.js development.`,
    //       },
    //     ],
    //     temperature: 0.8,
    //     max_tokens: 1000,
    //   })

    //   const content = completion.choices[0]?.message?.content
    //   if (!content) {
    //     throw new Error("No content received from OpenAI")
    //   }

    //   const questions: Question[] = JSON.parse(content)

    //   const validatedQuestions = questions.map((q, index) => ({
    //     id: q.id || `q${index + 1}`,
    //     text: q.text,
    //     difficulty: q.difficulty as "easy" | "medium" | "hard",
    //     timeLimit: q.timeLimit,
    //   }))

    return NextResponse.json({ questions: getFallbackQuestions() })
    // return NextResponse.json({ questions: validatedQuestions })
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({ questions: getFallbackQuestions() })
  }
}

function getFallbackQuestions(): Question[] {
  return [
    {
      id: "q1",
      text: "Which React hook is used to manage local state in functional components?",
      difficulty: "easy",
      timeLimit: 20
    },
    {
      id: "q2",
      text: "In Node.js, which module is used to handle file system operations?",
      difficulty: "easy",
      timeLimit: 20
    },
    {
      id: "q3",
      text: "Which React hook allows you to perform side effects after rendering?",
      difficulty: "medium",
      timeLimit: 60
    },
    {
      id: "q4",
      text: "In Node.js, which method reads a file asynchronously and accepts a callback?",
      difficulty: "medium",
      timeLimit: 60
    },
    {
      id: "q5",
      text: "Which React API is used to memoize a component to prevent unnecessary re-renders?",
      difficulty: "hard",
      timeLimit: 120
    },
    {
      id: "q6",
      text: "In Node.js, which core module enables streaming of data in chunks?",
      difficulty: "hard",
      timeLimit: 120
    }
  ]
}
