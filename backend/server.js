import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "./routes/index.routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", router);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


