import { useEffect, useState } from "react";

export default function App() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch(() => setMsg("Backend not reachable"));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Tailwind + Backend Test</h1>

      <div className="p-6 bg-white shadow-lg rounded-xl">
        <p className="text-xl">Backend says:</p>
        <p className="text-green-600 font-bold text-2xl mt-2">{msg}</p>
      </div>
    </div>
  );
}
