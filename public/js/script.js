// Used to auto expand the text area based on height
// Found on https://css-tricks.com/auto-growing-inputs-textareas/
// Look for comment made by Vanderson on March 25, 2020
$("form").on("keydown input", "textarea[data-expandable]", function () {
	//Auto-expanding textarea
	this.style.removeProperty("height");
	this.style.height = this.scrollHeight + 2 + "px";
});

function appendNewComment(newCommentObject) {
	const commentList = document.getElementById(
		`comment-list-${newCommentObject.post_id}`
	);

	const newCommentListItem = document.createElement("li");
	newCommentListItem.classList.add("list-group-item", "m-0", "p-0");

	const card = document.createElement("div");
	card.classList.add("comment", "p-0", "m-0");

	const cardHeader = document.createElement("div");
	cardHeader.classList.add(
		"card-header",
		"comment-header",
		"rounded-0",
		"py-2",
		"px-4"
	);

	const cardHeaderTitle = document.createElement("h6");
	cardHeaderTitle.classList.add(
		"font-weight-light",
		"text-muted",
		"text-end",
		"p-0",
		"m-0"
	);
	cardHeaderTitle.innerText = `Comment By ${newCommentObject.username} on ${newCommentObject.updatedAt}`;

	const cardText = document.createElement("div");
	cardText.classList.add("text-start", "comment-text", "py-2", "px-4");
	cardText.innerText = newCommentObject.content;

	cardHeader.appendChild(cardHeaderTitle);
	card.appendChild(cardHeader);
	card.appendChild(cardText);
	newCommentListItem.appendChild(card);
	commentList.appendChild(newCommentListItem);
}

function addSuccessAlert(postId, objectType) {
	const message = `${objectType} successfully created!`;
	addAlert("success", postId, message);
}

function addErrorAlert(postId, objectType) {
	const message = `An error was encountered while trying to create your ${objectType}. Please try again.`;
	addAlert("danger", postId, message);
}

function addAlert(alertType, postId, message) {
	const postFooter = document.getElementById(`create-comment-${postId}`);
	const postFooterForm = document.getElementById(`new-comment-${postId}`);

	const alertDiv = document.createElement("div");
	alertDiv.classList.add(
		"alert",
		`alert-${alertType}`,
		"alert-dismissible",
		"fade",
		"show",
		"m-0",
		"p-1"
	);
	alertDiv.setAttribute("role", "alert");
	alertDiv.innerText = `${message} `;

	const alertButton = document.createElement("button");
	alertButton.classList.add("btn-close", "m-1", "p-1");
	alertButton.setAttribute("type", "button");
	alertButton.setAttribute("data-bs-dismiss", "alert");
	alertButton.setAttribute("aria-label", "Close");
	alertDiv.appendChild(alertButton);

	postFooter.insertBefore(alertDiv, postFooterForm);
}

const commentSubmitHandler = (event) => {
	event.preventDefault();
	const newComment = {
		post_id: event.target.id.split("-")[2],
		content: event.target[0].value,
	};

	fetch(`./api/comments/${newComment.post_id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newComment),
	})
		.then((response) => response.json())
		.then((data) => {
			event.target[0].value = "";
			appendNewComment(data);
			addSuccessAlert(data.post_id, "Comment");
		})
		.catch((err) => {
			// TODO: Handle error with bootstrap alert
			console.error(err);
		});
};

const postSubmitHandler = (event) => {
	event.preventDefault();
	const newPost = {
		title: event.target[0].value,
		content: event.target[1].value,
	};

	fetch(`./api/posts/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newPost),
	})
		.then((response) => {
			location.reload();
		})
		.catch((err) => {
			// TODO: Handle errors
		});
};

const commentSubmissionForms =
	document.getElementsByClassName("submit-comment");
for (const form of commentSubmissionForms) {
	form.addEventListener("submit", commentSubmitHandler);
}

const postSubmissionForm = document.getElementById("new-post-form");
if (postSubmissionForm) {
	postSubmissionForm.addEventListener("submit", postSubmitHandler);
}
