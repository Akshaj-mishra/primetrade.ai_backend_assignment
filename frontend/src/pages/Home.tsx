import { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote } from "../services/api";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import LoadingSpinner from "../components/LoadingSpinner";

interface Note {
  id: string;
  title: string;
  content?: string;
  color: string;
  pinned: boolean;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreate = async (note: any) => {
    await createNote(note);
    loadNotes();
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    loadNotes();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <NoteForm onCreate={handleCreate} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={() => handleDelete(note.id)}
          />
        ))}
      </div>

      {notes.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No notes yet. Create your first note ✨
        </p>
      )}
    </div>
  );
}
