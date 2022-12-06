import express from "express";
const router = new express.Router();
import apiRoutes from "./api";
import homeRoutes from "./homeRoutes.js";

router.use("/", homeRoutes);
router.use("/api", apiRoutes);

export default router;
