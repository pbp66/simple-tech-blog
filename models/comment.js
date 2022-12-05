import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connection";
import Post from "./post.js";

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
		post_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Post,
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

export default Comment;
