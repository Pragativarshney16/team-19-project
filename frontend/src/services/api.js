const API = "http://localhost:5000/api";

async function request(path, opts = {}) {
  const token = localStorage.getItem("token");
  const headers = opts.headers || {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API + path, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(()=>({msg:"error"}));
    throw new Error(err.msg || "API error");
  }
  return res.json();
}

export const signup = (u) => request("/auth/signup", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(u) });
export const login = (u) => request("/auth/login", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(u) });

export const createSession = (name) => request("/sessions", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name }) });
export const getSession = (id) => request(`/sessions/${id}`);
export const listSessions = () => request("/sessions");
export const saveSession = (id, canvasData) => request(`/sessions/${id}`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ canvasData }) });