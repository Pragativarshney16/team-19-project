const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db"); 
const http = require("http");

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" }
});

require("./socket")(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running on port", PORT));
