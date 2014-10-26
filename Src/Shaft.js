var Shaft = new Phaser.State();

Shaft.preload = function() {
	
    game.load.atlasJSONHash('player', 'Art/player.png', 'Art/player.json');
    //game.load.image('fluff', 'Data/Fluff.png');

    //game.load.image('player', 'Art/Character/Test_Pose.png');
    game.load.image('background', 'Art/Environment/Background_Placeholder_1.png');

}

var lightningCanvas;
var lightningImage;
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
    player.animations.add('initiate', ['IdleToShock0000', 'IdleToShock0001', 'IdleToShock0002', 'IdleToShock0003', 'IdleToShock0004', 'IdleToShock0005', 'IdleToShock0006', 'IdleToShock0007', 'IdleToShock0008', 'IdleToShock0009'], 20, false, false);
    player.animations.add('initiate_to_swing', ['ShockToPull0000', 'ShockToPull0001', 'ShockToPull0002', 'ShockToPull0003', 'ShockToPull0004'], 20, false, false);
    player.animations.play('idle');

    player.body.x = game.width / 2;
    player.body.y = 9800;
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

        if(player.animations.currentAnim.name === 'idle') {
            player.animations.play('initiate');
            return;
        }

        if(player.animations.currentAnim.name === 'initiate') {
            return;
        }
    };

    game.input.mouse.mouseUpCallback = function(event) {
        if(player.body.velocity.y < 0)
            player.body.velocity.y *= 1.5;
    };

    this.distText = game.add.text(50, 50, '', {font: "40px Arial", fill: "#ff0044"});
    this.distText.fixedToCamera = true;

    lightningCanvas = game.make.bitmapData(1920, 1080);
    lightningImage = lightningCanvas.addToWorld();
    lightningImage.fixedToCamera = true;
};

Shaft.update = function() {
    if(player.animations.currentAnim.name === 'initiate' && !player.animations.currentAnim.isFinished) {
        return;
    } 

    if(player.animations.currentAnim.name === 'initiate' && player.animations.currentAnim.isFinished) {
        player.animations.play('initiate_to_swing');
    }

    if(player.animations.currentAnim.name === 'initiate_to_swing' && player.animations.currentAnim.isFinished) {
        player.animations.play('swing');
    }

    this.distText.text = 'Energy: ' + this.energy;

    player.body.rotation = 0;

    //  only move when you click
    if (game.input.mousePointer.isDown && this.energy > 0 && !this.connectionBroke)
    {
        //later this will depend on whether or not they clicked on a magnet
        this.hooked = true;

        if(Util.distanceBetween(player.body, hookDaemon.body) < 100 && hookConstraint === null) {
            hookConstraint = game.physics.p2.createDistanceConstraint(player, hookDaemon, 100);
        }

        Util.accelerateToPoint(player, this.clickSpot, 20000);

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
            this.energy -= 2;
        } else {
            this.energy += 2;
        }

        this.energyTicker = game.time.now + 100;
    }
    if(this.energy > 100) this.energy = 100;
    if(this.energy < 0) this.energy = 0;

    if(this.hooked && player.body.velocity.y  < 0) {
        game.physics.p2.gravity.y = 4000;
    } else {
        game.physics.p2.gravity.y = 6000;
    }

    lightningImage.x = game.camera.x;
    lightningImage.y = game.camera.y;

    Util.constrainVelocity(player, 500);
};

Shaft.render = function() {

    lightningCanvas.clear();
    
    if(this.hooked) {
        var xOffset = player.scale.x > 0 ? -50 : 50;
        var yOffset = -20;
        Util.lightningStrike(player.x + xOffset, player.y - game.camera.y + yOffset, this.clickSpot.x, this.clickSpot.y - game.camera.y, "rgba(0,0,255,0.2)", "rgba(255,255,255,1)");
        Util.lightningStrike(player.x + xOffset, player.y - game.camera.y + yOffset, this.clickSpot.x, this.clickSpot.y - game.camera.y, "rgba(0,0,255,1)", "rgba(100,100,255,0.8)");
        Util.lightningStrike(player.x + xOffset, player.y - game.camera.y + yOffset, this.clickSpot.x, this.clickSpot.y - game.camera.y, "rgba(0,0,255,1)", "rgba(100,100,255,0.8)");
        Util.lightningStrike(player.x + xOffset, player.y - game.camera.y + yOffset, this.clickSpot.x, this.clickSpot.y - game.camera.y, "rgba(0,0,255,0.8)", "rgba(100,100,255,0.8)");
        //Util.lightningStrike(player.x + xOffset, player.y - game.camera.y + yOffset, this.clickSpot.x, this.clickSpot.y - game.camera.y, "rgba(0,0,255,0.2)", "rgba(100,100,255,0.8)");
        //Util.lightningStrike(player.x + xOffset, player.y - game.camera.y + yOffset, this.clickSpot.x, this.clickSpot.y - game.camera.y, "rgba(0,0,255,0.2)", "rgba(255,255,255,0.4)");
        //Util.lightningStrike(player.x + xOffset, player.y - game.camera.y + yOffset, this.clickSpot.x, this.clickSpot.y - game.camera.y, "rgba(0,0,255,0.2)", "rgba(255,255,255,0.2)");
    }
};

Shaft.Restart = function() {
   
};