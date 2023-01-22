const withAuth = (req, res, next) => {
	// If the user isn't logged in, redirect them to the login route
	if (!req.session.logged_in) {
		res.redirect("/login?redirect=1");
	} else {
		next();
	}
};

export default withAuth;
