import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_Backend_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

//////////////////// AUTH ////////////////////

export const login = async (email: string, password: string) => {
  const res = await api.post("/login", { email, password });
  const token = res.data.access_token;
  localStorage.setItem("token", token);
  return token;
};

export const register = async (
  email: string,
  password: string,
  role: string = "user"
) => {
  const res = await api.post("/register", { email, password, role });
  return res.data;
};

//////////////////// NOTES ////////////////////

export const getNotes = async () => {
  const res = await api.get("/notes");
  return res.data;
};

export const createNote = async (note: any) => {
  const res = await api.post("/notes", note);
  return res.data;
};

export const updateNote = async (id: string, note: any) => {
  const res = await api.patch(`/notes/${id}`, note);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
};

//////////////////// ADMIN ////////////////////

export const getAllUsersNotes = async () => {
  const res = await api.get("/admin/all-notes");
  return res.data;
};

export default api;
