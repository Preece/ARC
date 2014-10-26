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
	},

	constrainVelocity: function(sprite, maxVelocity) {
		var body = sprite.body
		var angle, currVelocitySqr, vx, vy;

		vx = body.data.velocity[0];
		vy = body.data.velocity[1];

		currVelocitySqr = vx * vx + vy * vy;

		if (currVelocitySqr > maxVelocity * maxVelocity) {
			angle = Math.atan2(vy, vx);

			vx = Math.cos(angle) * maxVelocity;
			vy = Math.sin(angle) * maxVelocity;

			body.data.velocity[0] = vx;
			body.data.velocity[1] = vy;
		}
	},

	lightningStrike: function(x1, y1, x2, y2, color1, color2) {
		var x = x2 - x1;
		var y = y2 - y1;
		var segments = 50;
		var distance = Math.sqrt(x * x + y * y);
		var width = distance / segments;
		var prevX = x1;
		var prevY = y1;
		//width = width || 1;
		
		for(var i = 0; i <= segments; i++) {
			var magnitude = (width * i) / distance;

			var x3 = magnitude * x2 + (1 - magnitude) * x1;
			var y3 = magnitude * y2 + (1 - magnitude) * y1;
			
			if(i !== 0 && i !== segments) {
				x3 += (Math.random() * width) - (width / 2);
				y3 += (Math.random() * width) - (width / 2);
			}
			
			// Draw line
			lightningCanvas.context.strokeStyle = color1;
			lightningCanvas.context.lineWidth = 1;
			lightningCanvas.context.beginPath();
			lightningCanvas.context.moveTo(prevX, prevY);
			lightningCanvas.context.lineTo(x3, y3);
			lightningCanvas.context.closePath();
			lightningCanvas.context.stroke();
						
			// Draw point
			lightningCanvas.context.strokeStyle = color1;
			lightningCanvas.context.fillStyle = color1;
			lightningCanvas.context.beginPath();
			lightningCanvas.context.arc(x3, y3, 1, 0, 2 * Math.PI, false);
			lightningCanvas.context.fill();
			
			// Draw line
			lightningCanvas.context.strokeStyle = color2;
			lightningCanvas.context.lineWidth = 2;
			lightningCanvas.context.beginPath();
			lightningCanvas.context.moveTo(prevX, prevY);
			lightningCanvas.context.lineTo(x3, y3);
			lightningCanvas.context.closePath();
			lightningCanvas.context.stroke();
						
			// Draw point
			lightningCanvas.context.strokeStyle = color2;
			lightningCanvas.context.fillStyle = color2;
			lightningCanvas.context.beginPath();
			lightningCanvas.context.arc(x3, y3, 1, 0, 2 * Math.PI, false);
			lightningCanvas.context.fill();
			
			prevX = x3;
			prevY = y3;
		}
	}
};