const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_exam';

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));


app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend" });
});

// example route
const testRouter = require('./routes/test');
app.use('/api/test', testRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
