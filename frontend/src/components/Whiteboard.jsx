import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Whiteboard({ sessionId, token, tool, color, size }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1200;
    canvas.height = 700;
    canvas.style.width = "100%";
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    socket.emit("joinSession", { sessionId, user: token ? { token } : null });

    socket.on("drawing", (payload) => {
      replayDraw(payload, false);
    });

    socket.on("shape", (payload) => {
      replayDraw(payload, false);
    });

    socket.on("text", (payload) => {
      drawTextFromSocket(payload);
    });

    socket.on("session:load", (canvasData) => {
      loadFromDataURL(canvasData);
    });

    socket.on("undo", (payload) => {
      handleRemoteUndo(payload);
    });

    socket.on("redo", (payload) => {
      handleRemoteRedo(payload);
    });

    return () => {
      socket.off("drawing");
      socket.off("shape");
      socket.off("text");
      socket.off("session:load");
      socket.off("undo");
      socket.off("redo");
    };
  }, [sessionId]);

}