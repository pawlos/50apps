var ctx;
var head = {x: 0, y:0};
var dir = {x: 0, y: 0};
var canvas;
var fruits = [];
var cellSize = 12;

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
		}
	});	
	head.x = Math.round((canvas.width() / 2 / cellSize))*cellSize;
	head.y = Math.round((canvas.height() / 2 / cellSize))*cellSize;
	setInterval(mainLoop, 200);
});

function advancePosition() {
	head = { x: head.x + dir.x, y: head.y + dir.y};
}

function placeFruit() {
	if (fruits.length > 1)
		return;
	var fruit = {x:0, y:0, type: 'lemon'};
	fruit.x = Math.round((Math.random()*canvas.width() / cellSize))*cellSize;
	fruit.y = Math.round((Math.random()*canvas.height() / cellSize))*cellSize;
	fruits.push(fruit);
}

function mainLoop() {
	advancePosition();
	placeFruit();
	//if (hitWall())
	//{
	//	gameOver();
	//	clearInverval();
	//}	
	ctx.clearRect(0,0, canvas.width(), canvas.height());
	//draw fruits
	for(var id in fruits) 	{
		var fruit = fruits[id];
		ctx.drawImage(jQuery('#'+fruit.type).get(0), fruit.x,fruit.y);
	}
	//draw snake	
	ctx.beginPath();
	ctx.arc(head.x, head.y, cellSize, 0, 2*Math.PI, false);
	ctx.fillStyle = "#8ED6FF";
	ctx.fill();
	ctx.lineWidth = 3;
	ctx.strokeStyle = "black";
	ctx.stroke();
}