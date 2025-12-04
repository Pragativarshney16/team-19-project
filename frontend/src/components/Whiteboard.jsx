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

  function getPointer(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX || e.touches?.[0]?.clientX) - rect.left,
      y: (e.clientY || e.touches?.[0]?.clientY) - rect.top
    };
  }

  function start(e) {
    setIsDrawing(true);
    const p = getPointer(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(p.x, p.y);
    pushUndo();
  }

  function end() {
    if (!isDrawing) return;
    setIsDrawing(false);
    ctxRef.current.closePath();
  }

  function draw(e) {
    if (!isDrawing) return;
    const p = getPointer(e);
    const payload = { x: p.x, y: p.y, tool, color, size };
    replayDraw(payload, true);
    socket.emit("drawing", { sessionId, payload });
  }

  function replayDraw({ x, y, tool: t, color: c, size: s }, fromLocal) {
    const ctx = ctxRef.current;
    ctx.strokeStyle = c || "#000";
    ctx.lineWidth = s || 2;
    if ((t || "pen") === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = s * 3 || 10;
    } else {
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (fromLocal) {
    }
  }

  function addText(x, y, text, fontSize = 20, colorText = "#000") {
    const ctx = ctxRef.current;
    ctx.fillStyle = colorText;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(text, x, y);
    socket.emit("text", { sessionId, payload: { x, y, text, fontSize, colorText } });
  }

  function drawTextFromSocket({ x, y, text, fontSize, colorText }) {
    const ctx = ctxRef.current;
    ctx.fillStyle = colorText;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(text, x, y);
  }

  function pushUndo() {
    const data = canvasRef.current.toDataURL();
    undoStack.current.push(data);
    if (undoStack.current.length > 50) undoStack.current.shift();
    redoStack.current = [];
  }

  function undo(localEmit = true) {
    if (undoStack.current.length === 0) return;
    const last = undoStack.current.pop();
    redoStack.current.push(canvasRef.current.toDataURL());
    loadFromDataURL(last);
    if (localEmit) socket.emit("undo", { sessionId, payload: last });
  }

  function redo(localEmit = true) {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop();
    undoStack.current.push(canvasRef.current.toDataURL());
    loadFromDataURL(next);
    if (localEmit) socket.emit("redo", { sessionId, payload: next });
  }

  function handleRemoteUndo(dataURL) {
    loadFromDataURL(dataURL);
  }
  function handleRemoteRedo(dataURL) {
    loadFromDataURL(dataURL);
  }

  function loadFromDataURL(dataURL) {
    const img = new Image();
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
    img.src = dataURL;
  }

  function exportImage() {
    return canvasRef.current.toDataURL("image/png");
  }

  function saveToServer() {
    const data = canvasRef.current.toDataURL();
    socket.emit("saveSession", { sessionId, canvasData: data });
  }

