// URL to access posts:
// /api/posts/:id

// Used to auto expand the text area based on height
// Found on https://css-tricks.com/auto-growing-inputs-textareas/
// Look for comment made by Vanderson on March 25, 2020
$("form").on("keydown input", "textarea[data-expandable]", function () {
	//Auto-expanding textarea
	this.style.removeProperty("height");
	this.style.height = this.scrollHeight + 2 + "px";
});
