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

    const reasoningPrompt = `
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

    // DIRECT REST API CALL (Bypassing the library to fix 404 errors)
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    console.log("DEBUG: Attempting direct REST API call to Gemini Pro");

    const restResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: reasoningPrompt }] }]
      })
    });

    if (!restResponse.ok) {
      const errorData = await restResponse.json();
      console.error("DEBUG: REST API Error:", JSON.stringify(errorData));
      throw new Error(`Google API returned ${restResponse.status}: ${restResponse.statusText}`);
    }

    const restData = await restResponse.json();
    const text = restData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text returned from Gemini REST API");
    }

    console.log("DEBUG: Success! Received response from Gemini REST API");

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
