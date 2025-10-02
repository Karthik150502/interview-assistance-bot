export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server"
import { pdfParser } from "@/lib/document/parse";
import { parseResume } from "@/lib/openai";

export async function POST(request: NextRequest) {

  // const formData = await request.formData()
  // const file = formData.get("resume") as File

  // if (!file) {
  //   return NextResponse.json({ error: "No file provided" }, { status: 400 })
  // }

  // let extractedText = ""

  // if (file.type === "application/pdf") {
  //   try {
  //     const arrayBuffer = await file.arrayBuffer();
  //     const pdfBuffer = Buffer.from(arrayBuffer);
  //     extractedText = await pdfParser(pdfBuffer);
  //   } catch (pdfError) {
  //     console.error("PDF parsing error:", pdfError)
  //     return NextResponse.json({ error: "Failed to parse PDF file" }, { status: 500 })
  //   }
  // } else if (
  //   file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
  //   file.type === "application/msword"
  // ) {
  //   try {
  //     const mammoth = await import("mammoth")
  //     const buffer = Buffer.from(await file.arrayBuffer())
  //     const result = await mammoth.extractRawText({ buffer })
  //     extractedText = result.value
  //   } catch (docxError) {
  //     console.error("DOCX parsing error:", docxError)
  //     return NextResponse.json({ error: "Failed to parse DOCX file" }, { status: 500 })
  //   }
  // } else {
  //   return NextResponse.json({ error: "Unsupported file type. Please upload PDF or DOCX." }, { status: 400 })
  // }

  // const data = await parseResume(extractedText);

  try {
    // const details = JSON.parse(data.output_text);
    // console.log({
    //   data
    // })
    // return NextResponse.json(details, { status: 200 })
    return NextResponse.json({
      name: "Karthik J",
      email: "karthikrdy150502@gmail.com",
      phone: "+917483935582"
    }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Unable to parse result from OpenAI" }, { status: 400 })
  }
}