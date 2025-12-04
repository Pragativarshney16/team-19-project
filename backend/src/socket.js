const Session = require("./models/Session");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinSession", async ({ sessionId, user }) => {
      socket.join(sessionId);
      socket.sessionId = sessionId;
      socket.user = user;

      io.to(sessionId).emit("participant:update", {
        id: socket.id,
        user,
        type: "join"
      });

      try {
        const session = await Session.findById(sessionId);
        if (session?.canvasData) {
          socket.emit("session:load", session.canvasData);
        }
      } catch (err) {}
    });

    socket.on("drawing", ({ sessionId, payload }) => {
      socket.to(sessionId).emit("drawing", payload);
    });

    socket.on("text", ({ sessionId, payload }) => {
      socket.to(sessionId).emit("text", payload);
    });

    socket.on("undo", ({ sessionId, payload }) => {
      socket.to(sessionId).emit("undo", payload);
    });

    socket.on("redo", ({ sessionId, payload }) => {
      socket.to(sessionId).emit("redo", payload);
    });

    socket.on("saveSession", async ({ sessionId, canvasData }) => {
      try {
        await Session.findByIdAndUpdate(sessionId, { canvasData }, { upsert: true });
        socket.emit("session:saved", { ok: true });
      } catch (err) {
        socket.emit("session:saved", { ok: false, err: err.message });
      }
    });

    socket.on("chat", ({ sessionId, message }) => {
      io.to(sessionId).emit("chat", {
        message,
        user: socket.user
      });
    });

    socket.on("disconnect", () => {
      if (socket.sessionId) {
        io.to(socket.sessionId).emit("participant:update", {
          id: socket.id,
          user: socket.user,
          type: "leave"
        });
      }
      console.log("Socket disconnected:", socket.id);
    });
  });
};