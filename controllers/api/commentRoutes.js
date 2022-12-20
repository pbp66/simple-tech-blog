import express from "express";
const router = new express.Router();
import { Comment, Post, User } from "../../models";

router.get("/:post_id", async (req, res) => {
	console.log("API comment route");
	console.log(`Post ID: ${req.params.post_id}`);
});

router.post("/", async (req, res) => {
	console.log("API comment route");
	console.log(`Post ID: ${req.params.post_id}`);
});

router.put("/:id", async (req, res) => {
	console.log("API comment route");
	console.log(`Post ID: ${req.params.post_id}`);
});

router.delete("/:id", async (req, res) => {
	console.log("API comment route");
	console.log(`Post ID: ${req.params.post_id}`);
});

export default router;
