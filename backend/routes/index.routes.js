import express from "express";
// import usersRoutes from "./users.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to the Express API!");
});

// router.use("/users", usersRoutes);

export default router;
