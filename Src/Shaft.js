var Shaft = new Phaser.State();

Shaft.preload = function() {
	
    game.load.atlasJSONHash('player', 'Art/player.png', 'Art/player.json');
    //game.load.image('fluff', 'Data/Fluff.png');

    //game.load.image('player', 'Art/Character/Test_Pose.png');
    game.load.image('background', 'Art/Environment/Background_Tile_1.png');
    game.load.atlasJSONHash('magnet', 'Art/Magnet.png', 'Art/Magnet.json');
    game.load.atlasJSONHash('UI', 'Art/UI.png', 'Art/UI.json');
    game.load.atlasJSONHash('foreground', 'Art/Foreground.png', 'Art/Foreground.json');

    game.load.image('title', 'Art/Environment/Title.png');

};

var lightningCanvas;
var lightningImage;
var player;
var hookDaemon;
var hookConstraint = null;

var indicator;
var fgElems = [];

var cameraDaemon;
var cameraTween;

Shaft.create = function() {

    //game.add.plugin(Phaser.Plugin.Debug);

    game.world.setBounds(0, 0, 960, 20000);
    game.physics.startSystem(Phaser.Physics.P2JS);
    //game.physics.p2.gravity.y = 0;
    //game.time.deltaCap = 0.016;

    game.add.tileSprite(0, 0, 960, 20000, 'background');
    game.add.image(0, 19460, 'title');

    //add the numbers
    for(var i = 1; i < 100; i++) {
    	var tens = Math.floor(i / 10);
    	var ones = i % 10;
        game.add.image(390, 20000 - (i * 1250), 'UI', 'Floor_' + tens);
        game.add.image(490, 20000 - (i * 1250), 'UI', 'Floor_' + ones);
    }

    //add the indicator
    indicator = game.add.sprite(50, 50, 'magnet');
    indicator.x = Magnets[0].x + 80;
    indicator.y = Magnets[0].y - 55;
    indicator.animations.add('flashing', ['RedCircle_2', 'RedCircle_3', 'RedCircle_4'], 5, true, false);
    indicator.play('flashing');
    indicator.anchor.x = 0.5;
    indicator.scale.x = -1;


    //set up the magnets
    Magnets.forEach(function(m) {
        m.sprite = game.add.sprite(50, 50, 'magnet');
        m.sprite.x = m.x;
        m.sprite.y = m.y;
        
        if(m.sprite.x < 200) {
            m.sprite.animations.add('inactive', ['Magnet_Angle_Inactive'], 14, false, false);
            m.sprite.animations.add('active', ['Magnet_Angle_Active_1', 'Magnet_Angle_Active_2', 'Magnet_Angle_Active_3'], 10, true, false);

            m.sprite.scale.x = -1;
            m.sprite.anchor.setTo(1, 0);
        } else if(m.sprite.x > 680) {
            m.sprite.animations.add('inactive', ['Magnet_Angle_Inactive'], 14, false, false);
            m.sprite.animations.add('active', ['Magnet_Angle_Active_1', 'Magnet_Angle_Active_2', 'Magnet_Angle_Active_3'], 10, true, false);
        } else {
            m.sprite.animations.add('inactive', ['Magnet_Front_Inactive'], 14, true, false);
            m.sprite.animations.add('active', ['Magnet_Front_Active_1', 'Magnet_Front_Active_2', 'Magnet_Front_Active_3'], 10, true, false);

        }

        m.sprite.play('inactive');
    });

    this.batteryGreen = game.add.image(0, 0, 'UI', 'Battery_Green');
    this.batteryGreen.fixedToCamera = true;
    this.batteryGreen.cameraOffset.y = 905;
    this.batteryGreen.cameraOffset.x = 27;
    this.batteryRed = game.add.image(0, 0, 'UI', 'Battery_Red');
    this.batteryRed.fixedToCamera = true;
    this.batteryRed.visible = false;
    this.batteryRed.cameraOffset.y = 905;
    this.batteryRed.cameraOffset.x = 27;
    this.battery = game.add.image(0, 0, 'UI', 'Battery_Border');
    this.battery.fixedToCamera = true;
    this.battery.cameraOffset.y = 900;
    this.battery.cameraOffset.x = 10;

    player = game.add.sprite(100, 100, 'player');
    game.physics.p2.enable(player);
    player.body.setRectangle(25, 105, 5, 10); 
    player.body.mass = 1;

    player.animations.add('idle', ['IdleToShock/IdleToShock0000'], 
        14, true, false);
    player.animations.add('swing', ['PullLoop/PullLoop_2D0000', 'PullLoop/PullLoop_2D0001', 'PullLoop/PullLoop_2D0002', 'PullLoop/PullLoop_2D0003', 'PullLoop/PullLoop_2D0004', 'PullLoop/PullLoop_2D0005', 'PullLoop/PullLoop_2D0006', 'PullLoop/PullLoop_2D0007'], 
        14, true, false);
    player.animations.add('initiate', ['IdleToShock/IdleToShock0000', 'IdleToShock/IdleToShock0001', 'IdleToShock/IdleToShock0002', 'IdleToShock/IdleToShock0003', 'IdleToShock/IdleToShock0004', 'IdleToShock/IdleToShock0005', 'IdleToShock/IdleToShock0006', 'IdleToShock/IdleToShock0007', 'IdleToShock/IdleToShock0008', 'IdleToShock/IdleToShock0009'], 
        14, false, false);
    player.animations.add('initiate_to_swing', ['ShockToPull/ShockToPull0000', 'ShockToPull/ShockToPull0001', 'ShockToPull/ShockToPull0002', 'ShockToPull/ShockToPull0003', 'ShockToPull/ShockToPull0004'], 
        14, false, false);
    player.animations.add('swing_to_jump', ['PullRelease/PullRelease_2D0000', 'PullRelease/PullRelease_2D0001', 'PullRelease/PullRelease_2D0002', 'PullRelease/PullRelease_2D0003', 'PullRelease/PullRelease_2D0004', 'PullRelease/PullRelease_2D0005'], 
        20, false, false);
    player.animations.add('jump', ['PullRelease/PullRelease_2D0005'], 
        14, true, false);
    player.animations.add('jump_to_fall', ['UpToDown/UpToDown_2D0000', 'UpToDown/UpToDown_2D0001', 'UpToDown/UpToDown_2D0002', 'UpToDown/UpToDown_2D0003', 'UpToDown/UpToDown_2D0004'], 
        14, false, false);
    player.animations.add('fall', ['DownLoop/DownLoop0000', 'DownLoop/DownLoop0001', 'DownLoop/DownLoop0002', 'DownLoop/DownLoop0003', 'DownLoop/DownLoop0004'], 
        14, true, false);
    player.animations.add('jump_to_swing', ['UpToPull/UpToPull_2D0000', 'UpToPull/UpToPull_2D0001', 'UpToPull/UpToPull_2D0002', 'UpToPull/UpToPull_2D0003', 'UpToPull/UpToPull_2D0004', 'UpToPull/UpToPull_2D0005', 'UpToPull/UpToPull_2D0006'],
        20, false, false);

    player.animations.play('idle');

    player.body.x = game.width / 2;
    player.body.y = 19950;
    //player.body.debug = true;

    hookDaemon = game.add.sprite(0, 0, null);
    game.physics.p2.enable(hookDaemon);
    hookDaemon.body.static = true;
    hookDaemon.body.setRectangle(0, 0, 20, 20);
    hookDaemon.body.debug = true;

    cameraDaemon = game.add.sprite(0, player.body.y, null);
    game.physics.p2.enable(cameraDaemon);
    cameraDaemon.body.static = true;

    game.camera.follow(cameraDaemon);

    this.clickSpot = {};
    this.clickSpot.x = 0;
    this.clickSpot.y = 0;

    this.energy = 100;
    this.energyTicker = 0;

    this.hooked = false;
    this.connectionBroke = false;
    this.hookSpring = null;

    game.input.mouse.mouseDownCallback = function(event) {
        if(!PosOnMagnet(game.input.worldX, game.input.worldY)) {
            Shaft.hooked = false;
            return;
        } else {
            if(player.animations.currentAnim.name === 'jump') {
                player.animations.play('jump_to_swing');
            } else {
                player.animations.play('swing');
            }

            Shaft.hooked = true;
        }

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
        if(player.body.velocity.y < 0) {
            player.body.velocity.y *= 1.1;
        }
        //if they were hooked on, play the transition animation
        if(Shaft.hooked) {
            player.animations.play('swing_to_jump');
            ShutOffMagnets();
        }

        Shaft.hooked = false;
    };

    lightningCanvas = game.make.bitmapData(960, 1080);
    lightningImage = lightningCanvas.addToWorld();
    lightningImage.fixedToCamera = true;


    var fgPos = 18000;
    for(var i = 0; i < 30; i++) {
    	var rand = Math.random() * 4;
    	var elem;

    	if(rand > 3) {
    		elem = game.add.image(0, fgPos, 'foreground', 'Foreground_1');
    	} else if(rand > 2) {
    		elem = game.add.image(0, fgPos, 'foreground', 'Foreground_1');
    		elem.anchor.x = 1;
    		elem.scale.x = -1;
    	} else if(rand > 1) {
    		elem = game.add.image(0, fgPos, 'foreground', 'Foreground_2');
    	} else {
    		elem = game.add.image(0, fgPos, 'foreground', 'Foreground_2');
    		elem.anchor.x = 1;
    		elem.scale.x = -1;
    	}

    	fgPos -= 3000 * Math.random() + 750;
    	fgElems.push(elem);
    }

    cameraTween = game.add.tween(cameraDaemon.body);

};

