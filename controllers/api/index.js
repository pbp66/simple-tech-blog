import express from "express";
const router = new express.Router();
import userRoutes from "./userRoutes.js";

router.use("/users", userRoutes);
