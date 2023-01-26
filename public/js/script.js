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
	alertButton.classList.add("btn-close", "m-1", "py-1", "px-2");
	alertButton.setAttribute("type", "button");
	alertButton.setAttribute("data-bs-dismiss", "alert");
	alertButton.setAttribute("aria-label", "Close");
	alertDiv.appendChild(alertButton);

	postFooter.insertBefore(alertDiv, postFooterForm);
}

function getPostId(element) {
	let id;
	for (const elementClass of element.classList) {
		if (elementClass === "post") {
			id = element.id.split("-")[1];
			return id;
		}
	}
	return getPostId(element.parentElement);
}

function makePostEditable(id) {
	const postTitle = document.getElementById(`post-title-${id}`);
	const postText = document.getElementById(`post-text-${id}`);
	const editablePost = createPostForm(
		id,
		postTitle.innerText,
		postText.innerText
	);

	const postBody = document.getElementById(`post-body-${id}`);
	postBody.innerHTML = "";
	postBody.appendChild(editablePost);

	const submitPostUpdateForm = document.getElementById("update-post-form");
	const cancelPostUpdateButton =
		document.getElementById("cancel-post-update");

	submitPostUpdateForm.addEventListener("submit", submittedPostUpdateHandler);
	cancelPostUpdateButton.addEventListener(
		"click",
		cancelledPostUpdateHandler
	);
}

function createPostForm(postId, title, content) {
	return $(
		`<form id="update-post-form">
            <div class="card-title">
                <h5 class="post-title" id="post-title-${postId}">
                    <input
                        type="text"
                        class="form-control border-0 fs-4 post-title"
                        id="post-title-${postId}"
                        value="${title}"
                    />
                </h5>
            </div>
            <div class="post-text m-0">
                <p 
                    class="card-text text-dark text-start border-0" 
                    id="post-text-${postId}"
                >
                    <textarea
                        data-expandable
                        class="form-control border-primary px-2 py-1 m-0 fs-6"
                        name="post-body"
                        id="post-body-${postId}"
                    >
${content}
                    </textarea>
                </p>
            </div>
            <div class="row m-0 mt-2 mb-2 py-2 px-4">
                            <button
                    type="button"
                    class="btn btn-outline-danger cancel-post-update col mx-3"
                    id="cancel-post-update"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="btn btn-outline-primary submit-post-update col mx-3"
                    id="submit-post-update"
                >
                    Save
                </button>
            </div>
        </form>`
	)[0];
}

const commentSubmitHandler = (event) => {
	event.preventDefault();

	const newComment = {
		post_id: event.target.id.split("-")[2],
		content: event.target[0].value,
	};

	fetch(`/api/comments/${newComment.post_id}`, {
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

	fetch(`/api/posts/`, {
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

const viewPostHandler = (event) => {
	//event.preventDefault(); // TODO: Why does this allow the other event handler to work???
	const validClick = !["TEXTAREA", "BUTTON"].includes(event.target.tagName);
	if (validClick) {
		const url = new URL(location);
		url.pathname = `/post/${getPostId(event.target)}`;
		location = url;
	}
};

const deletePostHandler = (event) => {
	event.preventDefault();

	const url = new URL(location);
	url.pathname = "/Dashboard";

	const id = event.target.id.split("-")[2];
	fetch(`/api/posts/${id}`, {
		method: "DELETE",
	})
		.then((response) => {
			location = url;
		})
		.catch((err) => {
			console.error(err);
			// TODO: handle error
		});
};

const updatePostHandler = (event) => {
	event.preventDefault();
	const postId = event.target.id.split("-")[2];
	makePostEditable(postId);
};

const submittedPostUpdateHandler = (event) => {
	event.preventDefault();
	const postId = event.target[0].id.split("-")[2];
	const updatedPost = {
		title: event.target[0].value,
		content: event.target[1].value,
	};

	fetch(`/api/posts/${postId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updatedPost),
	})
		.then((response) => {
			location.reload();
		})
		.catch((err) => {
			// TODO: Handle errors
		});
};

const cancelledPostUpdateHandler = (event) => {
	event.preventDefault();
	console.log("cancel updated post");
	console.log(event.target);
};

const posts = document.getElementsByClassName("post");
if (posts.length > 0) {
	const currentURL = new URL(location);
	// If we are viewing a single post, we do not want to add event listeners. This would enable the user to click the post to view the page they are already viewing!
	if (!currentURL.pathname.match(/\/post\//)) {
		for (const post of posts) {
			post.addEventListener("click", viewPostHandler);
		}
	}
}

const commentSubmissionForms =
	document.getElementsByClassName("submit-comment");
for (const form of commentSubmissionForms) {
	form.addEventListener("submit", commentSubmitHandler);
}

const postSubmissionForm = document.getElementById("new-post-form");
if (postSubmissionForm) {
	postSubmissionForm.addEventListener("submit", postSubmitHandler);
}

const deletePostButton =
	document.getElementsByClassName("delete-post-button")[0];
if (deletePostButton) {
	deletePostButton.addEventListener("click", deletePostHandler);
}

const updatePostButton =
	document.getElementsByClassName("update-post-button")[0];
if (updatePostButton) {
	updatePostButton.addEventListener("click", updatePostHandler);
}
