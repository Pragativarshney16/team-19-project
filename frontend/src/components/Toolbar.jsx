export default function Toolbar({ tool, setTool, color, setColor, size, setSize, addTextMode, setAddTextMode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-2 bg-gray-50 rounded mb-3">
      <button className={`px-3 py-1 ${tool === "pen" ? "bg-gray-300" : ""}`} onClick={() => setTool("pen")}>Pen</button>
      <button className={`px-3 py-1 ${tool === "eraser" ? "bg-gray-300" : ""}`} onClick={() => setTool("eraser")}>Eraser</button>
      <label className="flex items-center gap-2">
        Color <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </label>
      <label className="flex items-center gap-2">
        Size <input type="range" min="1" max="40" value={size} onChange={(e) => setSize(Number(e.target.value))} />
      </label>
      <button className={`px-3 py-1 ${addTextMode ? "bg-indigo-500 text-white" : "bg-gray-200"}`} onClick={() => setAddTextMode(!addTextMode)}>
        {addTextMode ? "Text mode: ON" : "Text"}
      </button>
    </div>
  );
}