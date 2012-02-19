HTMLDocument.prototype.setMoveCursor = function() {
	this.body.style.cursor = 'pointer';
};

HTMLDocument.prototype.setDefaultCursor = function() {
	this.body.style.cursor = 'default';
};

HTMLDocument.prototype.setTextCursor = function() {
	this.body.style.cursor = 'text';
};

HTMLDocument.prototype.setMovingCursor = function() {
	this.body.style.cursor = 'move';
};