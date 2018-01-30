var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var code = location.pathname.substring(1);
var socket;

var state = "title screen";
var socket = io.connect("/");

var draw = function() {
	ctx.fillStyle = "#EEEEEE";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#000000";
	ctx.font = "40px Arial";
	var y = 120;
	var msg = "Connect on your phones.";
	ctx.fillText(msg, window.innerWidth/2 - ctx.measureText(msg).width/2, y);

	y += 40;
	ctx.font = "20px Arial";
	msg = "Your code is " + code;
	ctx.fillText(msg, window.innerWidth/2 - ctx.measureText(msg).width/2, y);
};
var resize = function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	draw();
};
var gameLoop = function() {
	requestAnimationFrame(gameLoop);
};
$(document).ready(function() {
	resize();
	window.addEventListener("resize", resize);
	requestAnimationFrame(gameLoop);
	socket.emit("server connect", { code: code });
	socket.on("new player", function(player) {
		console.log("NEW PLAYER", player);
	});
});