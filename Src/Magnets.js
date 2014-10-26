Magnets = [

{ x: 320, y: 9160},
{ x: 950, y: 7923},
{ x: 524, y: 7084},
{ x: 1230, y: 6754},
{ x: 1232, y: 6181},
{ x: 938, y: 6610},
{ x: 346, y: 5618},
{ x: 1024, y: 4666},
{ x: 828, y: 4885},
{ x: 1652, y: 9472},
{ x: 1616, y: 9474},
{ x: 1458, y: 8762},
{ x: 1498, y: 7445},
{ x: 1318, y: 7054},
{ x: 784, y: 5697},
{ x: 914, y: 5402},
{ x: 686, y: 4981},
{ x: 772, y: 4677},
{ x: 822, y: 4652},
{ x: 696, y: 4275},
{ x: 944, y: 3465},
{ x: 1048, y: 2528},
{ x: 1568, y: 2104},
{ x: 1238, y: 2207},
{ x: 800, y: 2219},
{ x: 882, y: 1918},
{ x: 1006, y: 1755},
{ x: 1042, y: 953},
{ x: 1094, y: 284}
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