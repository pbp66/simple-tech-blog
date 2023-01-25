import express from "express";
import sequelize from "../config/connection";
const router = new express.Router();
import { User, Post, Comment } from "../models";
import withAuth from "../utils/auth";
import { DateTime } from "luxon";

// Non-logged in users may view the homepage. They may not access a dashboard, make posts, or make comments
router.get("/", async (req, res) => {
	try {
		const postData = await Post.findAll({
			attributes: {
				include: [
					"id",
					"title",
					"content",
					[
						sequelize.fn(
							"DATE_FORMAT",
							sequelize.col("post.updated_at"),
							"%m/%d/%Y %h:%i %p"
						),
						"updatedAt",
					],
				],
			},
			include: [
				User,
				{
					model: Comment,
					attributes: {
						include: [
							"id",
							"content",
							"post_id",
							"edit_status",
							[
								sequelize.fn(
									"DATE_FORMAT",
									sequelize.col("post.updated_at"),
									"%m/%d/%Y %h:%i %p"
								),
								"updatedAt",
							],
						],
					},
					include: [User],
					order: [["updatedAt", "DESC"]],
				},
			],
			order: [["updatedAt", "DESC"]],
		});

		const posts = postData.map((element) => element.get({ plain: true }));

		let user;
		if (req.session.logged_in) {
			user = req.session.username;
		} else {
			user = undefined;
		}

		res.render("home", {
			posts,
			logged_in: req.session.logged_in,
			user,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json(err);
	}
});

// To logout, see client side javascript
router.get("/login", (req, res) => {
	let redirectStatus;

	// If a session exists, redirect the request to the homepage
	if (req.session.logged_in) {
		res.redirect("/home");
		return;
	}

	if (req.query.redirect == 1) {
		redirectStatus = 1;
	} else {
		redirectStatus = 0;
	}

	res.render("login", { redirectStatus });
});

// Load and render the dashboard view
router.get("/dashboard", withAuth, async (req, res) => {
	try {
		const postData = await Post.findAll({
			attributes: {
				include: [
					"id",
					"title",
					"content",
					[
						sequelize.fn(
							"DATE_FORMAT",
							sequelize.col("post.updated_at"),
							"%m/%d/%Y %h:%i %p"
						),
						"updatedAt",
					],
				],
			},
			include: [User, Comment],
			order: [["updatedAt", "DESC"]],
			where: { user_id: req.session.user_id },
		});

		const posts = postData.map((element) => element.get({ plain: true }));

		const commentsData = await Comment.findAll({
			attributes: {
				include: [
					"id",
					"content",
					"edit_status",
					[
						sequelize.fn(
							"DATE_FORMAT",
							sequelize.col("comment.updated_at"),
							"%m/%d/%Y %h:%i %p"
						),
						"updatedAt",
					],
				],
			},
			include: [User, Post],
			where: { user_id: req.session.user_id },
		});
		const comments = commentsData.map((element) =>
			element.get({ plain: true })
		);

		const count = posts.length + comments.length > 0;

		res.render("dashboard", {
			count,
			posts,
			comments,
			current_user: req.session.user_id,
			logged_in: req.session.logged_in,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json(err);
	}
});

// Load and render a post in its own window with comments
router.get("/post/:post_id", async (req, res) => {
	console.log("post route");
	console.log(`Post ID: ${req.params.post_id}`);

	const postData = Post.findOne({
		include: [
			User,
			{
				model: Comment,
				order: [["updatedAt", "DESC"]],
			},
		],
		where: { id: req.params.post_id },
		order: [["updatedAt", "DESC"]],
	});

	const post = postData.dataValues;

	res.render("post", {
		post: post,
		logged_in: req.session.logged_in,
	});
});

export default router;
