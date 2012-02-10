function Board() {
}

Board.prototype._notes = [];
Board.prototype._context = null;

Board.prototype.addNote = function(note) {
	this._notes.push(note);
	this.redraw()	
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
	note.clear(this._context);
};

Board.prototype.init = function(context) {
	this._context = context;
};

Board.prototype.getNoteBelowCursor = function(event) {
	var posX = event.clientX;
	var posY = event.clientY;
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

function Note() {
}

Note.prototype._width = 278;
Note.prototype._height = 278;
Note.prototype._pinPosX = 114;
Note.prototype._pinPosY = 51;
Note.prototype._text = null;
Note.prototype._positionX = 0;
Note.prototype._positionY = 0;
	
Note.prototype.draw = function(context) {
	var img = document.getElementById("stickyNoteImg");		
	context.drawImage(img, this._positionX - this._pinPosX, this._positionY - this._pinPosY, this._width, this._height);
};

Note.prototype.clear = function(context) {
	context.fillStyle = 'rgb(255,255,255)';
	context.fillRect(this._positionX - this._pinPosX, this._positionY - this._pinPosY, this._width, this._height);
};
	
Note.prototype.setText = function(text) {
	this._text = text;
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
		var activeNote = board.getNoteBelowCursor(event);
		var moving = jQuery(this).attr('move');
		if (!activeNote && !moving)
		{
			var n = new Note;
			n.setPosition(event.clientX, event.clientY);
			board.addNote(n);
		} else {
			if (!moving)
			{
				jQuery(this).attr('move','on');
				jQuery(this).on('mousemove', function() {					
					board.removeNote(activeNote);
					var n = new Note;
					activeNote = n;
					n.setPosition(event.clientX, event.clientY);
					board.addNote(n);
				});
			}
			else
				jQuery('#board').removeAttr('move');
		}
	});
});
function init(canvas) {
	canvas.width = document.width;
	canvas.height = document.height;
}