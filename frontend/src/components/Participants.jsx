import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

export default function Participants({ sessionId }) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    socket.emit("joinSession", { sessionId, user: null });
    socket.on("participant:update", (p) => {
      setParticipants(prev => {
        if (p.type === "join") return [...prev, { id: p.id, user: p.user }];
        if (p.type === "leave") return prev.filter(x => x.id !== p.id);
        return prev;
      });
    });
    return () => socket.off("participant:update");
  }, [sessionId]);

  return (
    <div className="border p-2 w-48">
      <div className="font-bold mb-2">Participants</div>
      <ul className="space-y-1">
        {participants.map((p) => (
          <li key={p.id}>{p.user?.username || "User"} <small className="text-gray-500">({p.id.slice(0,4)})</small></li>
        ))}
      </ul>
    </div>
  );
}
