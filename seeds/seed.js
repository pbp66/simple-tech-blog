import sequelize from "../config/connection.js";
import { Comment, Post, User } from "../models";
import userData from "./userData.json" assert { type: "json" };
import postData from "./postData.json" assert { type: "json" };
import commentData from "./commentData.json" assert { type: "json" };

const seedDatabase = async () => {
	await sequelize.sync({ force: true });

	/* Generate User Data from JSON */
	const usersData = await User.bulkCreate(userData, {
		individualHooks: true,
		returning: true,
	});
	const users = usersData.map((element) => element.get({ plain: true }));

	/* Generate Post Data from JSON */
	const postsData = await Post.bulkCreate(postData, {
		individualHooks: true,
		returning: true,
	});
	const posts = postsData.map((element) => element.get({ plain: true }));

	/* Generate Comment Data from JSON */
	const commentsData = await Comment.bulkCreate(commentData, {
		individualHooks: true,
		returning: true,
	});
	const comments = commentsData.map((element) =>
		element.get({ plain: true })
	);
};

seedDatabase();
