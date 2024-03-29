import express from "express";
const router = new express.Router();
import { User } from "../../models";

router.post("/login", async (req, res) => {
	try {
		// Find the user who matches the posted username
		const userData = await User.findOne({
			where: { username: req.body.username },
		});

		if (!userData) {
			res.status(400).json({
				message: "Incorrect username or password, please try again",
			});
			return;
		}

		// Verify the posted password with the password store in the database
		const validPassword = await userData.checkPassword(req.body.password);

		if (!validPassword) {
			res.status(400).json({
				message: "Incorrect username or password, please try again",
			});
			return;
		}

		// Create session variables based on the logged in user
		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.username = userData.username;
			req.session.logged_in = true;

			res.json({ user: userData, message: "You are now logged in!" });
		});
	} catch (err) {
		res.status(400).json(err);
	}
});

router.post("/signup", async (req, res) => {
	try {
		const userData = await User.findOne({
			where: { username: req.body.username },
		});
		if (userData) {
			res.status(400).json({ message: "Username already exists" });
		}

		const newUserData = await User.create(req.body);
		const newUser = newUserData.get({ plain: true });

		// Make sure we save the credentials to the session so that the user automatically logins upon account creation
		req.session.save(() => {
			req.session.user_id = newUser.id;
			req.session.logged_in = true;
			req.session.username = newUser.username;

			res.json({ user: newUser, message: "You are now logged in!" });
		});
	} catch (err) {
		console.log(err);
		res.status(400).send();
	}
});

router.post("/logout", (req, res) => {
	if (req.session.logged_in) {
		// Remove the session variables
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

export default router;
