HTMLDocument.prototype.setMoveCursor = function() {
	this.body.style.cursor = 'pointer';
};

HTMLDocument.prototype.setDefaultCursor = function() {
	this.body.style.cursor = 'default';
};

function Board() {
}

Board.prototype._notes = [];
Board.prototype._context = null;

Board.prototype.addNote = function(note, addToDb) {
	this._notes.push(note);	
	week04.webdb.saveNote(note);
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
	this._notes.splice(index,1);
	week04.webdb.deleteNote(note);
	note.clear(this._context);
};

Board.prototype.init = function(context) {
	this._context = context;
	week04.webdb.open();
	week04.webdb.createTable();
};

Board.prototype.updateNotePosition = function(note, posX, posY) {
	note.clear(this._context);
	note.setPosition(posX, posY);
	week04.webdb.updateNote(note);
	this.redraw();
};

Board.prototype.getNoteBelowCursorOnPin = function(event) {
	var posX = event.offsetX;
	var posY = event.offsetY;
	for(key in this._notes) {
		var note = this._notes[key];
		var notePinPosX = note._positionX;
		var notePinPosY = note._positionY;
		if ((notePinPosX - 20 < posX) &&
		    (notePinPosX + 20 > posX) &&
		    (notePinPosY - 20 < posY) &&
		    (notePinPosY + 20 > posY))
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

function Note() {
}

Note.prototype._id = 0;
Note.prototype._width = 278;
Note.prototype._height = 278;
Note.prototype._pinPosX = 114;
Note.prototype._pinPosY = 51;
Note.prototype._text = null;
Note.prototype._positionX = 0;
Note.prototype._positionY = 0;
Note.prototype._date = "";

Note.prototype.getId = function() {
	return this._id;
}

Note.prototype.setId = function(id) {
	this._id = id;
}
	
Note.prototype.draw = function(context) {
	var img = document.getElementById("stickyNoteImg");		
	context.save();
	context.drawImage(img, this._positionX - this._pinPosX, this._positionY - this._pinPosY, this._width, this._height);	
	context.translate(this._positionX - this._pinPosX + 32, this._positionY - this._pinPosY + 75);	
	context.font = '9pt PT Sans';
	context.fillText(date.format(this._date), 0,0)//this._positionX - this._pinPosX + 14, this._positionY - this._pinPosY + 63);	
	context.restore();
};

Note.prototype.clear = function(context) {
	context.save();
	context.fillStyle = 'rgb(255,255,255)';
	context.fillRect(this._positionX - this._pinPosX, this._positionY - this._pinPosY, this._width, this._height);
	context.restore();
};
	
Note.prototype.setText = function(text) {
	this._text = text;
};

Note.prototype.getText = function() {
	return this._text;
};

Note.prototype.getDate = function() {
	return this._date;
};

Note.prototype.setDate = function(date) {
	this._date = date;
};
	
Note.prototype.setPosition = function(posX, posY) {
	this._positionX = posX;
	this._positionY = posY;
};

Note.prototype.setPosition = function(posX, posY) {
	this._positionX = posX;
	this._positionY = posY;
};

jQuery(document).ready(function() {
	var canvas = document.getElementById("board");
	init(canvas);	
	var board = new Board;	
	board.init(canvas.getContext('2d'))
	jQuery('#board').click(function() {
		jQuery(this).off('mousemove');
		var noteToBeDeleted = board.getNoteBelowCursorOnClose(event);
		if (noteToBeDeleted)
		{
			board.removeNote(noteToBeDeleted);
			return;
		}
			
		var activeNote = board.getNoteBelowCursorOnPin(event);
		if (activeNote)
		{
			document.setMoveCursor();
		}
		else
		{
			document.setDefaultCursor();
		}		
		var moving = jQuery(this).attr('move');
		if (!activeNote && !moving)
		{
			var n = new Note;
			n.setDate(new Date());
			n.setPosition(event.offsetX, event.offsetY);
			board.addNote(n);
		} else {
			if (!moving)
			{
				jQuery(this).attr('move','on');
				jQuery(this).on('mousemove', function() {															
					//board.removeNote(activeNote);
					//var n = new Note;
					//n.setDate(activeNote.getDate());
					//n.setText(activeNote.getText());
					//activeNote = n;
					//activeNote.updatePosition(event.offsetX, event.offsetY);
					board.updateNotePosition(activeNote, event.offsetX, event.offsetY);
				});
			}
			else
			{				
				jQuery('#board').removeAttr('move');
				document.setDefaultCursor();
			}
		}
	});
});

function init(canvas) {
	canvas.width = document.width;
	canvas.height = document.height;
}