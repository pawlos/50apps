var ctx;
var head = {x: 0, y:0};
var elems = [];
var dir = {x: 0, y: 0};
var canvas;
var fruits = [];
var cellSize = 12;
var isRunning = false;
var isGameOver = false;
var fruitNames = ['maracuja','lime','kiwi','strawberry','watermelon','grapefruit','lemon'];

jQuery(document).ready(function() {
	canvas = jQuery('#snakeboard');
	ctx = canvas.get(0).getContext('2d');
	
	jQuery(this).keyup(function(evn) {
		var key = evn.which;
		if (key == 37) {
			dir = {x:-cellSize, y: 0};
		} else if (key == 38) {
			dir = {x:0, y: -cellSize};
		} else if (key == 39) {
			dir = {x:cellSize, y: 0};
		} else if (key == 40) {
			dir = {x:0, y: +cellSize};
		} else if (key == 32) {
			pause();
		}
	});	
	setInitPos();
	setInterval(mainLoop, 200);
});

function setInitPos() {
	head.x = Math.round((canvas.width() / 2 / cellSize))*cellSize;
	head.y = Math.round((canvas.height() / 2 / cellSize))*cellSize;
	var rnd = Math.round(Math.random()*3);
	if (rnd == 0)
		dir = {x:-cellSize, y: 0};
	else if (rnd == 1)
		dir = {x:cellSize, y: 0};
	else if (rnd == 2)
		dir = {x:0, y: -cellSize};
	else
		dir = {x:0, y: cellSize};
	elems = [];
	fruits = [];
}

function pause() {
	isRunning = !isRunning;
	if (isGameOver) {
		setInitPos();
		isGameOver = false;
	}
}

function advancePosition() {	
	for (var i=elems.length-1; i>=0; i--) {		
		if (i == 0) {		
			elems[i].x = -dir.x;
			elems[i].y = -dir.y;
		}
		else {		
			elems[i].x = elems[i-1].x;
			elems[i].y = elems[i-1].y;
		}
	}
	head = { x: head.x + dir.x, y: head.y + dir.y};
}

function placeFruit() {
	if (fruits.length > 0)
		return;
	var fruit = {x:0, y:0, type: getType()};
	fruit.x = Math.round((Math.random()*(canvas.width() - cellSize) / cellSize))*cellSize;
	fruit.y = Math.round((Math.random()*(canvas.height() - cellSize) / cellSize))*cellSize;
	fruits.push(fruit);
}

function getType() {
	var rand = Math.round(Math.random()*6);
	return fruitNames[rand];	
}

function hitFruit() {
	if (fruits.length == 0)
		return false;
	var leftCorX = fruits[0].x;
	var leftCorY = fruits[0].y;
	var headCorX = head.x + cellSize/2;
	var headCorY = head.y + cellSize/2;
	
	return headCorX > leftCorX && headCorY > leftCorY && headCorX < leftCorX + cellSize*2 && headCorY < leftCorY + cellSize*2;
}

function makeSnakeBigger() {
	delete fruits[0];
	fruits.splice(0,1);
	if (elems.length == 0) {
		elems.push({x: dir.x, y: dir.y});		
	}
	else {
		var last = elems[elems.length-1];
		elems.push({x: last.x, y: last.y});		
	}
	eatSound();
}

function eatSound() {
	var snd = new Audio("20279__koops__apple-crunch-16.wav");
	snd.play();
}

function bump() {
	var snd = new Audio("31125__calethos__bump-7.wav");
	snd.play();
}

function drawCircle(x, y, scale) {
	ctx.beginPath();
	ctx.arc(x, y, cellSize*scale, 0, 2*Math.PI, false);
	ctx.fillStyle = "#8ED6FF";
	ctx.fill();
	ctx.lineWidth = 3;
	ctx.strokeStyle = "black";
	ctx.stroke();
}

function hitWall() {
	return head.x <= 0 || head.x >= canvas.width() || head.y <= 0 || head.y >= canvas.height();
}

function gameOver() {
	ctx.font = "40pt Calibri";
	ctx.fillColor = "#000";
	ctx.fillText("Game Over", canvas.width()/2 - 100, canvas.height()/2);
	isRunning = false;
	isGameOver = true;
}

function drawBounds() {
	ctx.strokeColor = "#444";
	ctx.lineWidth = 2;
	ctx.strokeRect(0,0, canvas.width(), canvas.height());
}

function bitYourself() {
	//checking if head is in colision with any of the other parts of the body
	var pos = {x: head.x, y: head.y};
	for (var i in elems) {
		var leftCorX = elems[i].x + pos.x;
		var leftCorY = elems[i].y + pos.y;
		var headCorX = head.x;
		var headCorY = head.y;
	
		var collision = headCorX > leftCorX && headCorY > leftCorY && headCorX < leftCorX && headCorY < leftCorY;
		if (collision)
			return true;
		pos = {x: leftCorX, y: leftCorY};
	}
	return false;
}

function mainLoop() {
	if (!isRunning)
		return;
	advancePosition();
	placeFruit();
	if (hitWall() || bitYourself())
	{
		bump();
		gameOver();
		clearInterval();
	}	
	if (hitFruit()) {
		makeSnakeBigger();
	}
	ctx.clearRect(0,0, canvas.width(), canvas.height());
	drawBounds();
	//draw fruits
	for(var id in fruits) 	{
		var fruit = fruits[id];
		ctx.drawImage(jQuery('#'+fruit.type).get(0), fruit.x,fruit.y);
	}
	//draw snake	
	var scale = 1.0;
	drawCircle(head.x, head.y, scale);
	var pos = {x: head.x, y: head.y};
	for(var cell in elems) {
		var c = elems[cell];
		var pos = {x: pos.x + c.x, y: pos.y + c.y};
		scale *= 0.98;
		drawCircle(pos.x, pos.y, scale);
	}
}