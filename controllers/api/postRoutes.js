import express from "express";
const router = new express.Router();
import { Comment, Post, User } from "../../models";

router.get("/", async (req, res) => {
	try {
		const allPostsData = await Post.findAll({
			order: [["updateAt", "DESC"]],
		});

		const allPosts = allPostsData.map((element) =>
			element.get({ plain: true })
		);

		res.status(200).json(allPosts).send();
	} catch (err) {
		console.error(err);
		res.status(500).send(`<h1>500 Internal Server Error</h1>`);
	}
});

router.get("/:id", async (req, res) => {
	try {
	} catch (err) {
		console.error(err);
		res.status(500).send(`<h1>500 Internal Server Error</h1>`);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const exists = await Post.findOne({ where: { id: req.params.id } });
		if (exists) {
			await Post.destroy({ where: { id: req.params.id } });
			res.status(204).send();
		} else {
			res.status(404).send(`<h1>404 Data Not Found!</h1>
	<h3>No post found with specified data</h3>`);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send(`<h1>500 Internal Server Error</h1>`);
	}
});

export default router;
