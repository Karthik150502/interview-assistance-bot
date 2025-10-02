import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function parseResume(extractedText: string) {

    const response = await openai.responses.create({
        model: "gpt-3.5-turbo",
        input: [
            {
                role: "system",
                content: `You are an expert resume parser with deep understanding of various resume formats and structures.
Analyze the provided resume text and extract the following information:
- Full name of the candidate
- Email address
- Phone number

Use your understanding of resume layouts, context clues, and common patterns to accurately identify this information.
Handle various formats including:
- Traditional resumes with clear sections
- Modern resumes with creative layouts
- Resumes with headers/footers
- International phone number formats
- Multiple contact methods

Return ONLY a valid JSON object with exactly these fields: name, email, phone
If information is not found, use "Unknown" for name and empty string "" for email/phone.
Do not include markdown, explanations, or any text outside the JSON object.`,
            },
            {
                role: "user",
                content: `Parse this resume and extract the candidate information: ${extractedText}`,
            },
        ]
    });
    return response;
}

