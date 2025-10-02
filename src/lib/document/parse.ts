"use server";
import PDFParser from 'pdf2json';

export async function pdfParser(fileBuffer: Buffer<ArrayBuffer>): Promise<string> {

    const pdfParser = new PDFParser();

    return new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (err) => {
            reject(err || "PDF parse error");
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            // Extract text from all pages
            const text = pdfData.Pages
                ?.map((page) =>
                    page.Texts
                        .map((textObj) =>
                            textObj.R.map((r) => decodeURIComponent(r.T)).join("")
                        )
                        .join(" ")
                )
                .join("\n");

            resolve(text);
        });

        pdfParser.parseBuffer(fileBuffer);
    });

}