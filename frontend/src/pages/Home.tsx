import { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote } from "../services/api";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import LoadingSpinner from "../components/LoadingSpinner";

// 1. Define the child item interface to match schemas.py
interface ChecklistItem {
  text: string;
  done: boolean;
}

// 2. Updated Note interface (added items)
interface Note {
  id: string;
  title: string;
  content?: string;
  items: ChecklistItem[]; // Required to match backend
  color: string;
  pinned: boolean;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError("Failed to fetch notes. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // 3. Ensure note object matches NoteCreate schema
  const handleCreate = async (note: any) => {
    try {
      await createNote(note);
      loadNotes();
    } catch (err) {
      console.error("Failed to create note. Ensure 'items' is an array.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      loadNotes();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* 4. Fix: Use onSubmit prop, not onCreate */}
      <div className="mb-10">
        <NoteForm onSubmit={handleCreate} />
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-900">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={() => handleDelete(note.id)}
          />
        ))}
      </div>

      {notes.length === 0 && !error && (
        <div className="text-center mt-20">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No notes yet. Create your first note ✨
          </p>
        </div>
      )}
    </div>
  );
}