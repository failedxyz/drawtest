var express = require("express");
var http = require("http");
var md5 = require("md5");

var app = express();
var server = new http.Server(app);
var io = require("socket.io")(server);

var games = {};
var randomString = function(length) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

app.get("/", function(req, res, next) {
	var code = randomString(5);
	return res.redirect("/" + code);
});
app.use(express.static("public"));
app.use("/p", function(req, res, next) {
	return res.sendfile("public/play.html");
});
app.use(function(req, res, next) {
	return res.sendfile("public/index.html");
});

io.on("connection", function(socket) {
	var client = {};
	socket.on("server connect", function(data) {
		if (data.code in games) return socket.emit("room already taken");
		games[data.code] = {
			server: socket,
			code: data.code,
			players: {}
		};
	});
	socket.on("client connect", function(data) {
		if (data.code in games) {
			client.code = data.code;
			client.socket = socket;
			socket.emit("ask for name");
		} else {
			socket.emit("no room exists");
		}
	});
	socket.on("client name and pfp", function(data) {
		var firstPlayer = Object.keys(games[client.code].players).length == 0;
		client.id = md5(data.name);
		client.name = data.name;
		client.pfp = data.pfp;
		games[client.code].players[client.id] = {
			code: client.code,
			socket: client.socket
		};
		games[client.code].players[client.id].id = client.id;
		games[client.code].players[client.id].name = client.name;
		games[client.code].players[client.id].pfp = client.pfp;
		games[client.code].server.emit("new player", { name: client.name, pfp: client.pfp });
		if (firstPlayer) {
			socket.emit("press start to start");
		} else {
			socket.emit("waiting for game start");
		}
	});
});

server.listen(4000, function() {
	console.log("Listening...");
});