Magnets = [

{ x: 220, y: 9160},
{ x: 1458, y: 8862},
{ x: 1498, y: 7445},
{ x: 1568, y: 2104},
{ x: 932, y: 5945},
{ x: 838, y: 4124},
{ x: 1400, y: 2816},
{ x: 518, y: 2380},
{ x: 686, y: 526},
{ x: 450, y: 8590},
{ x: 694, y: 8033},
{ x: 402, y: 7619},
{ x: 864, y: 7130},
{ x: 330, y: 6442},
{ x: 404, y: 5780},
{ x: 458, y: 4775},
{ x: 586, y: 2935}
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