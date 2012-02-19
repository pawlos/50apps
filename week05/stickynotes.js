var board;
jQuery('#stickyNoteImg').load(function() {
	var canvas = document.getElementById("board");
	init(canvas);	
	board = new Board;	
	board.init(canvas.getContext('2d'));	
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
	board.redraw();
});

function move(event) {
	document.setMovingCursor();
	board.updateNotePosition(event.handleObj.data, event.offsetX, event.offsetY);				
}

function init(canvas) {
	canvas.width = document.width;
	canvas.height = document.height;
}