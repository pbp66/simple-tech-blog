const loginFormHandler = async (event) => {
	event.preventDefault();

	const username = document.querySelector("#username-login").value.trim();
	const password = document.querySelector("#password-login").value.trim();

	// Form Entry Validation
	let alertMessage = "";
	if (!username) {
		alertMessage += "Missing username\n";
	}
	if (!password) {
		alertMessage += "Missing password\n";
	}

	if (alertMessage.length !== 0) {
		alert(alertMessage);
	} else {
		// TODO: Implement error handling for bad requests
		const response = await fetch("/api/users/login", {
			method: "POST",
			body: JSON.stringify({ username, password }),
			headers: { "Content-Type": "application/json" },
		});

		if (!response.ok) {
			alert("Failed to sign up");
		} else {
			window.location.href = "/";
		}
	}
};

const loginForm = document.querySelector("#login-form");
if (loginForm) {
	loginForm.addEventListener("submit", loginFormHandler);
}

const signupFormHandler = async (event) => {
	event.preventDefault();

	const name = document.querySelector("#name-signup").value.trim();
	const username = document.querySelector("#username-signup").value.trim();
	const password = document.querySelector("#password-signup").value.trim();
	const confirmPassword = document
		.querySelector("#confirmPassword-signup")
		.value.trim();

	// Form Entry Validation
	let alertMessage = "";
	if (!name) {
		alertMessage += "Missing name\n";
	}
	if (!username) {
		alertMessage += "Missing username\n";
	}
	if (!password) {
		alertMessage += "Missing password\n";
	}
	if (password.length < 8) {
		alertMessage += "Password is smaller than 8 characters\n";
	}
	if (!confirmPassword || password !== confirmPassword) {
		alertMessage += "Passwords don't match\n";
	}

	if (alertMessage.length !== 0) {
		alert(alertMessage);
	} else {
		// TODO: Implement error handling for bad requests
		const response = await fetch("/api/users/signup", {
			method: "POST",
			body: JSON.stringify({ name, username, password }),
			headers: { "Content-Type": "application/json" },
		});

		if (!response.ok) {
			alert("Failed to sign up");
		} else {
			window.location.href = "/";
		}
	}
};

const signupForm = document.querySelector("#signup-form");
if (signupForm) {
	signupForm.addEventListener("submit", signupFormHandler);
}
