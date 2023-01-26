import express from "express";
const router = new express.Router();
import { User, Post, Comment } from "../models";
import withAuth from "../utils/auth";
import {
	postAttributes,
	commentAttributes,
	postIncludes,
} from "../utils/sequelizeAttributes.js";

// Non-logged in users may view the homepage. They may not access a dashboard, make posts, or make comments
router.get("/", async (req, res) => {
	try {
		const postData = await Post.findAll({
			attributes: postAttributes,
			include: postIncludes,
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
			attributes: postAttributes,
			include: postIncludes,
			order: [["updatedAt", "DESC"]],
			where: { user_id: req.session.user_id },
		});

		const posts = postData.map((element) => element.get({ plain: true }));

		const commentsData = await Comment.findAll({
			attributes: commentAttributes,
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
			user: req.session.username,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json(err);
	}
});

// Load and render a post in its own window with comments
router.get("/post/:post_id", async (req, res) => {
	let owner = false;

	try {
		const postData = await Post.findAll({
			attributes: postAttributes,
			where: { id: req.params.post_id },
			include: postIncludes,
		});

		const post = postData.map((element) => element.get({ plain: true }))[0];

		if (post.user_id === req.session.user_id) {
			owner = true;
		}

		res.render("post", {
			owner,
			post,
			logged_in: req.session.logged_in,
			current_user: req.session.user_id,
			logged_in: req.session.logged_in,
			user: req.session.username,
		});
	} catch (err) {
		console.error(err);
		res.status(500).send(`<h1>500 Internal Server Error</h1>`);
	}
});

export default router;
