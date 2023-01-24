import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/connection";

class User extends Model {
	checkPassword(pass) {
		// Uses a synchronous method to compare if the provided password results in the same hash as the stored password
		return bcrypt.compareSync(pass, this.password);
	}
}

// CAN have many posts
// CAN have many comments
// References defined outside this model in post.js, comment.js, and postComment.js

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				is: /^[a-zA-Z\d_-]+$/, // Match lowercase, uppercase, 0-9, _, and -
				len: [4, 14],
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [8],
			},
		},
	},
	{
		hooks: {
			beforeCreate: async (newUserData) => {
				// pass in password and hard-coded 10 salt rounds. No error handling function passed
				newUserData.password = await bcrypt.hash(
					newUserData.password,
					10
				);
				return newUserData;
			},
		},
		sequelize,
		timestamps: false,
		freezeTableName: true,
		underscored: true,
		modelName: "user",
	}
);

export default User;
