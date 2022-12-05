import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connection";
import User from "./user.js";

class Post extends Model {}

// Belongs to ONE owner
// CAN have many comments. See postComment.js

Post.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		owner_id: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: "id",
			},
		},
	},
	{
		sequelize,
		timestamps: true, // Adds createdAt and updateAt timestamps to this model
		freezeTableName: true,
		underscored: true,
		modelName: "post",
	}
);

export default Post;
