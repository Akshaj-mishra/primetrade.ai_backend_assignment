import { useState } from "react";
import { login, register } from "../services/api";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, role);
        setIsRegister(false);
      } else {
        await login(email, password);
        window.location.href = "/";
      }
    } catch {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 border rounded shadow"
      >
        <h2 className="text-xl font-bold mb-4">
          {isRegister ? "Register" : "Login"}
        </h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isRegister && (
          <select
            className="border p-2 w-full mb-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white w-full p-2 rounded hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
        </button>

        <p
          onClick={() => setIsRegister(!isRegister)}
          className="mt-3 text-sm text-indigo-500 cursor-pointer text-center"
        >
          {isRegister
            ? "Already have an account? Login"
            : "New here? Register"}
        </p>
      </form>
    </div>
  );
}
