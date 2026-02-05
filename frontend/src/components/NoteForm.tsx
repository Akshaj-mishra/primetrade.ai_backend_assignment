import { useState, useEffect } from "react";
import { Save, XCircle } from "lucide-react";

interface NoteInput {
  title: string;
  content?: string;
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

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || "");
      setContent(initialNote.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [initialNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() && !content.trim()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      color: initialNote?.color || "#fff8b5",
      pinned: initialNote?.pinned || false,
    });

    if (!isEditing) {
      setTitle("");
      setContent("");
    }
  };

  return (
    <form className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700" onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-3 text-lg font-semibold border-b bg-transparent focus:outline-none"
      />

      <textarea
        placeholder="Take a note..."
        rows={isEditing ? 6 : 3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border-b bg-transparent focus:outline-none resize-y"
      />

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
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
