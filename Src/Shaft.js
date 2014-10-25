var Shaft = new Phaser.State();

Shaft.preload = function() {
	
    //game.load.atlasJSONHash('Frauki', 'Data/Frauki/Frauki.png', 'Data/Frauki/Frauki.json');
    //game.load.image('fluff', 'Data/Fluff.png');

    game.load.image('player', 'Data/standin.png');

}

var player;

Shaft.create = function() {

    game.add.plugin(Phaser.Plugin.Debug);

	game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 2000;
    //game.time.deltaCap = 0.016;

    player = game.add.sprite(100, 100, 'player');
    game.physics.p2.enable(player);

    player.body.x = game.width / 2;
    player.body.debug = true;

    this.clickSpot = {};
    this.clickSpot.x = 0;
    this.clickSpot.y = 0;

    this.energy = 100;
    this.energyTicker = 0;

    this.hooked = false;
    this.connectionBroke = false;

    game.input.mouse.mouseDownCallback = function(event) {
        Shaft.clickSpot.x = game.input.x;
        Shaft.clickSpot.y = game.input.y;
        Shaft.connectionBroke = false;
    };

    /*
    //  Make things a bit more bouncey
    game.physics.p2.defaultRestitution = 0.8;

    //  Enable if for physics. This creates a default rectangular body.
    game.physics.p2.enable(sprite);

    //  Modify a few body properties
    sprite.body.setZeroDamping();
    sprite.body.fixedRotation = true;
    */

    this.distText = game.add.text(50, 50, '', {font: "40px Arial", fill: "#ff0044"});
    this.distText.fixedToCamera = true;
};

Shaft.update = function() {
    this.distText.text = 'Energy: ' + this.energy;

    //  only move when you click
    if (game.input.mousePointer.isDown && this.energy > 0 && !this.connectionBroke)
    {
        //later this will depend on whether or not they clicked on a magnet
        this.hooked = true;

        //var speed = 2000 / Util.distanceBetween(player.body, this.clickSpot);
        var speed = 1 / Util.distanceBetween(player.body, this.clickSpot);
        speed *= 1000;

        //console.log('Force: ' + 2000 * speed);

        Util.accelerateToPoint(player, this.clickSpot, 2000 * speed);
        if(Util.distanceBetween(player.body, this.clickSpot) < 50) {
            player.body.force.x = 0;
            player.body.force.y = 0;
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
        }

    } else if(this.energy <= 0) {
        this.connectionBroke = true;
        this.hooked = false;
    } else {
        this.hooked = false;
    }

    if(game.time.now > this.energyTicker) {

        if(this.hooked === true) {
            this.energy -= 2;
        } else {
            this.energy += 2;
        }

        this.energyTicker = game.time.now + 100;
    }
    if(this.energy > 100) this.energy = 100;
    if(this.energy < 0) this.energy = 0;
};

Shaft.render = function() {

};

Shaft.Restart = function() {
   
};