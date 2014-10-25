var Shaft = new Phaser.State();

Shaft.preload = function() {
	
    game.load.atlasJSONHash('player', 'Art/player.png', 'Art/player.json');
    //game.load.image('fluff', 'Data/Fluff.png');

    //game.load.image('player', 'Art/Character/Test_Pose.png');
    game.load.image('background', 'Art/Environment/Background_Placeholder_1.png');

}

var player;

Shaft.create = function() {

    game.add.plugin(Phaser.Plugin.Debug);

    game.world.setBounds(0, 0, 1920, 10000);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 5000;
    //game.time.deltaCap = 0.016;

    game.add.tileSprite(0, 0, 1920, 10000, 'background');

    player = game.add.sprite(100, 100, 'player');
    game.physics.p2.enable(player);
    player.body.setRectangle(50, 210, 5, 10); 
    player.body.mass = 1;

    player.animations.add('swing', ['Test_Pose'], 14, true, false);
    player.animations.play('swing');

    player.body.x = game.width / 2;
    player.body.y = 9500;
    player.body.debug = true;

    game.camera.follow(player);

    this.clickSpot = {};
    this.clickSpot.x = 0;
    this.clickSpot.y = 0;

    this.energy = 100;
    this.energyTicker = 0;

    this.hooked = false;
    this.connectionBroke = false;
    this.hookSpring = null;

    game.input.mouse.mouseDownCallback = function(event) {
        Shaft.clickSpot.x = game.input.worldX;
        Shaft.clickSpot.y = game.input.worldY;
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

    player.body.rotation = 0;

    //  only move when you click
    if (game.input.mousePointer.isDown && this.energy > 0 && !this.connectionBroke)
    {
        //later this will depend on whether or not they clicked on a magnet
        this.hooked = true;

        //var speed = 2000 / Util.distanceBetween(player.body, this.clickSpot);
        var speed = 1 / Util.distanceBetween(player.body, this.clickSpot);
        speed *= 2000;

        Util.accelerateToPoint(player, this.clickSpot, 3000 * speed);

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

    //console.log('Force: ' + player.body.velocity.y);

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

    Util.constrainVelocity(player, 100);
};

Shaft.render = function() {

};

Shaft.Restart = function() {
   
};