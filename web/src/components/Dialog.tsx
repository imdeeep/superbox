import React, { useEffect, useState } from 'react';
import { Copy, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Note {
  NoteId: string;
  NotesDescription: string;
  createdAt: string;
}

interface DialogProps {
  note: Note;
  onClose: () => void;
}

const Dialog = ({ note, onClose }: DialogProps) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.NotesDescription);
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
            <h2 className="text-2xl text-white font-semibold">Note Details</h2>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="p-2.5 hover:bg-tertiary/20 rounded-full transition-colors"
                title="Copy note"
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
            <p className="text-white text-lg whitespace-pre-wrap leading-relaxed">
              {note.NotesDescription}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-tertiary/20 text-sm text-zinc-400">
            Created on {new Date(note.createdAt).toLocaleDateString()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dialog;
