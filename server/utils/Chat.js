const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

/**
 * Generates a chat response using provided context and/or general knowledge.
 * @param {string} message - The user's input message.
 * @param {string} context - The context of the current conversation.
 * @returns {Promise<string>} - The AI's response.
 */

const chat = async (message, context = "") => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are an intelligent Ai assistant named Superbox. Answer the following question.

Context (if available):
${context || "No context provided."}

Question:
${message}

Guidelines:
1. If context is relevant, use it to enhance the response.
2. If context is irrelevant or unavailable, rely on general knowledge.
3. Provide a clear, factual, and concise answer.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating response with Gemini:", error);
    return "I apologize, but I encountered an error processing your request. Please try again.";
  }
};

/**
 * Summarizes the conversation history into meaningful context.
 * @param {Array} messages - An array of message-response pairs.
 * @returns {Promise<string>} - Summarized context.
 */

const summarizeChat = async (messages) => {
  if (!messages.length) return "";

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const history = messages
    .map(
      (msg, index) => `
Turn ${index + 1}:
User: ${msg.message}
Assistant: ${msg.response}
---`
    )
    .join("\n");

  const prompt = `
Summarize the following conversation into a concise context for reference in future interactions:

${history}

Ensure the summary:
1. Captures key details and resolved topics.
2. Notes ongoing or unresolved questions.
3. Groups related information into cohesive points.
4. Omits irrelevant or repetitive details.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error summarizing chat with Gemini:", error);
    return "";
  }
};

module.exports = { chat, summarizeChat };
