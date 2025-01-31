import React, { useEffect, useState } from 'react';
import { Copy, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Context {
  _id: string;
  title: string;
  refineContext: string;
  oldContext?: string;
  createdAt: string;
}

interface ContextDialogProps {
  context: Context;
  onClose: () => void;
}

const ContextDialog = ({ context, onClose }: ContextDialogProps) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        context.refineContext || context.oldContext || ''
      );
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Markdown customization with strict types
  const components: Partial<Components> = {
    h1: ({ ...props }) => (
      <h1 className="text-2xl font-bold mb-4 text-white" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-xl font-semibold mt-6 mb-3 text-white" {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className="text-lg font-medium mt-4 mb-2 text-white" {...props} />
    ),
    p: ({ ...props }) => (
      <p className="mb-4 text-gray-300 leading-relaxed" {...props} />
    ),
    a: ({ ...props }) => (
      <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
    ),
    ul: ({ ...props }) => (
      <ul className="list-disc pl-6 mb-4 text-gray-300" {...props} />
    ),
    li: ({ ...props }) => <li className="mb-2" {...props} />,
    strong: ({ ...props }) => (
      <strong className="font-semibold text-white" {...props} />
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/65 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#232325] border border-tertiary/80 rounded-lg w-full max-w-4xl min-h-[550px] h-[85vh] relative"
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-white font-semibold">
              {context.title}
            </h2>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="p-2.5 hover:bg-tertiary/20 rounded-full transition-colors"
                title="Copy context"
              >
                <Copy
                  size={22}
                  className={`transition-colors ${
                    copySuccess ? 'text-green-500' : 'text-zinc-400'
                  }`}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2.5 hover:bg-tertiary/20 rounded-full transition-colors"
                title="Close"
              >
                <X size={22} className="text-zinc-400" />
              </motion.button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 pr-4 scrollbar-thin scrollbar-thumb-tertiary/20 scrollbar-track-transparent">
            <div className="text-white text-lg">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={components}
                >
                  {context.refineContext}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-tertiary/20 text-sm text-zinc-400">
            Created on {new Date(context.createdAt).toLocaleDateString()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContextDialog;
