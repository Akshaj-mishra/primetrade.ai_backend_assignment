import { useEffect, useState } from "react";
import { getAllUsersNotes, deleteNote } from "../services/api";

export default function AdminPage() {
  const [notes, setNotes] = useState<any[]>([]);

  const load = async () => {
    const data = await getAllUsersNotes();
    setNotes(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All User Notes (Admin)</h2>

      {notes.map((n) => (
        <div key={n.id} className="border p-2 mb-2">
          <span>{n.title}</span>
          <button
            onClick={() => {
              deleteNote(n.id);
              load();
            }}
            className="ml-4 text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
