import express from "express";
const router = new express.Router();
import { Comment, Post, User } from "../../models";
import { DateTime } from "luxon";

router.get("/:post_id", async (req, res) => {
	try {
		const commentsData = await Comment.findAll({
			where: { post_id: req.params.post_id },
		});

		const comments = commentsData.map((element) =>
			element.get({ plain: true })
		);

		res.status(200).json(comments).send();
	} catch (err) {
		console.error(err);
		res.status(500).json(err).send("Internal Server Error");
	}
});

router.post("/:post_id", async (req, res) => {
	try {
		const newCommentData = {};
		Object.assign(newCommentData, req.body);
		newCommentData["user_id"] = req.session.user_id;
		const newComment = await Comment.create(newCommentData);

		newComment.dataValues["username"] = req.session.username;
		newComment.dataValues.updatedAt = DateTime.fromJSDate(
			newComment.dataValues.updatedAt
		).toFormat("MM/dd/yyyy hh:mm a");

		res.status(201).json(newComment).send();
	} catch (err) {
		console.error(err);
		res.status(500).json(err).send("Internal Server Error");
	}
});

router.put("/:id", async (req, res) => {
	try {
		// Returns null if MySQL doesn't find an entry with the same id
		const exists = await Comment.findOne({ where: { id: req.params.id } });
		if (exists) {
			const updatedComment = await Comment.update(
				{
					content: req.body.content,
					edit_status: true,
				},
				{ where: { id: req.params.id } }
			);

			// sequelize sends an array of length one with 1 if the entry was updated. Otherwise, it sends a 0 if the entry was not.
			if (updatedComment[0]) {
				res.status(204).send();
			} else {
				res.status(304).send();
			}
		} else {
			res.status(400).send(
				"Comment does not appear to exist. Create a comment using a Post Route instead."
			);
		}
	} catch (err) {
		console.error(err);
		res.status(500).json(err).send("Internal Server Error");
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const exists = await Comment.findOne({ where: { id: req.params.id } });
		if (exists) {
			await Comment.destroy({ where: { id: req.params.id } });
			res.status(204).send();
		} else {
			res.status(404).send("No comment found with specified data");
		}
	} catch (err) {
		console.error(err);
		res.status(500).json(err).send("Internal Server Error");
	}
});

export default router;
