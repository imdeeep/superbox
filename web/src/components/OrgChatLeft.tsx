import React, { useState } from 'react';
import { BiSolidDockLeft } from 'react-icons/bi';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import formatResponse from '@/utils/chatFormatter';

interface Context {
  _id: string;
  title: string;
  refineContext: string;
  createdAt: string;
}

interface QueryParams {
  id?: string;
  name?: string;
  orgId?: string;
}

interface OrgChatLeftProps {
  setState: (state: boolean) => void;
  contexts: Context[];
  queryParams: QueryParams;
}

const OrgChatLeft: React.FC<OrgChatLeftProps> = ({
  setState,
  contexts,
  queryParams,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full bg-primary"
    >
      <div className="px-2 py-1 flex items-center justify-between border-b border-tertiary/15">
        <button
          onClick={() => setState(false)}
          className="hover:bg-secondary/25 p-1 rounded-lg transition-colors"
        >
          <BiSolidDockLeft size={24} className="rotate-180" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-tertiary/15"
      >
        <h1 className="text-3xl font-semibold text-white">
          {queryParams?.name || 'Organization'}
        </h1>
      </motion.div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="relative p-4">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-zinc-500 via-zinc-800 to-primary"
          />

          {contexts.map((context, index) => (
            <motion.div
              key={context._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative mb-8 pl-16 group"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * 0.15,
                  type: 'spring',
                  stiffness: 200,
                }}
                className="absolute left-7 w-3 h-3 rounded-full bg-gradient-to-r from-zinc-500 to-zinc-800 transform -translate-x-1/2 transition-transform duration-300"
              >
                <div className="absolute w-full h-full rounded-full animate-ping bg-purple-500/30" />
              </motion.div>

              <motion.div
                onClick={() => toggleExpand(context._id)}
                className="cursor-pointer"
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <div className="bg-gradient-to-r from-secondary/20 to-secondary/30 rounded-lg p-4 backdrop-blur-sm border border-white/5 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {context.title?.replace(/\*\*/g, '') ||
                          'Untitled Context'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {formatDate(context.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={(e) =>
                          handleCopy(context.refineContext, context._id, e)
                        }
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        title="Copy content"
                      >
                        {copiedId === context._id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </motion.button>

                      <motion.div
                        animate={{
                          rotate: expandedId === context._id ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === context._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="text-sm text-gray-300 whitespace-pre-wrap">
                            {formatResponse(context.refineContext)}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OrgChatLeft;
