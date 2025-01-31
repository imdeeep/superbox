'use client';
import React, { useEffect, useState } from 'react';
import { Search, Trash, FileText, FileStack } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_URL } from '../constant/data';
import { useAuth } from '@/context/AuthContext';
import Dialog from '@/components/Dialog';
import ContextDialog from '@/components/ContextDialog';

interface Note {
  NoteId: string;
  NotesDescription: string;
  createdAt: string;
}

interface TempContext {
  _id: string;
  contextId: string;
  title: string;
  oldContext: string;
  refineContext: string;
  createdAt: string;
}

interface CardProps {
  item: Note | TempContext;
  type: 'note' | 'context';
  onDelete: (id: string) => void;
  onClick: () => void;
}

const Temp = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [contexts, setContexts] = useState<TempContext[]>([]);
  const [loadingNotes, setLoadingNotes] = useState<boolean>(true);
  const [loadingContexts, setLoadingContexts] = useState<boolean>(true);
  const [errorNotes, setErrorNotes] = useState<string | null>(null);
  const [errorContexts, setErrorContexts] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Note | TempContext | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch notes and contexts separately
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (user?._id) {
          const notesResponse = await axios.get(
            `${BASE_URL}api/v1/notes/${user._id}`
          );
          setNotes(notesResponse.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setErrorNotes(err.response.data.message || 'Failed to load notes.');
        } else {
          setErrorNotes('An unexpected error occurred while loading notes.');
        }
        console.error('Error fetching notes:', err);
      } finally {
        setLoadingNotes(false);
      }
    };

    const fetchContexts = async () => {
      try {
        if (user?._id) {
          const contextsResponse = await axios.get(
            `${BASE_URL}api/v1/context/tempcontexts/${user._id}`
          );
          setContexts(contextsResponse.data);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setErrorContexts(
            err.response.data.message || 'Failed to load contexts.'
          );
        } else {
          setErrorContexts(
            'An unexpected error occurred while loading contexts.'
          );
        }
        console.error('Error fetching contexts:', err);
      } finally {
        setLoadingContexts(false);
      }
    };

    fetchNotes();
    fetchContexts();
  }, [user?._id]);

  // Handle deletion of notes or contexts
  const handleDelete = async (id: string, type: 'note' | 'context') => {
    try {
      if (type === 'note') {
        await axios.delete(`${BASE_URL}api/v1/notes/delete/${id}`);
        setNotes((prev) => prev.filter((note) => note.NoteId !== id));
      } else {
        await axios.delete(`${BASE_URL}api/v1/context/delete/${id}`);
        setContexts((prev) => prev.filter((context) => context._id !== id));
      }

      // Clear selected item if it was deleted
      if (
        selectedItem &&
        ((type === 'note' && (selectedItem as Note).NoteId === id) ||
          (type === 'context' && (selectedItem as TempContext)._id === id))
      ) {
        setSelectedItem(null);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.message || `Failed to delete ${type}.`);
      } else {
        alert('An unexpected error occurred.');
      }
      console.error(`Error deleting ${type}:`, err);
    }
  };

  // Combine items for search

  return (
    <div className="px-10 mt-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl tracking-wide bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent inline-block">
          Temporary Data
        </h1>
        <div className="flex items-center border px-3 py-2 rounded-md border-tertiary/50 bg-[#161515]">
          <input
            type="text"
            className="bg-transparent text-white outline-none text-sm placeholder-gray-500 w-32 md:w-48"
            placeholder="Search notes and contexts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-wrap gap-6 py-2">
        {loadingNotes || loadingContexts ? (
          <div className="w-full text-center py-8">
            <p className="text-white">Loading...</p>
          </div>
        ) : (
          <>
            {/* Notes Section */}
            {errorNotes ? (
              <div className="w-full text-center py-8 text-red-500">
                Failed to load notes: {errorNotes}
              </div>
            ) : notes.length === 0 ? (
              <div className="w-full text-center py-8 text-gray-400">
                No notes found
              </div>
            ) : (
              notes
                .filter((note) =>
                  note.NotesDescription.toLowerCase().includes(
                    searchQuery.toLowerCase()
                  )
                )
                .map((note) => (
                  <Card
                    key={note.NoteId}
                    item={note}
                    type="note"
                    onDelete={(id) => handleDelete(id, 'note')}
                    onClick={() => setSelectedItem(note)}
                  />
                ))
            )}

            {/* Contexts Section */}
            {errorContexts ? (
              <div className="w-full text-center py-8 text-red-500">
                Failed to load contexts: {errorContexts}
              </div>
            ) : contexts.length === 0 ? (
              <div className="w-full text-center py-8 text-gray-400">
                No contexts found
              </div>
            ) : (
              contexts
                .filter((context) =>
                  context.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((context) => (
                  <Card
                    key={context._id}
                    item={context}
                    type="context"
                    onDelete={(id) => handleDelete(id, 'context')}
                    onClick={() => setSelectedItem(context)}
                  />
                ))
            )}
          </>
        )}
      </div>

      {/* Dialog for Selected Item */}
      <AnimatePresence>
        {selectedItem &&
          ('NoteId' in selectedItem ? (
            <Dialog note={selectedItem} onClose={() => setSelectedItem(null)} />
          ) : (
            <ContextDialog
              context={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          ))}
      </AnimatePresence>
    </div>
  );
};

// Card Component
const Card = ({ item, type, onDelete, onClick }: CardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(
      type === 'note' ? (item as Note).NoteId : (item as TempContext).contextId
    );
  };

  const description =
    type === 'note'
      ? (item as Note).NotesDescription
      : (item as TempContext).title;

  const createdAt =
    type === 'note'
      ? (item as Note).createdAt
      : (item as TempContext).createdAt;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={handleClick}
      className="bg-secondary/80 border border-tertiary/80 cursor-pointer w-full sm:w-[48%] md:w-[30%] lg:w-[24%] p-4 rounded-lg shadow-md"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between text-zinc-400">
          <div className="flex items-center space-x-2">
            {type === 'note' ? <FileText size={16} /> : <FileStack size={16} />}
            <h1 className="text-sm">{type === 'note' ? 'Note' : 'Context'}</h1>
          </div>
          <button
            className="hover:text-white transition-colors"
            onClick={handleDelete}
          >
            <Trash size={15} />
          </button>
        </div>
        <p className="text-sm text-white line-clamp-3">{description}</p>
        <p className="text-xs text-zinc-400">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

export default Temp;
