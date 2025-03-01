import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import eyeRoutes from "./routes/eye.routes.js"; // Adjust based on your file structure

dotenv.config();
const app = express();

app.use(express.json()); // ✅ Required for JSON request body parsing
app.use(cors());

// Use the correct route prefix
app.use("/api", eyeRoutes); 

// ✅ Use updated Mongoose connection options
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Prevents infinite hangs
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
