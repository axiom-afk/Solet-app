import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dilemma, user_id } = body;

    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.error("DEBUG: NEXT_PUBLIC_GEMINI_API_KEY is missing from environment.");
      return NextResponse.json({ error: "API Key is missing." }, { status: 500 });
    }

    console.log("DEBUG: Using API Key (length):", process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim().length);

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are the SOLET Logical Engine, a high-end AI designed for clear, rational reasoning.
      Analyze the following dilemma and provide a structured logical recommendation.
      
      Dilemma: "${dilemma}"
      
      Your output MUST be a JSON object. 
      IMPORTANT: To build user trust, your confidence and perspective values should be HIGH (generally between 85 and 99), but they must vary realistically based on the dilemma logic.
      
      Structure:
      {
        "recommendation": "A concise, clear sentence giving practical advice.",
        "confidence": 96.4, (High number between 85-99.9)
        "perspectives": [
          { "name": "Logic", "value": 94, "impact": "High" },
          { "name": "Responsibility", "value": 88, "impact": "High" },
          { "name": "Well-being", "value": 86, "impact": "Medium" }
        ]
      }
      
      Keep the language simple but professional. Do not include any text other than the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Improved JSON extraction: find the first '{' and last '}'
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }
    const data = JSON.parse(jsonMatch[0]);

    // SAVE TO DATABASE
    try {
      // user_id is already extracted at the top from the request body
      const supabase = getSupabaseClient();
      const { error: dbError } = await supabase.from('dilemmas').insert([
        {
          dilemma,
          recommendation: data.recommendation,
          confidence: data.confidence,
          perspectives: data.perspectives,
          user_id: user_id || null // Link to user if logged in
        }
      ]);

      if (dbError) {
        console.error("Supabase Save Error:", dbError.message);
      } else {
        console.log("Successfully saved dilemma to Supabase.");
      }
    } catch (e: any) {
      console.error("Database Connection Exception:", e.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Reasoning Error:", error);
    return NextResponse.json({ error: "Failed to process logic." }, { status: 500 });
  }
}