Shaft.update = function() {

	var yDiff = cameraDaemon.body.y;

    cameraDaemon.body.x = 0;
    cameraDaemon.body.y = player.body.y - 200;
    cameraTween.to({y: player.body.y - 200 + (player.body.velocity.y / 7)}, 200, Phaser.Easing.Linear.None, true);
    //cameraDaemon.body.y = ;
    player.body.rotation = 0;

    yDiff -= cameraDaemon.body.y;
    yDiff /= 3;

    for(var i = 0; i < fgElems.length; i++) {
    	fgElems[i].y += yDiff;
    }

    if(player.animations.currentAnim.name === 'initiate' && !player.animations.currentAnim.isFinished) {
        return;
    } 

    if(player.animations.currentAnim.name === 'initiate' && player.animations.currentAnim.isFinished) {
        player.animations.play('initiate_to_swing');
    }

    if(player.animations.currentAnim.name === 'initiate_to_swing' && player.animations.currentAnim.isFinished) {
        player.animations.play('swing');
    }

    if(player.animations.currentAnim.name === 'swing_to_jump' && player.animations.currentAnim.isFinished) {
        player.animations.play('jump');
    }

    if(player.animations.currentAnim.name === 'jump' && player.body.velocity.y >= -50) {
        player.animations.play('jump_to_fall');
    }

    if(player.animations.currentAnim.name === 'jump_to_fall' && player.animations.currentAnim.isFinished) {
        player.animations.play('fall');
    }

    if(player.animations.currentAnim.name === 'jump_to_swing' && player.animations.currentAnim.isFinished) {
        player.animations.play('swing');
    }

    //  only move when you click
    if (this.hooked && this.energy > 0 && !this.connectionBroke)
    {
        //later this will depend on whether or not they clicked on a magnet
        //this.hooked = true;

        var distance = Util.distanceBetween(player.body, hookDaemon.body);

        if(distance < 30 && hookConstraint === null) {
            hookConstraint = game.physics.p2.createDistanceConstraint(player, hookDaemon, 30);
        }

        Util.accelerateToPoint(player, this.clickSpot, 4000);

    } else if(this.energy <= 0) {
        this.connectionBroke = true;
        //this.hooked = false;

        if(hookConstraint !== null) {
            game.physics.p2.removeConstraint(hookConstraint);
            hookConstraint = null;
        }
    } else {
        //this.hooked = false;

        if(hookConstraint !== null) {
            game.physics.p2.removeConstraint(hookConstraint);
            hookConstraint = null;
        }
    }

    if(game.time.now > this.energyTicker) { 

        if(this.hooked === true) {
            var dist = Util.distanceBetween(player.body, hookDaemon.body);
            //this.energy -= 1.5 + (7 * (dist / 2000));
        } else {
            this.energy += 2.5;
        }

        this.energyTicker = game.time.now + 100;
    }
    if(this.energy > 100) this.energy = 100;
    if(this.energy < 0) this.energy = 0;

    if(this.hooked && player.body.velocity.y < 0) {
        game.physics.p2.gravity.y = 1500;
    } else {
        game.physics.p2.gravity.y = 1750;
    }

    lightningImage.x = game.camera.x;
    lightningImage.y = game.camera.y;

    Util.constrainVelocity(player, 200);

    if(this.energy < 33) {
        this.batteryRed.visible = true;
        this.batteryGreen.visible = false;
    } else {
        this.batteryRed.visible = false;
        this.batteryGreen.visible = true;
    }

    this.batteryRed.scale.x = this.energy / 100;
    this.batteryGreen.scale.x = this.energy / 100;

    if(player.body.y > 19925 && player.animations.currentAnim.name === 'fall') {
        player.animations.play('idle');
        player.body.velocity.x = 0;
    }
};

Shaft.render = function() {

    lightningCanvas.clear();
    
    if(this.hooked && !this.connectionBroke) {
        var xOffset = player.scale.x > 0 ? -35 : 35;
        var yOffset = -25;
        Util.crazyLightning(player.x + xOffset, player.y - game.camera.y + yOffset, this.clickSpot.x, this.clickSpot.y - game.camera.y, "rgba(0,0,255,0.8)", "rgba(255,255,255,1)");
       /* Util.crazyLightning(player.x + xOffset, player.y - game.camera.y + yOffset, this.clickSpot.x, this.clickSpot.y - game.camera.y, "rgba(0,0,255,0.3)", "rgba(0,0,255,0.2)");
        Util.crazyLightning(player.x + xOffset, player.y - game.camera.y + yOffset, this.clickSpot.x, this.clickSpot.y - game.camera.y, "rgba(0,0,255,0.3)", "rgba(0,0,255,0.2)");*/
    }
};

Shaft.Restart = function() {
   
};