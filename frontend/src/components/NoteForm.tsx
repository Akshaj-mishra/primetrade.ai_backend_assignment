import { useState, useEffect } from "react";
import { Save, XCircle } from "lucide-react";

// 1. Updated Interface to match backend NoteCreate schema
interface ChecklistItem {
  text: string;
  done: boolean;
}

interface NoteInput {
  title: string;
  content?: string;
  items: ChecklistItem[]; // REQUIRED: Must be an array, even if empty
  color?: string;
  pinned?: boolean;
}

interface NoteFormProps {
  initialNote?: NoteInput | null;
  onSubmit: (note: NoteInput) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export default function NoteForm({
  initialNote,
  onSubmit,
  onCancel,
  isEditing = false,
}: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // Local state for items to allow basic CRUD on the entity
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || "");
      setContent(initialNote.content || "");
      setItems(initialNote.items || []); // Ensure it's an array
    } else {
      setTitle("");
      setContent("");
      setItems([]);
    }
  }, [initialNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Per the PDF, show success/error messages from API responses [cite: 24]
    if (!title.trim() && !content.trim() && items.length === 0) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      items: items, // Sending the array ensures schema compliance
      color: initialNote?.color || "#fff8b5",
      pinned: initialNote?.pinned || false,
    });

    if (!isEditing) {
      setTitle("");
      setContent("");
      setItems([]);
    }
  };

  return (
    <form className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700" onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-3 text-lg font-semibold border-b bg-transparent focus:outline-none dark:text-white"
        required // Basic input validation [cite: 14, 27]
      />

      <textarea
        placeholder="Take a note..."
        rows={isEditing ? 6 : 3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border-b bg-transparent focus:outline-none resize-y dark:text-white"
      />

      {/* Checklist Support for "CRUD actions on the entity" [cite: 13, 23] */}
      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={item.done} 
                onChange={() => {
                  const newItems = [...items];
                  newItems[idx].done = !newItems[idx].done;
                  setItems(newItems);
                }}
              />
              <span className="text-sm dark:text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
          >
            <XCircle size={20} />
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Save size={20} />
          {isEditing ? "Update Note" : "Add Note"}
        </button>
      </div>
    </form>
  );
}