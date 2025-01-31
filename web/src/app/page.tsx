'use client';
import React, { useState } from 'react';
import { MdArrowForward } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [question, setQuestion] = useState('');
  const router = useRouter();

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = () => {
    const trimmedQuestion = question.trim();
    if (trimmedQuestion) {
      router.push(`/chat?question=${encodeURIComponent(trimmedQuestion)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className="select-none">
        <div className="flex flex-col max-h-screen mt-5">
          <h1 className="text-6xl z-[2] tracking-wide text-center bg-gradient-to-r from-white py-5 to-secondary bg-clip-text text-transparent">
            Ask anything to Superbox
          </h1>

          <div className="w-full flex justify-center mt-5 relative">
            <div className="relative w-3/4 md:w-1/2">
              <textarea
                value={question}
                onChange={handleQuestionChange}
                onKeyDown={handleKeyPress}
                className="w-full h-64 bg-[#161515] border-2 border-tertiary/15 rounded-2xl outline-none p-4 pr-12 resize-none overflow-y-auto"
                placeholder="Dive into contextual insights — type your question here..."
              />
              <button
                onClick={handleSubmit}
                className={`
                  bg-secondary/40 absolute bottom-3 right-2 p-2 rounded-lg
                  ${!question.trim() ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                <MdArrowForward size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
