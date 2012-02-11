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

function Board() {
}

Board.prototype._notes = [];
Board.prototype._context = null;

Board.prototype.addNote = function(note, doNotAddToDb) {
	this._notes.push(note);	
	if (!doNotAddToDb)
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
	this._notes.splice(index, 1);
	week04.webdb.deleteNote(note);
	note.clear(this._context);
	this.redraw();
};

Board.prototype.init = function(context) {
	this._context = context;
	week04.webdb.open();
	week04.webdb.createTable();
	var that = this;
	week04.webdb.loadNotes(function(tx, rs) {
		for (var i =0; i< rs.rows.length; i++) {
			var row = rs.rows.item(i);
			var n = new Note;
			n.setText(row.Note);
			n.setId(row.ID);
			n.setPosition(row.posX, row.posY);
			n.setDate(new Date(row.date));
			that.addNote(n, true);
		}
	});
};

Board.prototype.updateNotePosition = function(note, posX, posY) {
	note.clear(this._context);
	note.setPosition(posX, posY);
	week04.webdb.updateNote(note);
	this.redraw();
};

Board.prototype.updateNoteText = function(note, text) {
	note.clear(this._context);
	note.setText(text);
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

function Note() {
}

Note.prototype._id = 0;
Note.prototype._width = 278;
Note.prototype._height = 278;
Note.prototype._pinPosX = 128;
Note.prototype._pinPosY = 51;
Note.prototype._pinSize = 30;
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
	context.font = '7pt PT Sans';
	context.fillText(date.format(this._date), 0,0);
	context.translate(0, 40);
	var words = this._text.split(" ");
	context.font = '9pt PT Sans';
	var posX = 0;
	var posY = 0;
	for (var i = 0; i < words.length; i++)
	{
		var wordLen = context.measureText(words[i]+ " ");
		if (posX + wordLen.width < 200) {		
			context.fillText(words[i] + " ", posX, posY);
			posX += wordLen.width;
		} else {
			posY += 20;
			posX = 0;
		}
	}	
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

Note.prototype.edit = function() {
	var posX = this._positionX - this._pinPosX + 35;
	var posY = this._positionY + 135;			
	jQuery('#textarea').css('left', posX+'px').css('top', posY+'px').val(this._text).show().focus();
	jQuery('#textarea').on('blur', this, function(event) {
		jQuery(this).off('blur');
		jQuery(this).hide();		
		jQuery('#board').attr('action', 'performed');
		board.updateNoteText(event.data, jQuery(this).val());
	});
};
	
Note.prototype.setPosition = function(posX, posY) {
	this._positionX = posX;
	this._positionY = posY;
};

Note.prototype.setPosition = function(posX, posY) {
	this._positionX = posX;
	this._positionY = posY;
};

var board;
jQuery(document).ready(function() {
	var canvas = document.getElementById("board");
	init(canvas);	
	board = new Board;	
	board.init(canvas.getContext('2d'))
	jQuery('#board').on('mousemove', function() {
		var result = board.getNoteBelowCursor(event);
		if (result)		
		{
			if (result[0] == 'Text')
				document.setTextCursor();
			else if (result[0] == 'Pin' || result[0] == 'Close')
				document.setMoveCursor();		
			else
				document.setDefaultCursor();
		}
		else
			document.setDefaultCursor();
	});
	
	jQuery('#board').on('click', function(event) {		
		var noteToBeDeleted = board.getNoteBelowCursorOnClose(event);
		if (noteToBeDeleted)
		{
			board.removeNote(noteToBeDeleted);
			jQuery(this).attr('action', 'performed');
		}
		return false;
	});
	
	jQuery('#board').on('click', function(event) {
		var noteToBeEdited = board.getNoteBelowCursorOnText(event);
		if (noteToBeEdited)
		{
			jQuery(this).attr('action', 'performed');
			noteToBeEdited.edit();			
		}
	});
	
	jQuery('#board').on('click', function() {
		var action = jQuery(this).attr('action');
		if (action)
		{
			jQuery(this).removeAttr('action');
			return;
		}
		jQuery('#board').off('mousemove', move);
		var moving = jQuery(this).attr('move');
		var activeNote = board.getNoteBelowCursorOnPin(event);
		if (!activeNote && !moving)
		{
			var n = new Note;
			n.setDate(new Date());
			n.setText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tincidunt aliquet nunc.");
			n.setPosition(event.offsetX, event.offsetY);
			board.addNote(n);
		} else {
			if (!moving)
			{
				jQuery(this).attr('move','on');
				jQuery('#board').on('mousemove', activeNote , move);
			}
			else
			{				
				jQuery('#board').removeAttr('move');
				document.setDefaultCursor();
			}
		}
	});
});

function move(event) {
	document.setMovingCursor();
	board.updateNotePosition(event.handleObj.data, event.offsetX, event.offsetY);				
}

function init(canvas) {
	canvas.width = document.width;
	canvas.height = document.height;
}