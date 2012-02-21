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
Note.prototype._isDeleted = false;

Note.prototype.setDeletedFlag = function() {
	this._isDeleted = true;
}

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
	context.clearRect(this._positionX - this._pinPosX, this._positionY - this._pinPosY, this._width, this._height);	
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
	jQuery('#textarea').on('keypress', function(event) {
		if (event.keyCode === 13) //Enter
			jQuery(this).trigger('blur');
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