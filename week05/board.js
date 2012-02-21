function Board() {
}

Board.prototype._notes = [];
Board.prototype._context = null;
Board.prototype._networking = null;

Board.prototype.addNote = function(note, doNotAddToDb, doNotRedraw, doNotSend) {
	this._notes.push(note);
	if (!doNotAddToDb)
	{
		week04.webdb.saveNote(note);		
	}
	if (!doNotSend)
		this._networking.sendNote(note);
	if (!doNotRedraw)
		this.redraw();
};

Board.prototype.redraw = function() {
	for(key in this._notes) {
		var note = this._notes[key];
		note.draw(this._context);
	}
};

Board.prototype.removeNote = function(note) {
	var index = this._notes.indexOf(note);
	this._notes.splice(index, 1);
	week04.webdb.deleteNote(note);
	note.clear(this._context);
	this.redraw();
};

Board.prototype.init = function(context) {
	this._context = context;
	this._context.fillStyle = '#000';
	this._context.strokeStyle = '#000';
	week04.webdb.open();
	week04.webdb.createTable();	
	week04.webdb.loadNotes(this.parseRows);	
	this._networking = new Networking(this);
};

Board.prototype.parseRows = function(tx, rs) {
	for (var i =0; i< rs.rows.length; i++) {
		var row = rs.rows.item(i);
		var n = new Note;
		n.setText(row.Note);
		n.setId(row.ID);
		n.setPosition(row.posX, row.posY);
		n.setDate(new Date(row.date));
		board.addNote(n, true, true);
	}
	board.redraw();
};
	

Board.prototype.updateNotePosition = function(note, posX, posY, doNotSendUpdate) {
	note.clear(this._context);
	note.setPosition(posX, posY);
	week04.webdb.updateNote(note);
	if (!doNotSendUpdate)
		this._networking.sendNote(note);
	this.redraw();
};

Board.prototype.updateNoteText = function(note, text, doNotSendUpdate) {
	note.clear(this._context);
	note.setText(text);
	week04.webdb.updateNote(note);
	if (!doNotSendUpdate)
		this._networking.sendNote(note);
	this.redraw();
};

Board.prototype.getNoteBelowCursorOnPin = function(event) {
	var posX = event.offsetX;
	var posY = event.offsetY;
	for(key in this._notes) {
		var note = this._notes[key];
		var notePinPosX = note._positionX;
		var notePinPosY = note._positionY;
		var pinSize = note._pinSize;
		if ((notePinPosX - pinSize < posX) &&
		    (notePinPosX + pinSize > posX) &&
		    (notePinPosY - pinSize < posY) &&
		    (notePinPosY + pinSize > posY))
			return note;
	}	
}

Board.prototype.getNoteBelowCursorOnClose = function(event) {
	var posX = event.offsetX;
	var posY = event.offsetY;
	for(key in this._notes) {
		var note = this._notes[key];
		var noteClosePosX = note._positionX - note._pinPosX + 221;
		var noteClosePosY = note._positionY - note._pinPosY + 23;
		if ((noteClosePosX - 16 < posX) &&
		    (noteClosePosX + 16 > posX) &&
		    (noteClosePosY - 16 < posY) &&
		    (noteClosePosY + 16 > posY))
			return note;
	}	
}

Board.prototype.getNoteBelowCursor = function(event) {
	var noteOnPin = this.getNoteBelowCursorOnPin(event);
	if (noteOnPin)
		return ['Pin', noteOnPin];
	var noteOnClose = this.getNoteBelowCursorOnClose(event);
	if (noteOnClose)
		return ['Close', noteOnClose];
	var noteOnText = this.getNoteBelowCursorOnText(event);
	if (noteOnText)
		return ['Text', noteOnText];
	
	return ['Default', null];
}

Board.prototype.getNoteBelowCursorOnText = function(event) {
	var posX = event.offsetX;
	var posY = event.offsetY;
	for(key in this._notes) {
		var note = this._notes[key];
		var noteTextPosX = note._positionX - note._pinPosX + 20;
		var noteTextPosY = note._positionY - note._pinPosY + 100;
		if ((noteTextPosX < posX) &&
		    (noteTextPosX + 200 > posX) &&
		    (noteTextPosY < posY) &&
		    (noteTextPosY + 150 > posY))
			return note;
	}	
}