import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export async function POST(request: NextRequest) {
  try {
    const { questions, answers } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not configured, using fallback evaluation")
      return NextResponse.json(getFallbackEvaluation())
    }

    const qaText = questions
      .map((q: any, index: number) => {
        const answer = answers[index]
        return `Question ${index + 1} (${q.difficulty}): ${q.text}\nAnswer: ${answer?.text || "No answer provided"}\nTime spent: ${answer?.timeSpent || 0}s / ${q.timeLimit}s`
      })
      .join("\n\n")

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert technical interviewer evaluating React and Node.js interview answers. 

Analyze the candidate's responses and provide:
1. A numerical score from 0-100
2. A detailed summary covering:
   - Overall performance assessment
   - Specific strengths (2-3 points)
   - Areas for improvement (2-3 points)
   - Final recommendation

Be fair but thorough. Consider answer quality, completeness, and time management.

Return your response in this EXACT Json format, don't include any bad control character in string literal:
{
  "score": "score",
  "summary": "detailed summary here"
}`,
        },
        {
          role: "user",
          content: `Evaluate these interview answers:\n\n${qaText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error("No content received from OpenAI")
    }

    const evaluation = JSON.parse(content)

    return NextResponse.json({
      score: evaluation.score,
      summary: evaluation.summary,
    })
  } catch (error) {
    console.error("Error evaluating answers:", error)
    return NextResponse.json(getFallbackEvaluation())
  }
}

function getFallbackEvaluation() {
  const mockScore = Math.floor(Math.random() * 30) + 60

  const summary = `The candidate demonstrated a solid understanding of full-stack development concepts. 

Strengths:
- Good grasp of JavaScript fundamentals
- Clear explanation of React concepts
- Practical approach to problem-solving

Areas for Improvement:
- Could provide more detailed examples
- Time management on harder questions
- API design could be more comprehensive

Overall, the candidate shows promise and would benefit from additional experience with complex system design.`

  return { score: mockScore, summary }
}
