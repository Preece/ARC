var Util = {
	accelerateToPoint: function(player, x, y, speed) {
	    if (typeof speed === 'undefined') { speed = 60; }

	    var angle = Math.atan2(destination.y - player.y, destination.x - player.x);
	    //player.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
	    player.body.force.x = Math.cos(angle) * speed;    
	    player.body.force.y = Math.sin(angle) * speed;
	}
};