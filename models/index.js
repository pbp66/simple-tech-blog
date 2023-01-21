import User from "./user";
import Post from "./post";
import Comment from "./comment";

// Post - User relationship
Post.belongsTo(User, {
	foreignKey: "owner_id",
});

User.hasMany(Post, {
	onDelete: "CASCADE",
	foreignKey: "owner_id",
});

// Post - Comment Relationship
Post.hasMany(Comment, {
	onDelete: "CASCADE",
	foreignKey: "post_id",
});

Comment.belongsTo(Post, {
	foreignKey: "post_id",
});

// Comment - User relationship
Comment.belongsTo(User, {
	foreignKey: "user_id",
});

User.hasMany(Comment, {
	onDelete: "CASCADE",
	foreignKey: "user_id",
});

export { User, Post, Comment };
