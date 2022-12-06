import express from "express";
const router = new express.Router();
import { User } from "../models";
import withAuth from "../utils/auth";

// Prevent non logged in users from viewing the homepage
router.get("/", withAuth, async (req, res) => {
	try {
		const userData = await User.findAll({
			attributes: { exclude: ["password"] },
			order: [["name", "ASC"]],
		});

		const users = userData.map((project) => project.get({ plain: true }));

		res.render("homepage", {
			users,
			// Pass the logged in flag to the template
			logged_in: req.session.logged_in,
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/login", (req, res) => {
	// If a session exists, redirect the request to the homepage
	if (req.session.logged_in) {
		res.redirect("/");
		return;
	}

	res.render("login");
});

export default router;

// TODO: Instead of preventing the homepage from loading, prevent access from creating posts/comments. You may still access the homepage in this project
