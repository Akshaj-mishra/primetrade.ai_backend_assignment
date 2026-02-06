import { Trash2, Edit, CheckSquare, Square } from "lucide-react";


interface ChecklistItem {
  text: string;
  done: boolean;
}

interface Note {
  id: string; 
  title: string;
  content?: string;
  items: ChecklistItem[];
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
      style={{ backgroundColor: note.color || "#fff8b5" }} 
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">
            {note.title}
          </h3>
          {note.pinned && (
             <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
               Pinned
             </span>
          )}
        </div>

        
        {note.content && (
          <p className="text-gray-700 text-sm whitespace-pre-wrap mb-3 leading-relaxed">
            {note.content}
          </p>
        )}

       
        {note.items && note.items.length > 0 && (
          <div className="space-y-1.5 mt-2">
            {note.items.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                {item.done ? (
                  <CheckSquare size={16} className="text-green-600" />
                ) : (
                  <Square size={16} className="text-gray-400" />
                )}
                <span className={item.done ? "line-through text-gray-400" : ""}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-5 border-t border-black/5 pt-3">
        {onEdit && (
          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-full text-gray-600 hover:bg-black/5 transition-colors"
            title="Edit Note"
          >
            <Edit size={18} />
          </button>
        )}

        <button
          onClick={() => onDelete(note.id)}
          className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
          title="Delete Note"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}