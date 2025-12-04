import { useEffect, useState } from "react";
import Whiteboard from "./components/Whiteboard";
import Toolbar from "./components/Toolbar";
import Chat from "./components/Chat";
import Participants from "./components/Participants";
import * as api from "./services/api";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [sessionId, setSessionId] = useState(null);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);
  const [addTextMode, setAddTextMode] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [joinInput, setJoinInput] = useState("");

  useEffect(()=> { if (token) loadSessions(); }, [token]);

  async function loadSessions() {
    try {
      const s = await api.listSessions();
      setSessions(s);
    } catch (err) { console.error(err); }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const data = await api.signup({ username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      loadSessions();
    } catch (err) { alert(err.message); }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const data = await api.login({ username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      loadSessions();
    } catch (err) { alert(err.message); }
  }

  async function createNewSession() {
    try {
      const s = await api.createSession("Exam Whiteboard");
      setSessionId(s._id);
    } catch (err) { alert(err.message); }
  }

  function joinById(id) {
    if (!id) { alert("Enter session id"); return; }
    setSessionId(id);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); setToken(null);
  }

  return (
    <div className="p-6">
      {!user ? (
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Sign up / Login</h1>
          <form onSubmit={handleSignup} className="mb-4 space-y-2">
            <input name="username" placeholder="username" className="border p-2 w-full" />
            <input name="password" type="password" placeholder="password" className="border p-2 w-full" />
            <button className="px-4 py-2 bg-green-500 text-white">Sign up</button>
          </form>
          <form onSubmit={handleLogin}>
            <input name="username" placeholder="username" className="border p-2 w-full mb-2" />
            <input name="password" type="password" placeholder="password" className="border p-2 w-full mb-2" />
            <button className="px-4 py-2 bg-blue-500 text-white">Login</button>
          </form>
        </div>
      ) : !sessionId ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <strong>{user.username}</strong> <small className="text-gray-500">({user.role})</small>
            </div>
            <div>
              <button className="px-3 py-1 bg-red-400 text-white mr-2" onClick={logout}>Logout</button>
              <button className="px-3 py-1 bg-green-500 text-white" onClick={createNewSession}>New Session</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="font-bold mb-2">Available Sessions</h2>
              <ul className="space-y-2">
                {sessions.map(s => (
                  <li key={s._id} className="p-2 border rounded flex justify-between">
                    <div>{s.name}</div>
                    <div>
                      <button className="px-2 py-1 bg-blue-500 text-white" onClick={() => joinById(s._id)}>Join</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-bold mb-2">Join by ID</h2>
              <div className="flex gap-2">
                <input className="border p-2 flex-1" placeholder="session id" value={joinInput} onChange={(e)=>setJoinInput(e.target.value)} />
                <button className="px-3 py-1 bg-indigo-600 text-white" onClick={() => joinById(joinInput)}>Join</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <strong>Session:</strong> <span className="font-mono">{sessionId}</span>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-gray-200" onClick={() => { navigator.clipboard?.writeText(sessionId); alert("Copied session id"); }}>Copy ID</button>
              <button className="px-2 py-1 bg-red-300" onClick={() => { setSessionId(null); }}>Leave</button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Toolbar tool={tool} setTool={setTool} color={color} setColor={setColor} size={size} setSize={setSize} addTextMode={addTextMode} setAddTextMode={setAddTextMode} />
              <Whiteboard sessionId={sessionId} user={user} tool={tool} color={color} size={size} addTextMode={addTextMode} />
            </div>

            <div className="w-80 space-y-4">
              <Chat sessionId={sessionId} currentUser={user} />
              <Participants sessionId={sessionId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
