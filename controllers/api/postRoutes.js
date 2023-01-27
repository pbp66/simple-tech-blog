import express from "express";
const router = new express.Router();
import { Comment, Post, User } from "../../models";
import sequelize from "../../config/connection";
import {
	postAttributes,
	commentAttributes,
	postIncludes,
} from "../../utils/sequelizeAttributes";

router.get("/", async (req, res) => {
	try {
		const allPostsData = await Post.findAll({
			attributes: postAttributes,
			include: postIncludes,
			order: [["updatedAt", "DESC"]],
		});

		const allPosts = allPostsData.map((element) =>
			element.get({ plain: true })
		);

		res.status(200).json(allPosts).send();
	} catch (err) {
		console.error(err);
		res.status(500).json(err).send("Internal Server Error");
	}
});

router.get("/:id", async (req, res) => {
	try {
		const postData = await Post.findAll({
			attributes: postAttributes,
			where: { id: req.params.id },
			include: postIncludes,
		});

		const post = postData.map((element) => element.get({ plain: true }))[0];

		res.status(201).json(post).send();
	} catch (err) {
		console.error(err);
		res.status(500).json(err).send("Internal Server Error");
	}
});

router.post("/", async (req, res) => {
	try {
		const newPostData = {};
		Object.assign(newPostData, req.body);
		newPostData["user_id"] = req.session.user_id;
		const newPost = await Post.create(newPostData);
		console.log(newPost);

		res.status(201).json(newPost).send();
	} catch (err) {
		console.error(err);
		res.status(500).json(err).send("Internal Server Error");
	}
});

router.put("/:id", async (req, res) => {
	try {
		// Returns null if MySQL doesn't find an entry with the same id
		const exists = await Post.findOne({ where: { id: req.params.id } });
		if (exists) {
			const updatedPost = await Post.update(
				{
					title: req.body.title,
					content: req.body.content,
				},
				{ where: { id: req.params.id } }
			);

			// sequelize sends an array of length one with 1 if the entry was updated. Otherwise, it sends a 0 if the entry was not.
			if (updatedPost[0]) {
				res.status(204).send();
			} else {
				res.status(304).send();
			}
		} else {
			res.status(400).send(
				"Post does not appear to exist. Create a post using a Post Route instead."
			);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
});

router.delete("/:id", async (req, res) => {
	console.log("\n\nAccessing the delete route");
	console.log("ID: ", req.params.id);
	try {
		const exists = await Post.findOne({ where: { id: req.params.id } });
		if (exists) {
			await Post.destroy({ where: { id: req.params.id } });
			res.status(204).send();
		} else {
			res.status(404).send("No comment found with specified data");
		}
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
});

export default router;
