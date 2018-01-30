var code = location.pathname.substring(3);
var socket;

var state = "title screen";
var socket = io.connect("/");

var name;

$.fn.drawTouch = function() {
	$(this)[0].moves = [];
	var x, y;
	var ctx = $(this).children("canvas").get(0).getContext("2d");
	var start = function(e) {
		e = e.originalEvent;
		ctx.beginPath();
		x = e.changedTouches[0].pageX - $(this).offset().left;
		y = e.changedTouches[0].pageY - $(this).offset().top;
		ctx.moveTo(x, y);
	};
	var move = function(e) {
		e.preventDefault();
		e = e.originalEvent;
		x = e.changedTouches[0].pageX - $(this).offset().left;
		y = e.changedTouches[0].pageY - $(this).offset().top;
		ctx.lineTo(x, y);
		ctx.stroke();
		$(this)[0].moves.push([x, y]);
	}
	$(this).on("touchstart", start);
	$(this).on("touchmove", move);
};

$(document).ready(function() {
	$(".drawing_canvas").drawTouch();

	socket.emit("client connect", { code: code });
	socket.on("no room exists", function() {
		$("#no_room_exists").show();
	});
	socket.on("ask for name", function() {
		$("#enter_your_name").show();
	});
	window.player_name = function() {
		name = $("#player_name").val();
		if (name == null || name.trim().length == 0) {
			alert("Please enter a name.");
			return false;
		}
		$("#enter_your_name").hide();
		$("#draw_your_pfp").show();
		return false;
	};
	window.player_pfp = function() {
		var pfp = $("#player_pfp")[0].moves;
		socket.emit("client name and pfp", { name: name, pfp: pfp });
	};
});