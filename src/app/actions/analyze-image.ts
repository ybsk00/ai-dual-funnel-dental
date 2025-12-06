"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeMedicalImage(formData: FormData) {
    try {
        const file = formData.get("image") as File;
        const modality = formData.get("modality") as string;
        const bodyPart = formData.get("bodyPart") as string;

        if (!file) {
            return { error: "No image provided" };
        }

        if (!process.env.GEMINI_API_KEY) {
            return { error: "GEMINI_API_KEY is not set" };
        }

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");

        // User requested Gemini 2.5 Pro (Live API support not needed for generateContent)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

        const prompt = `
You are an expert medical AI assistant specializing in musculoskeletal radiology. 
Analyze the provided ${modality} image of the ${bodyPart}.

Focus on identifying pathologies related to:
- Disc disorders (herniation, degeneration, stenosis)
- Joint issues (arthritis, effusion, structural damage)
- Muscle/tendon pathology (tears, inflammation, atrophy)
- Structural abnormalities causing pain

Provide a detailed analysis in the following structured Markdown format:

### 1. Key Findings
*   List specific abnormalities observed in the image.
*   Be precise about location (e.g., L4-L5 disc, Supraspinatus tendon).

### 2. Potential Causes of Pain
*   Connect the findings to likely clinical symptoms.
*   Explain *why* these findings might cause pain (e.g., nerve root compression).

### 3. Severity Assessment
*   Assess the severity of the findings (Mild / Moderate / Severe).

### 4. Recommendations
*   Suggest further imaging if needed.
*   Suggest potential clinical correlations to check.

**Disclaimer:** This analysis is for research and reference purposes only. It is NOT a definitive medical diagnosis. Please consult a qualified radiologist or physician for final interpretation.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        return { success: true, data: text };
    } catch (error) {
        console.error("Error analyzing image:", error);
        return { error: "Failed to analyze image" };
    }
}
