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
    game.physics.p2.gravity.y = 500;
    //game.time.deltaCap = 0.016;

    player = game.add.sprite(100, 100, 'player');
    game.physics.p2.enable(player);

    player.body.x = game.width / 2;
    player.body.debug = true;

    this.clickSpot.x = 0;
    this.clickSpot.y = 0;

    /*
    //  Make things a bit more bouncey
    game.physics.p2.defaultRestitution = 0.8;

    //  Enable if for physics. This creates a default rectangular body.
    game.physics.p2.enable(sprite);

    //  Modify a few body properties
    sprite.body.setZeroDamping();
    sprite.body.fixedRotation = true;
    */
};

Shaft.update = function() {

};

Shaft.render = function() {

};

Shaft.Restart = function() {
   
};