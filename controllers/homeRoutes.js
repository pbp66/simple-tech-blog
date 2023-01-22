import express from "express";
const router = new express.Router();
import { User, Post, Comment } from "../models";
import withAuth from "../utils/auth";
import { DateTime } from "luxon";

// Non-logged in users may view the homepage. They may not access a dashboard, make posts, or make comments
router.get("/", async (req, res) => {
	try {
		const postData = await Post.findAll({
			include: [
				User,
				{
					model: Comment,
					order: [["updatedAt", "DESC"]],
				},
			],
			order: [["updatedAt", "DESC"]],
		});

		const posts = postData.map((element) => {
			let post = element.get({ plain: true });
			post.updatedAt = DateTime.fromJSDate(post.updatedAt).toFormat(
				"LL/dd/yyyy hh:mm a"
			);
			return post;
		});

		res.render("home", {
			posts: posts,
			logged_in: req.session.logged_in,
		});
	} catch (err) {
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

	console.log(req.query.redirect);

	if (req.query.redirect == 1) {
		redirectStatus = 1;
	} else {
		redirectStatus = 0;
	}

	res.render("login", { redirectStatus });
});

// Load and render the dashboard view
router.get("/dashboard", withAuth, async (req, res) => {
	console.log("dashboard route");
	// const userData = await User.findAll({
	// 	attributes: { exclude: ["password"] },
	// });

	const postData = await Post.findAll({
		where: { user_id: req.session.user_id },
	});

	const posts = postData.map((element) => {
		let post = element.get({ plain: true });
		post.updatedAt = DateTime.fromJSDate(post.updatedAt).toFormat(
			"LL/dd/yyyy hh:mm a"
		);
		return post;
	});

	// TODO: Get and send ALL comments

	res.render("dashboard", {
		posts: posts,
		current_user: req.session.user_id,
		logged_in: req.session.logged_in,
	});
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
