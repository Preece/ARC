var Shaft = new Phaser.State();

Shaft.preload = function() {
	
    game.load.atlasJSONHash('player', 'Art/player.png', 'Art/player.json');
    //game.load.image('fluff', 'Data/Fluff.png');

    //game.load.image('player', 'Art/Character/Test_Pose.png');
    game.load.image('background', 'Art/Environment/Background_Placeholder_1.png');

}

var player;
var hookDaemon;
var hookConstraint = null;

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

    player.animations.add('idle', ['IdleToShock0000'], 14, true, false);
    player.animations.add('swing', ['PullLoop0000', 'PullLoop0001', 'PullLoop0002', 'PullLoop0003', 'PullLoop0004', 'PullLoop0005', 'PullLoop0006', 'PullLoop0007', 'PullLoop0008'], 14, true, false);
    player.animations.add('idle', ['IdleToShock0000'], 14, true, false);
    player.animations.play('swing');

    player.body.x = game.width / 2;
    player.body.y = 9500;
    //player.body.debug = true;

    hookDaemon = game.add.sprite(0, 0, null);
    game.physics.p2.enable(hookDaemon);
    hookDaemon.body.static = true;
    hookDaemon.body.setRectangle(0, 0, 20, 20);
    hookDaemon.body.debug = true;

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

        hookDaemon.body.x = game.input.worldX;
        hookDaemon.body.y = game.input.worldY;

        if(game.input.worldX < player.body.x)
            player.scale.x = 1;
        else
            player.scale.x = -1;
    };

    game.input.mouse.mouseUpCallback = function(event) {
        if(player.body.velocity.y < 0)
            player.body.velocity.y *= 1.5;
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

    if(player.body.velocity.x >= 0) {
        player.scale.x = -1;
    } else {
        player.scale.x = 1;
    }

    //  only move when you click
    if (game.input.mousePointer.isDown && this.energy > 0 && !this.connectionBroke)
    {
        //later this will depend on whether or not they clicked on a magnet
        this.hooked = true;

        //var speed = 2000 / Util.distanceBetween(player.body, this.clickSpot);
        var speed = 1 / Util.distanceBetween(player.body, this.clickSpot);
        speed *= 4000;

        if(Util.distanceBetween(player.body, hookDaemon.body) < 100 && hookConstraint === null) {
            hookConstraint = game.physics.p2.createDistanceConstraint(player, hookDaemon, 100);
        }

        Util.accelerateToPoint(player, this.clickSpot, 9000);

        if(Util.distanceBetween(player.body, this.clickSpot) < 50) {
            player.body.force.x = 0;
            player.body.force.y = 0;
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
        }

    } else if(this.energy <= 0) {
        this.connectionBroke = true;
        this.hooked = false;

        if(hookConstraint !== null) {
            game.physics.p2.removeConstraint(hookConstraint);
            hookConstraint = null;
        }
    } else {
        this.hooked = false;

        if(hookConstraint !== null) {
            game.physics.p2.removeConstraint(hookConstraint);
            hookConstraint = null;
        }
    }

    //console.log('Force: ' + player.body.velocity.y);

    if(game.time.now > this.energyTicker) {

        if(this.hooked === true) {
            //this.energy -= 2;
        } else {
            this.energy += 2;
        }

        this.energyTicker = game.time.now + 100;
    }
    if(this.energy > 100) this.energy = 100;
    if(this.energy < 0) this.energy = 0;

    if(this.hooked) {
        game.physics.p2.gravity.y = 3000;
    } else {
        game.physics.p2.gravity.y = 5000;
    }

    Util.constrainVelocity(player, 250);

    /*if(player.body.x < 200) {
        player.body.x = 200;
        player.body.rotation = 0;
    }

    if(player.body.x > 1700) {
        player.body.x = 1700;
        player.body.rotation = 0;
    }*/
};

Shaft.render = function() {

};

Shaft.Restart = function() {
   
};