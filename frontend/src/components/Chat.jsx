import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

export default function Chat({ sessionId, currentUser }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("joinSession", { sessionId, user: currentUser });
    socket.on("chat", (payload) => {
      setMessages(prev => [...prev, payload]);
    });
    return () => {
      socket.off("chat");
    };
  }, [sessionId]);

  const send = () => {
    if (!msg) return;
    socket.emit("chat", { sessionId, message: msg });
    setMessages(prev => [...prev, { message: msg, user: currentUser }]);
    setMsg("");
  };

  return (
    <div className="border p-3 w-72 flex flex-col">
      <div className="font-bold mb-2">Chat</div>
      <div className="flex-1 overflow-y-auto mb-2 h-48 bg-gray-100 p-2">
        {messages.map((m, i) => (
          <div key={i} className="mb-1">
            <strong>{m.user?.username || "Anon"}:</strong> <span>{m.message}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border p-1" value={msg} onChange={(e)=>setMsg(e.target.value)} />
        <button className="px-3 bg-blue-500 text-white" onClick={send}>Send</button>
      </div>
    </div>
  );
}
