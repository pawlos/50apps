/* logic for sockets networking */


function Networking (board) {
	this._board = board;
	this.connection.onopen = function () {	
	};
	that = this;
	this.connection.onmessage = function (e) {
		var noteJson = JSON.parse(e.data);
		var note = new Note;
		note.setText(noteJson._text);
		note.setDate(new Date(noteJson._date));
		note.setPosition(noteJson._positionX, noteJson._positionY);
		var e = new Object();
		e.offsetX = noteJson._positionX;
		e.offsetY = noteJson._positionY;
		var found = that._board.getNoteBelowCursor(e);
		if (found[1] != null)
		{
			that._board.updateNoteText(found[1], note.getText(), true);
			that._board.updateNotePosition(found[1], noteJson._positionX, noteJson._positionY, true);
		}
		else
			that._board.addNote(note, false, false, true);		
	};
}

Networking.prototype._board = null;

Networking.prototype.connection = new WebSocket('ws://localhost:8181/chat');

Networking.prototype.sendNote = function(note) {
	if (this.connection.readyState !== 0)
		this.connection.send(JSON.stringify(note));
}
