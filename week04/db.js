var week04 = {};
week04.webdb = {};

week04.webdb.db = null;
week04.webdb.note = null;

week04.webdb.open = function () {
	var dbSize = 1 * 1024 * 1024;
	this.db = openDatabase("StickyNotes", "0.9", "50 apps challenge Sticky Notes DB", dbSize);
}

week04.webdb.onError = function(tx, e) {
	alert('Error occured: ' + e.message);
}

week04.webdb.onInsertSuccess = function(tx, r) {	
	week04.webdb.note.setId(r.insertId);
}

week04.webdb.onGeneralSuccess = function(tx,r) {
}

week04.webdb.createTable = function() {	
	this.db.transaction(function(tx) {
		//tx.executeSql("DROP TABLE StickyNotesBeta");
		tx.executeSql("CREATE TABLE IF NOT EXISTS StickyNotesBeta(ID INTEGER PRIMARY KEY ASC, Note TEXT, date DATETIME, posX INT, posY INT)", []);
	});
}

week04.webdb.loadNotes = function(renderFunc) {
	this.db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM StickyNotesBeta", [], renderFunc, this.onError);
	});
}

week04.webdb.updateNote = function(note) {
	var that = this;
	this.db.transaction(function(tx) {
		tx.executeSql("UPDATE StickyNotesBeta SET posX = ?, posY = ?, Note = ? WHERE ID = ?", [note._positionX, note._positionY, note.getText(), note.getId()],
		that.onGeneralSucess,
		that.onError);
	});
}

week04.webdb.deleteNote = function(note) {
	var that = this;
	this.db.transaction(function(tx) {
		tx.executeSql('DELETE FROM StickyNotesBeta WHERE ID = ?', [note.getId()],
		that.onGeneralSuccess,
		that.onError);
	});
}

week04.webdb.saveNote = function(note) {
	var that = this;
	that.note = note;
	this.db.transaction(function(tx) {
		var res = tx.executeSql('Insert INTO StickyNotesBeta(Note, date, posX, posY) VALUES (?,?,?,?)', 
		[note.getText(), note.getDate(), note._positionX, note._positionY],
		that.onInsertSuccess,
		that.onError);
	});	
};