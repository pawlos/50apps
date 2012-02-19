/* logic for sockets networking */
var connection = new WebSocket('ws://localhost:8181/chat');
connection.onopen = function () {	
};

connection.onmessage = function (e) {
	console.log('Server: ',e.data);
};

function sendNote(note) {
	connection.send(JSON.stringify(note));
}
