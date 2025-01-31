const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const generate = async ( words = "") => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
    const prompt = `
  Create a meaningfull Title from this 10 words
  ${words}`;
  
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error generating response with Gemini:", error);
      return "I apologize, but I encountered an error processing your request. Please try again.";
    }
  };
  
const generateTitle = (content) => {
    const words = content.split(' ').slice(0, 10).join(' ');
    const title = generate(words)
    return title;
};

module.exports = { generateTitle };