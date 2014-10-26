Magnets = [

{ x: 220, y: 39160},
{ x: 1458, y: 38862},
{ x: 694, y: 38033},
{ x: 450, y: 38590},
{ x: 402, y: 37619},
{ x: 1498, y: 37445},
{ x: 864, y: 37130},
{ x: 330, y: 36442},
{ x: 1232, y: 35945},
{ x: 404, y: 35780},
{ x: 458, y: 34775},
{ x: 838, y: 34124},
{ x: 586, y: 32935},
{ x: 1400, y: 32816},
{ x: 1568, y: 32104},
{ x: 518, y: 32380},
{ x: 686, y: 31026},
{ x: 954, y: 29848}


];

function PosOnMagnet(x, y) {
	var onTheMag = false;

	Magnets.forEach(function(m) {
		if(x > m.x && y > m.y && x < m.x + 200 && y < m.y + 200) {
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