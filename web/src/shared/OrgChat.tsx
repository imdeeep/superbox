'use client';
import { BiSolidDockLeft } from 'react-icons/bi';
import Link from 'next/link';
import {
  useState,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  useRef,
} from 'react';
import { motion } from 'framer-motion';
import { Loader2, SendHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '@/constant/data';
import { formatResponse } from '@/utils/chatFormatter';
import { useAuth } from '@/context/AuthContext';
import OrgChatLeft from '@/components/OrgChatLeft';

interface Message {
  sender: string;
  message: string;
  response: string;
  timestamp: string;
  _id: string;
}

interface ChatHistory {
  _id: string;
  chatId: string;
  orgId: string;
  contextId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const OrgChat = () => {
  const { user } = useAuth();
  const [state, setState] = useState(true);
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState<{
    id?: string;
    name?: string;
    orgId?: string;
  }>({});
  interface Context {
    id: string;
    name: string;
    _id: string;
    title: string;
    refineContext: string;
    createdAt: string;
  }

  const [contexts, setContexts] = useState<Context[]>([]);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNewChat, setIsLoadingNewChat] = useState(false);

  // Refs for message handling
  const isProcessing = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const orgId = searchParams.get('orgId');

    if (id && name && orgId) {
      setQueryParams({ id, name, orgId });
    }
  }, [searchParams]);

  // Fetch contexts
  useEffect(() => {
    const fetchOrgContexts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/v1/context/contexts`, {
          params: { orgId: queryParams.id },
        });
        setContexts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (queryParams.id) {
      fetchOrgContexts();
    }
  }, [queryParams.id]);

  // Fetch chat history
  useEffect(() => {
    const fetchOrgChat = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_URL}api/v1/orgChat/${queryParams.orgId}`
        );
        const allMessages = response.data.flatMap(
          (chat: ChatHistory) => chat.messages
        );
        // Sort messages by timestamp in ascending order
        const sortedMessages = allMessages.sort(
          (a: Message, b: Message) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setChatHistory(sortedMessages);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (queryParams.orgId) {
      fetchOrgChat();
    }
  }, [queryParams.orgId]);

  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || isProcessing.current) return;

    setIsLoadingNewChat(true);
    isProcessing.current = true;

    try {
      const response = await axios.post(`${BASE_URL}api/v1/orgChat/`, {
        orgId: queryParams.orgId,
        message: trimmedMessage,
        userId: user?._id,
      });

      // Add the new message and response to the chat history
      const newMessage =
        response.data.messages[response.data.messages.length - 1];
      setChatHistory((prev) => [...prev, newMessage]);
      setInputMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoadingNewChat(false);
      isProcessing.current = false;
    }
  }, [inputMessage, queryParams.orgId, user?._id]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden z-10">
      {/* Left Sidebar */}
      <motion.div
        className="h-full bg-primary border-r border-tertiary/15 flex flex-col overflow-y-auto"
        initial={{ width: '55%' }}
        animate={{ width: state ? '55%' : '0%' }}
        exit={{ width: '0%' }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25,
        }}
        layout
      >
        <OrgChatLeft
          setState={setState}
          contexts={contexts}
          queryParams={queryParams}
        />
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        className="h-full bg-[#161515] relative flex flex-col"
        initial={{ width: '45%' }}
        animate={{ width: state ? '45%' : '100%' }}
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
            {!state && (
              <button onClick={() => setState(!state)}>
                <BiSolidDockLeft size={24} />
              </button>
            )}
            <Link
              href="/organisations"
              className="bg-primary px-1 text-sm rounded border-2 border-tertiary/15"
            >
              Back
            </Link>
          </div>
          <p className="text-zinc-400 hover:text-white transition-all select-none">
            superbox
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow bg-primary border-2 border-tertiary/15 rounded-2xl m-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            chatHistory.map((message) => (
              <div key={message._id} className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end space-x-3">
                  <div className="flex flex-col items-end">
                    <div className="bg-secondary text-white rounded-2xl px-4 py-2 max-w-[70%]">
                      <p>{message.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start space-x-3">
                  <img
                    src="/logo.png"
                    className="w-10 h-10 border border-tertiary/25 rounded-full flex-shrink-0"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <div className="bg-secondary/25 text-white rounded-2xl px-4 py-2 max-w-[70%]">
                      <div className="ai-response-content">
                        {formatResponse(message.response)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '100%' }}
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
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setInputMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="w-full h-24 bg-primary border-2 border-tertiary/15 rounded-2xl outline-none p-4 pr-12 resize-none disabled:opacity-50"
              placeholder="Continue the conversation..."
              disabled={isLoadingNewChat}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoadingNewChat || !inputMessage.trim()}
              className="absolute bottom-4 right-3 bg-secondary/40 p-2 rounded-lg disabled:opacity-50"
            >
              {isLoadingNewChat ? (
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

export default OrgChat;
