const Chat = require('../models/chatSchema');
const { chat, summarizeChat } = require('../utils/Chat');

const continueChat = async (req, res) => {
    const { chatId, userId, message } = req.body;

    if (!userId || !message) {
        return res.status(400).json({ message: 'userId and message are required!' });
    }

    try {
        let chatThread = await Chat.findOne({ chatId, userId });
        let context = '';

        if (chatThread) {
            //last 10 messages for context
            const recentMessages = chatThread.messages.slice(-10); 
            // console.log(recentMessages)
            context = await summarizeChat(recentMessages); // Summarize the chat history
        }

        // Generate response with context
        const response = await chat(message, context);

        if (chatThread) {
            // Append to existing chat
            chatThread = await Chat.findOneAndUpdate(
                { chatId, userId },
                {
                    $push: { messages: { message, response } },
                },
                { new: true }
            );

            if (!chatThread) {
                return res.status(404).json({ message: 'Chat not found!' });
            }
        } else {
            // Create a new chat
            chatThread = new Chat({
                userId,
                messages: [{ message, response }],
            });

            await chatThread.save();
        }

        res.status(200).json(chatThread);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

const getChatById = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chatThread = await Chat.findOne({ chatId });

        if (!chatThread) {
            return res.status(404).json({ message: 'Chat not found!' });
        }

        res.status(200).json(chatThread);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

const getChatsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const chats = await Chat.find({ userId });
        res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

const deleteChat = async (req, res) => {
    const { chatId } = req.params;

    try {
        const deletedChat = await Chat.findOneAndDelete({ chatId });

        if (!deletedChat) {
            return res.status(404).json({ message: 'Chat not found!' });
        }

        res.status(200).json({ message: 'Chat deleted successfully!', chat: deletedChat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

module.exports = { continueChat, getChatById, getChatsByUserId, deleteChat };