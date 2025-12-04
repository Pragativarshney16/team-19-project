const Session = require("./models/Session");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinSession", async ({ sessionId, user }) => {
      socket.join(sessionId);
      socket.sessionId = sessionId;
      socket.user = user;
      // broadcast participant join
      io.to(sessionId).emit("participant:update", { id: socket.id, user, type: "join" });

      // if session has saved canvas, send it to the new user
      try {
        const session = await Session.findById(sessionId);
        if (session?.canvasData) {
          socket.emit("session:load", session.canvasData);
        }
      } catch (err) { /* ignore */ }
    });

    socket.on("drawing", ({ sessionId, payload }) => {
      socket.to(sessionId).emit("drawing", payload);
    });

    socket.on("shape", ({ sessionId, payload }) => {
      socket.to(sessionId).emit("shape", payload);
    });

    socket.on("text", ({ sessionId, payload }) => {
      socket.to(sessionId).emit("text", payload);
    });

    socket.on("chat", ({ sessionId, message }) => {
      io.to(sessionId).emit("chat", { message, user: socket.user });
    });

    socket.on("saveSession", async ({ sessionId, canvasData }) => {
      try {
        await Session.findByIdAndUpdate(sessionId, { canvasData }, { new: true, upsert: true });
        socket.emit("session:saved", { ok: true });
      } catch (err) {
        socket.emit("session:saved", { ok: false, err: err.message });
      }
    });

    socket.on("undo", ({ sessionId, payload }) => {
      socket.to(sessionId).emit("undo", payload);
    });

    socket.on("redo", ({ sessionId, payload }) => {
      socket.to(sessionId).emit("redo", payload);
    });

    socket.on("disconnect", () => {
      const { sessionId, user } = socket;
      if (sessionId) {
        io.to(sessionId).emit("participant:update", { id: socket.id, user, type: "leave" });
      }
      console.log("Socket disconnected:", socket.id);
    });
  });
};
