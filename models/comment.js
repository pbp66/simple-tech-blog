import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connection";
import User from "./user";
import Post from "./post";

class Comment extends Model {}

// Belongs to ONE owner
// Belongs to ONE post

Comment.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: "id",
			},
		},
		post_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Post,
				key: "id",
			},
		},
		edit_status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		sequelize,
		timestamps: true, // Adds createdAt and updateAt timestamps to this model
		freezeTableName: true,
		underscored: true,
		modelName: "comment",
	}
);

export default Comment;
