Magnets = [
	{
		x: 500,
		y: 9500
	},
	{
		x: 0,
		y: 0
	},
	{
		x: 0,
		y: 0
	},
	{
		x: 0,
		y: 0
	},
	{
		x: 0,
		y: 0
	},
	{
		x: 0,
		y: 0
	},
	{
		x: 0,
		y: 0
	},
	{
		x: 0,
		y: 0
	},
	{
		x: 0,
		y: 0
	},
	{
		x: 0,
		y: 0
	},
	{
		x: 0,
		y: 0
	}
];

function PosOnMagnet(x, y) {
	var onTheMag = false;

	Magnets.forEach(function(m) {
		if(x > m.x && y > m.y && x < m.x + 50 && y < m.y + 50)
			onTheMag = true;
	});

	return onTheMag;
};