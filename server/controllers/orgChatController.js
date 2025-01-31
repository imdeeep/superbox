const OrgChat = require("../models/orgChat");
const Organisation = require("../models/orgModel");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

async function refineContext(combinedContext) {
  // console.log('Refining context:', combinedContext);
  try {
    const prompt = `Summarize and refine the following context into a concise, coherent form while preserving key information:\n\n${combinedContext}`;
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: process.env.GOOGLE_GEMINI_API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error refining context:", error);
    throw new Error("Failed to refine context");
  }
}

async function generateAIResponse(userMessage, refinedContext) {
  try {
    const prompt = `You are a helpful AI assistant called "SUPERBOX". Follow these rules strictly:
1. If the question relates to the context, combine context information with your general knowledge to provide a comprehensive answer.
2. If the question is unrelated to the context, ignore the context entirely and provide a complete, helpful answer using only your general knowledge.
3. Never mention the context, its limitations, or whether it was used.
4. Always provide a complete, natural, and helpful response.

Context (for reference only):
${refinedContext}

Question:
${userMessage}

Answer:`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: process.env.GOOGLE_GEMINI_API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}

// Continue an existing chat or create a new chat
const continueOrgChat = async (req, res) => {
  try {
    const { orgId, chatId, message, userId } = req.body;

    if (!message || !userId) {
      return res
        .status(400)
        .json({ message: "Message and userId are required" });
    }

    let chat;

    if (chatId) {
      // Continue existing chat
      chat = await OrgChat.findOne({ chatId });
      if (!chat) return res.status(404).json({ message: "Chat not found" });

      const org = await Organisation.findOne({ OrgId: orgId }).populate(
        "contexts"
      );
      // console.log(org)
      if (!org)
        return res.status(404).json({ message: "Organization not found" });

      const combinedContext = org.contexts
        .filter((c) => c.refineContext) // Remove empty contexts
        .map((c) => c.refineContext)
        .join(" ");

    //   console.log(combinedContext);
      const refinedContext = await refineContext(combinedContext);

      const aiResponse = await generateAIResponse(message, refinedContext);

      chat.messages.push({ sender: userId, message, response: aiResponse });
      await chat.save();

      return res.status(200).json(chat);
    } else {
      // New chat creation
      if (!orgId) {
        return res
          .status(400)
          .json({ message: "orgId is required for new chat" });
      }

      const org = await Organisation.findOne({ OrgId: orgId }).populate(
        "contexts"
      );
      // console.log(org)
      if (!org)
        return res.status(404).json({ message: "Organization not found" });

      // Get the first context ID if available
      const contextId = org.contexts.length > 0 ? org.contexts[0]._id : null;

      const combinedContext = org.contexts
        .filter((c) => c.refineContext) // Remove empty contexts
        .map((c) => c.refineContext)
        .join(" ");

    //   console.log(combinedContext);
      const refinedContext = await refineContext(combinedContext);
      const aiResponse = await generateAIResponse(message, refinedContext);

      const newChat = new OrgChat({
        chatId: uuidv4(),
        orgId: orgId, // Using the UUID directly
        contextId: contextId, // Using the first context's ObjectId
        messages: [{ sender: userId, message, response: aiResponse }],
      });

      await newChat.save();
      return res.status(201).json(newChat);
    }
  } catch (error) {
    console.error("Error in continueOrgChat:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all chats by orgId (UUID)
const getChatByOrg = async (req, res) => {
  try {
    const orgId = req.params.orgId;

    const chats = await OrgChat.find({ orgId })
      .sort({ createdAt: -1 })
      .populate({
        path: "orgId",
        select: "OrgName",
        match: { OrgId: orgId }, // Ensure we're populating the correct org
      });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getChatByOrg:", error);
    res.status(500).json({
      message: "Error retrieving chats",
    });
  }
};

module.exports = {
  continueOrgChat,
  getChatByOrg,
};
