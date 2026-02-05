import React from 'react';
import { Note } from '../types';
import { Trash2, Edit } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{note.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap">{note.content}</p>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit(note)}
          className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Edit note"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Delete note"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
