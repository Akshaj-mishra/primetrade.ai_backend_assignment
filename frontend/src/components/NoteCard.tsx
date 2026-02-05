import { Trash2, Edit } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content?: string;
  color: string;
  pinned: boolean;
}

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <div
      className="rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
      style={{ backgroundColor: note.color || "#ffffff" }}
    >
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-900">
          {note.title}
        </h3>

        {note.content && (
          <p className="text-gray-700 text-sm whitespace-pre-wrap">
            {note.content}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        {onEdit && (
          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            <Edit size={20} />
          </button>
        )}

        <button
          onClick={() => onDelete(note.id)}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
