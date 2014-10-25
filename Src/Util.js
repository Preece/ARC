var Util = {
	accelerateToPoint: function(player, destination, speed) {
	    if (typeof speed === 'undefined') { speed = 60; }

	    var angle = Math.atan2(destination.y - player.y, destination.x - player.x);
	    //player.body.rotation = angle + game.math.degToRad(90); 
	    player.body.force.x = Math.cos(angle) * speed;    
	    player.body.force.y = Math.sin(angle) * speed;
	},

	distanceBetween: function(point1, point2) {
		var distX = point1.x - point2.x;
	    var distY = point1.y - point2.y;

	    return Math.sqrt(distX * distX + distY * distY);
	}
};