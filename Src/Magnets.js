/*Magnets = [

{ x: 110, y: 19560},
{ x: 729, y: 19462},
{ x: 347, y: 19033},
{ x: 224, y: 19290},
{ x: 201, y: 18819},
{ x: 750, y: 18745},
{ x: 430, y: 18530},
{ x: 165, y: 18242},
{ x: 615, y: 17945},
{ x: 202, y: 17880},
{ x: 225, y: 17375},
{ x: 415, y: 17024},
{ x: 290, y: 16435},
{ x: 700, y: 16416},
{ x: 260, y: 16180},
{ x: 340, y: 15526},
{ x: 475, y: 14948},
{ x: 365, y: 14304},
{ x: 100, y: 13804},
{ x: 850, y: 13504},
{ x: 200, y: 13204},
{ x: 450, y: 12804},
{ x: 365, y: 12004},
{ x: 50, y: 12304},
{ x: 700, y: 11904},
{ x: 500, y: 11494},
{ x: 500, y: 10594},
{ x: 500, y: 9794}
];*/

//the initial two magnets will always be the same
Magnets = [
	{ x: 110, y: 19560},
	{ x: 729, y: 19462}
];

(function GenerateMagnets() {
	//the algorithm will vary the distance from the previously placed magnet
	//within a growing median distance and variance

	for(var i = 0; i < 1000; i++) {
		var pX = Magnets[Magnets.length - 1].x;
		var pY = Magnets[Magnets.length - 1].y;

		//the distance should start around 400 and grow from there
		var newX = Math.random() * 960;
		var newY = pY - (200 * Math.random()) - 200 - (i * Math.random());

		Magnets.push({x: newX, y: newY});
	}

})();

function PosOnMagnet(x, y) {
	var onTheMag = false;

	Magnets.forEach(function(m) {
		if(x > m.x && y > m.y && x < m.x + 100 && y < m.y + 100) {
			onTheMag = true;
			m.sprite.animations.play('active');
		}
	});

	console.log('{ x: ' + x + ', y: '+ y + '},');
	return onTheMag;
	//return true;
};

function ShutOffMagnets() {
	Magnets.forEach(function(m) {
		m.sprite.animations.play('inactive');
	});
};