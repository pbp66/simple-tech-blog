import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connection";
import User from "./user";

class Post extends Model {}

// Belongs to ONE owner (user)

Post.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
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
		modelName: "post",
	}
);

export default Post;
