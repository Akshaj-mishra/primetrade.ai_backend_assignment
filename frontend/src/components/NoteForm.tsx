import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Save, XCircle } from 'lucide-react';

interface NoteFormProps {
  initialNote?: Note | null;
  onSubmit: (note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ initialNote, onSubmit, onCancel, isEditing = false }) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [initialNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return; // Don't submit empty notes
    onSubmit({ title: title.trim(), content: content.trim() });
    if (!isEditing) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-3 text-lg font-semibold border-b border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
      />
      <textarea
        placeholder="Take a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={isEditing ? 6 : 3}
        className="w-full p-3 text-base border-b border-gray-300 dark:border-gray-600 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 resize-y"
      ></textarea>
      <div className="flex justify-end space-x-2 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors duration-200"
          >
            <XCircle className="h-5 w-5" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
        >
          <Save className="h-5 w-5" />
          {isEditing ? 'Update Note' : 'Add Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
