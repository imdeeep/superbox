const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const refineContext = async (context) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  console.log("Processing Chunks ...");

  const prompt = `
  Refine the following content. Follow these steps:
    - Analyze the content and remove irrelevant or redundant information.
    - If any code is found, format it properly using appropriate code block styles.
    - Keep the content in long-form and do not summarize it.
    - Maintain structured data such as timelines, lists, and ordered steps.
    - Keep all relevant details, formatting, and any documentation intact.
    - Provide the content in a structured format, ensuring clarity, proper sections, and readability.

    Content to refine:
    ${context}
  `;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error refining content with Gemini:", error);
    return context; // Return original content
  }
};

const chunkContext = async (context, chunkSize = 5000) => {
  let chunks = [];
  for (let i = 0; i < context.length; i += chunkSize) {
    chunks.push(context.slice(i, i + chunkSize));
  }

  let refinedChunks = [];

  for (let chunk of chunks) {
    const refinedChunk = await refineContext(chunk);
    refinedChunks.push(refinedChunk);
  }

  const combinedContext = refinedChunks.join(' ');
  console.log("Refining Done!")

  return combinedContext; 
};

module.exports = {chunkContext};