'use client';
import React from 'react';
import { BiPlus, BiSolidDockLeft } from 'react-icons/bi';
import Link from 'next/link';
import { useState, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { MdDelete, MdErrorOutline } from 'react-icons/md';
import { Loader2, SendHorizontal } from 'lucide-react';
import { BASE_URL } from '@/constant/data';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { formatResponse } from '@/utils/chatFormatter';

interface ChatItem {
  chatId?: string;
  _id?: string;
  userId: string;
  messages: {
    message: string;
    response: string;
    _id?: string;
    timestamp?: Date;
  }[];
  createdAt?: string;
}

interface Message {
  id?: string;
  type: 'sender' | 'receiver';
  text: string;
  avatar?: string;
  timestamp?: Date;
}

const DynamicPage = () => {
  const searchParams = useSearchParams();
  const question = searchParams.get('question') || '';
  const decodedQuestion = decodeURIComponent(question);

  const { user } = useAuth();
  const [state, setState] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'receiver',
      text: "Hello! I'm Superbox AI. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState(decodedQuestion);

  // Refs for controlling message flow
  const initialMessageSent = React.useRef(false);
  const isProcessing = React.useRef(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Loading states
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Error states
  const [chatError, setChatError] = useState<string | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history
  const fetchChatHistory = async () => {
    if (!user?.userId) {
      window.alert('Please login to continue');
      return;
    }

    setIsLoadingChats(true);
    setChatError(null);

    try {
      const response = await axios.get(
        `${BASE_URL}api/v1/chat/user/${user.userId}`
      );
      setChatHistory(
        response.data.sort(
          (a: ChatItem, b: ChatItem) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
      );
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setChatError('Failed to load chat history');
      window.alert('Failed to load chat history. Please try again.');
    } finally {
      setIsLoadingChats(false);
    }
  };

  // Fetch specific chat
  const fetchChat = async (chatId: string) => {
    if (isProcessing.current) return;

    setIsLoadingMessages(true);
    setChatError(null);
    isProcessing.current = true;

    try {
      const response = await axios.get(`${BASE_URL}api/v1/chat/${chatId}`);
      const chatData = response.data;

      const formattedMessages = [
        messages[0],
        ...chatData.messages.flatMap(
          (msg: { message: string; timestamp: string; response: string }) => [
            {
              type: 'sender',
              text: msg.message,
              timestamp: msg.timestamp,
            },
            {
              type: 'receiver',
              text: msg.response,
              timestamp: msg.timestamp,
            },
          ]
        ),
      ];

      setMessages(formattedMessages);
      setSelectedChat(chatId);
    } catch (error) {
      console.error('Error fetching chat:', error);
      setChatError('Failed to load chat');
      window.alert('Failed to load chat. Please try again.');
    } finally {
      setIsLoadingMessages(false);
      isProcessing.current = false;
    }
  };

  //continue chat
  const sendMessage = async () => {
    if (!inputMessage.trim() || !user?.userId || isProcessing.current) return;

    setIsSendingMessage(true);
    isProcessing.current = true;

    const currentInput = inputMessage.trim();
    const newMessage = {
      type: 'sender' as const,
      text: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    try {
      const response = await axios.post(`${BASE_URL}api/v1/chat`, {
        chatId: selectedChat,
        userId: user.userId,
        message: currentInput,
      });

      const aiResponse = {
        type: 'receiver' as const,
        text: response.data.messages[response.data.messages.length - 1]
          .response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);

      if (!selectedChat) {
        setSelectedChat(response.data.chatId);
        await fetchChatHistory();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      window.alert('Failed to send message. Please try again.');
      // Remove the failed message
      setMessages((prev) => prev.slice(0, -1));
      setInputMessage(currentInput);
    } finally {
      setIsSendingMessage(false);
      isProcessing.current = false;
    }
  };

  // Delete chat
  const handleDeleteChat = async (chatId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;

    try {
      await axios.delete(`${BASE_URL}api/v1/chat/${chatId}`);
      if (selectedChat === chatId) {
        setSelectedChat(null);
        setMessages([messages[0]]);
      }
      await fetchChatHistory();
    } catch (error) {
      console.error('Error deleting chat:', error);
      window.alert('Failed to delete chat. Please try again.');
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    setSelectedChat(null);
    setMessages([messages[0]]);
    setInputMessage('');
  };

  // Handle enter key press
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isProcessing.current) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Initial load
  useEffect(() => {
    fetchChatHistory();
  }, [user?.userId]);

  // Handle initial question
  useEffect(() => {
    if (decodedQuestion && !initialMessageSent.current) {
      initialMessageSent.current = true;
      sendMessage();
    }
  }, [decodedQuestion]);

  return (
    <div className="fixed inset-0 flex overflow-hidden z-10">
      {/* Left Sidebar */}
      <motion.div
        className="h-full bg-primary border-r border-tertiary/15 flex flex-col"
        initial={{ width: '25%' }}
        animate={{ width: state ? '25%' : '0%' }}
        exit={{ width: '0%' }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25,
        }}
        layout
      >
        <div className="px-2 flex items-center justify-between">
          <button onClick={() => setState(!state)}>
            <BiSolidDockLeft size={24} className="rotate-180" />
          </button>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 bg-secondary/50 px-2 py-1 my-1 rounded-lg hover:bg-secondary transition-all"
          >
            <BiPlus size={20} />
            <span className="text-sm">New Chat</span>
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-grow overflow-y-auto no-scrollbar">
          {isLoadingChats ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : chatError ? (
            <div className="bg-red-100 text-red-800 p-2 m-2 rounded">
              <p className="font-bold flex items-center">
                <MdErrorOutline className="mr-2" /> Error
              </p>
              <p>{chatError}</p>
            </div>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.chatId}
                onClick={() => fetchChat(chat.chatId!)}
                className={`
                  px-3 py-2 cursor-pointer flex justify-between items-center mx-2 my-1
                  ${
                    selectedChat === chat.chatId
                      ? 'bg-secondary rounded-lg'
                      : 'hover:bg-secondary/30 rounded-lg'
                  }
                `}
              >
                <div className="flex flex-col">
                  <p className="text-sm truncate max-w-[180px]">
                    {chat.messages[0]?.message || 'New Chat'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(chat.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.chatId!);
                  }}
                  className="hover:bg-red-500/20 rounded-full p-1"
                >
                  <MdDelete size={16} className="text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        className="h-full bg-[#161515] relative flex flex-col"
        initial={{ width: '75%' }}
        animate={{ width: state ? '75%' : '100%' }}
        exit={{ width: '100%' }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25,
        }}
        layout
      >
        {/* Header */}
        <div className="flex items-center px-2 pt-1 justify-between">
          <div className="flex items-center gap-2">
            {!state ? (
              <button onClick={() => setState(!state)}>
                <BiSolidDockLeft size={24} />
              </button>
            ) : null}
            <Link
              href="/"
              className={`bg-primary px-1 text-sm rounded border-2 border-tertiary/15`}
            >
              Back
            </Link>
          </div>
          <p className="text-zinc-400 hover:text-white transition-all select-none">
            superbox
          </p>
        </div>

        {/* Main Content Area - Chat Messages */}
        <div className="flex-grow bg-primary border-2 border-tertiary/15 rounded-2xl m-1 overflow-y-auto p-4 space-y-4">
          {isLoadingMessages ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : chatError ? (
            <div className="bg-red-100 text-red-800 p-2 rounded">
              <p className="font-bold flex items-center">
                <MdErrorOutline className="mr-2" /> Error
              </p>
              <p>{chatError}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p>No chat history available.</p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'sender' ? 'justify-end' : 'items-start'} space-x-3`}
                >
                  {message.type === 'receiver' && (
                    <img
                      src="/logo.png"
                      className="w-10 h-10 border border-tertiary/25 rounded-full flex-shrink-0"
                      alt=""
                    />
                  )}

                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[70%] ${
                      message.type === 'receiver'
                        ? 'bg-secondary/25 text-white'
                        : 'bg-secondary text-white'
                    }`}
                  >
                    <div className="ai-response-content">
                      {formatResponse(message.text)}
                    </div>
                    <span className="text-xs select-none text-gray-400 mt-1">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Area */}
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: state ? '100%' : '100%' }}
          exit={{ width: '100%' }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 25,
          }}
          layout
          className="relative flex justify-center"
        >
          <div className="relative w-full px-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSendingMessage}
              className="w-full h-24 bg-primary border-2 border-tertiary/15 rounded-2xl outline-none p-4 pr-12 resize-none disabled:opacity-50"
              placeholder="Type your question here..."
            />
            <button
              onClick={sendMessage}
              disabled={isSendingMessage || !inputMessage.trim()}
              className="absolute bottom-4 right-3 bg-secondary/40 p-2 rounded-lg disabled:opacity-50"
            >
              {isSendingMessage ? (
                <Loader2 className="animate-spin" />
              ) : (
                <SendHorizontal size={22} />
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DynamicPage;
