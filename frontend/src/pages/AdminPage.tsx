import React, { useState, useEffect } from 'react';
import { User, Note } from '../types';
import { getAllUsers, getAllNotes, deleteUser, deleteNote } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trash2, User as UserIcon, BookOpen } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const usersData = await getAllUsers(token);
      const notesData = await getAllNotes(token);
      setUsers(usersData.users || []);
      setNotes(notesData.notes || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleDeleteUser = async (userId: string) => {
    if (!token || !confirm('Are you sure you want to delete this user and all their notes?')) return;
    try {
      await deleteUser(userId, token);
      alert('User deleted successfully!');
      fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to delete user.');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!token || !confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(noteId, token);
      alert('Note deleted successfully!');
      fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to delete note.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 dark:text-red-400 text-lg my-8">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
      <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-8 text-center">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Users Section */}
        <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Manage Users ({users.length})
          </h2>
          {users.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No users found.</p>
          ) : (
            <ul className="space-y-3">
              {users.map((user) => (
                <li key={user.id} className="flex justify-between items-center bg-white dark:bg-gray-900 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{user.username} ({user.role})</span>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 transition-colors duration-200"
                    aria-label={`Delete user ${user.username}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Notes Section */}
        <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Manage All Notes ({notes.length})
          </h2>
          {notes.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No notes found across all users.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note.id} className="flex justify-between items-start bg-white dark:bg-gray-900 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium truncate w-64 md:w-auto">{note.title || '(No Title)'}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">by User: {users.find(u => u.id === note.userId)?.username || 'Unknown'}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 transition-colors duration-200 ml-2"
                    aria-label={`Delete note ${note.title}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
