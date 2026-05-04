const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const apiKey = "AIzaSyBTc7_EzVLNZDPJlw6jTNGQngu7fnxhoZs";
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Hello from Axiom");
    console.log("Success with gemini-2.5-flash:", result.response.text());
  } catch (err) {
    console.error("Error with gemini-2.5-flash:", err.message);
  }
}

test();
