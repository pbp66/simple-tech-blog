import sequelize from "../config/connection";
import { Post, Comment, User } from "../models";

const postAttributes = {
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
};

const commentAttributes = {
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
};

const postIncludes = [
	User,
	{
		model: Comment,
		attributes: commentAttributes,
		include: [User],
		order: [["updatedAt", "DESC"]],
	},
];

export { postAttributes, commentAttributes, postIncludes };
