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
    
    // Try multiple model names to find one that works in this region
    const modelNames = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    let text = "";
    let success = false;

    for (const name of modelNames) {
      try {
        console.log(`DEBUG: Attempting reasoning with model: ${name}`);
        const model = genAI.getGenerativeModel({ model: name });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        
        if (text) {
          console.log(`DEBUG: Success with model: ${name}`);
          success = true;
          break;
        }
      } catch (e: any) {
        console.error(`DEBUG: Model ${name} failed during generation:`, e.message);
        // If it's a 404 or other error, it will continue to the next model in the loop
      }
    }

    if (!success) {
      throw new Error("All Gemini models failed to respond. Check API Key and Netlify Region.");
    }

    // Improved JSON extraction: find the first '{' and last '}'
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }
    const data = JSON.parse(jsonMatch[0]);

    // SAVE TO DATABASE
    try {
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
