import { useEffect, useRef, useState } from "react";
import socket from "../socket";

export default function Whiteboard({ sessionId, user, tool, color, size, addTextMode }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  // initialize canvas and socket listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1200;
    canvas.height = 700;
    canvas.style.width = "100%";
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    if (sessionId) {
      socket.emit("joinSession", { sessionId, user });
    }

    socket.on("drawing", (payload) => replayDraw(payload));
    socket.on("text", (payload) => replayText(payload));
    socket.on("session:load", (dataURL) => loadFromDataURL(dataURL));
    socket.on("undo", (dataURL) => loadFromDataURL(dataURL));
    socket.on("redo", (dataURL) => loadFromDataURL(dataURL));

    return () => {
      socket.off("drawing");
      socket.off("text");
      socket.off("session:load");
      socket.off("undo");
      socket.off("redo");
    };
  }, [sessionId]);

  // helpers
  function getPointer(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function pushUndo() {
    const data = canvasRef.current.toDataURL();
    undoStack.current.push(data);
    if (undoStack.current.length > 50) undoStack.current.shift();
    // clear redo on new action
    redoStack.current = [];
  }

  function loadFromDataURL(dataURL) {
    if (!dataURL) return;
    const img = new Image();
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
    img.src = dataURL;
  }

  // drawing functions
  function handlePointerDown(e) {
    if (!sessionId) { alert("Join or create a session first"); return; }

    const p = getPointer(e);
    if (addTextMode) {
      // adding text: ask user and draw
      const text = prompt("Enter text");
      if (text) {
        pushUndo();
        const payload = { x: p.x, y: p.y, text, color, size };
        drawText(payload);
        socket.emit("text", { sessionId, payload });
      }
      return;
    }

    pushUndo();
    drawingRef.current = true;
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    e.preventDefault();
  }

  function handlePointerMove(e) {
    if (!drawingRef.current) return;
    const p = getPointer(e);
    const ctx = ctxRef.current;

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = size * 3;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
    }

    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);

    // emit small payload to others
    socket.emit("drawing", { sessionId, payload: { x: p.x, y: p.y, tool, color, size } });
    e.preventDefault();
  }

  function handlePointerUp(e) {
    if (drawingRef.current) {
      drawingRef.current = false;
      ctxRef.current.beginPath();
    }
    e.preventDefault();
  }

  function replayDraw({ x, y, tool: t, color: c, size: s }) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (t === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = s * 3;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = c;
      ctx.lineWidth = s;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function drawText({ x, y, text, color: c = "#000", size: s = 20 }) {
    const ctx = ctxRef.current;
    ctx.fillStyle = c;
    ctx.font = `${s}px sans-serif`;
    ctx.fillText(text, x, y);
  }

  function replayText(payload) {
    drawText(payload);
  }

  // undo/redo
  function undo(local = true) {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current.pop();
    redoStack.current.push(canvasRef.current.toDataURL());
    loadFromDataURL(prev);
    if (local) socket.emit("undo", { sessionId, payload: prev });
  }

  function redo(local = true) {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop();
    undoStack.current.push(canvasRef.current.toDataURL());
    loadFromDataURL(next);
    if (local) socket.emit("redo", { sessionId, payload: next });
  }

  function exportPNG() {
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "whiteboard.png";
    a.click();
  }

  function saveSession() {
    const data = canvasRef.current.toDataURL();
    socket.emit("saveSession", { sessionId, canvasData: data });
    alert("Save requested");
  }

  return (
    <div>
      <div className="border">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full"
          style={{ touchAction: "none", background: "white" }}
        />
      </div>

      <div className="mt-2 flex gap-2">
        <button className="px-3 py-1 bg-gray-200" onClick={() => pushUndo()}>Snapshot</button>
        <button className="px-3 py-1 bg-blue-500 text-white" onClick={() => undo()}>Undo</button>
        <button className="px-3 py-1 bg-blue-500 text-white" onClick={() => redo()}>Redo</button>
        <button className="px-3 py-1 bg-green-500 text-white" onClick={exportPNG}>Export PNG</button>
        <button className="px-3 py-1 bg-yellow-500" onClick={saveSession}>Save</button>
      </div>
    </div>
  );
}