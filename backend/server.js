import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import eyeRoutes from "./routes/eye.routes.js"; // Import API routes

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/eye", eyeRoutes); // Connect Eye Scan API routes

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
