var config = {
    width: 1280,
    height: 720,
    renderer: Phaser.AUTO,
    antialias: false,
    multiTexture: true,
    state: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    game.load.image('ground', 'data/platform.png');
    game.load.spritesheet('tux', 'data/tux.png', 64, 64);
    game.load.spritesheet('coin', 'data/coin.png', 32, 64);
    game.load.spritesheet('effects', 'data/effects.png', 64, 64);
}

// GLOBAL VARIABLES
// Level Config
var backdrop;
var levelLength = Math.floor((Math.random() * 12000)) + 4000; // 4000 min, 16000 max
var canBoost = 500;//Math.floor(levelLength / 3000); // DEBUG
var platforms;
var numCoins;
var cursors;

// Objects
var player;
var coins;
var flames;
var boostBlast;

// Player variables
var movingLeft = false;
var movingRight = false;
var rocketOn = 'right'; // right, left
var boostOnCooldown = false;

// Interface
var score = 0;
var scoreText;
var levelProgressText;
var boostText;
var uiTickRate = 10;
var uiTick = 0;

// GAME CONFIG
function create() {
    game.renderer.setTexturePriority(['tux', 'coin', 'effects', 'ground']);
    
    // Set world bounds
    game.world.setBounds(0, 0, levelLength, 720);
     
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A gradient background
    backdrop = game.add.bitmapData(levelLength, 720);
    backdrop.addToWorld();
    drawBackdrop(0x11315c, 0x48b6cd);
    

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(levelLength / 400, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create some ledges
    var spacer = 100;
    var numOfLedges = Math.floor(levelLength / 12) - (Math.random() * 20);
    
    for (var i = 0; i < numOfLedges; i++) {
        var xPos = spacer;
        var yPos = Math.floor((Math.random() * game.world.height / 1.5) + 1) + 100; // 100 leaves some room at the top of the screen
        
        yPos = Math.min(512, yPos); // Player can walk under the lowest platform

        var ledge = platforms.create(xPos, yPos, 'ground');
        ledge.scale.setTo(Math.min(Math.random() + 0.05, 0.3), Math.random() + 1);
        ledge.body.immovable = true;
        
        spacer += 150 + (Math.random() * 50);
    }

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'tux');
    player.scale.setTo(0.50,0.50);
    
    // Add player animations
    player.animations.add('stand', [6], 10, true);
    player.animations.add('left', [0, 1, 2, 3, 4, 5], 12, true);
    player.animations.add('right', [7, 8, 9, 10, 11, 12], 12, true);
    player.animations.add('jump-right', [13], 10, true);
    player.animations.add('jump-left', [17], 10, true);
    player.animations.add('duck', [21], 10, true);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0;
    player.body.gravity.y = 100;
    player.body.collideWorldBounds = true;

    // Camera follows player
    game.camera.follow(player);
    
    // Effects
    flames = game.add.sprite(player.body.x, player.body.y, 'effects');
    flames.animations.add('flames-right', [4,5,6,5], 12, true);
    flames.animations.add('flames-left',  [7,8,9,8], 12, true);
    
    //  Coins to collect
    coins = game.add.group();

    //  We will enable physics for any coin that is created in this group
    coins.enableBody = true;

    // Add some coins, from end to start
    var coinSpawnZones = Math.floor(levelLength / 64); // 64px wide spawn zones
    
    // Use 66-90% of the possible spawn zones.Max = Math.max(50+40=90, 66)
    numCoins = Math.max(
            Math.floor((Math.random() * coinSpawnZones / 2)) + Math.floor((Math.random() * coinSpawnZones / 2.5)),
            Math.floor((coinSpawnZones / 1.5))
        );
    
    // Choose the spawn zones to use
    spacer = levelLength - 128;
    var coinCount = 0; 
    
    while (coinCount < numCoins)
    {
        var addCount = false;
        
        // Place a coin or no?
        if (Math.random() > 0.47){
            addCount = true;
        } 
        
        if (addCount == true) {
            //  Create a coin inside of the 'coins' group
            if (coinCount < numCoins){
                 // Position coin inside their spawn zone, can't be any closer than 100px from start of the level
                var coinDrop = Math.max(128, spacer  - Math.floor((Math.random() * 32)));
                
                var coin = coins.create(coinDrop, 0, 'coin');

                //  Let gravity do its thing
                coin.body.checkCollision.up = false; // So player doesn't bounce off
                coin.body.gravity.y = 300;
                coin.animations.add('coin-turn', [0,1,2,3,4,5,6,7], 10, true);
                coin.animations.play('coin-turn');

                coinCount++;
            }
        }
        
        spacer -= 64;
        
        // ran out of spawn zones, so go back and try again
        if (spacer < 250)
            spacer = levelLength / 2 - 128;
    }

    // Show score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    scoreText.fixedToCamera = true;
    scoreText.text = 'Coins: ' + score + "/" + numCoins;
    
    // Show boosts remaining
    boostText = game.add.text(16, 48, 'score: 0', { fontSize: '32px', fill: '#000' });
    boostText.fixedToCamera = true;
    boostText.text = 'Boost: ' + canBoost;
    
    // Show level progress
    levelProgressText = game.add.text(16, game.world.height - 58, 'score: 0', { fontSize: '32px', fill: '#000' });
    levelProgressText.fixedToCamera = true;
    levelProgressText.text = 'Progress: ' + Math.floor(player.body.x) + "/" + levelLength;

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
}

// START GAME LOOP # # # # # # # # # # # # # # # # # # # # # # # #
function update() {
    // Collide the player and the coins with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(coins, platforms);

    // If player overlaps with a coin, collect the coin
    game.physics.arcade.overlap(player, coins, collectCoin, null, this);

    //  Reset player
    player.body.velocity.x = 0;
    if (!player.body.touching.down){ // Always on when in the air
        if (rocketOn == 'left')
            rocketPackIs('left');
            
        if (rocketOn == 'right')
            rocketPackIs('right');
    } else {
        rocketPackIs('off');
    }
    
//===========Player Input, Movement, and Animations============
    // Left/Right Keys
    if (cursors.left.isDown){
        player.body.velocity.x = -300;
        
        if (player.body.touching.down){
            player.animations.play('left'); // Running
        } else if (!player.body.touching.down){
            rocketPackIs('left'); // Flying
        }
    } else if (cursors.right.isDown){
        player.body.velocity.x = 300;
        
        if (player.body.touching.down){
            player.animations.play('right');
        } else if (!player.body.touching.down){
            rocketPackIs('right'); // Flying
        }
    } else {
         player.play('stand'); // Facing right
         
         if (!player.body.touching.down)
            rocketPackIs('right'); // Flying
    }
        
    // Up/Down Keys
    if (cursors.up.isDown || cursors.down.isDown){
        if (cursors.down.isDown && player.body.touching.down){
            player.body.velocity.x = 0;
            player.animations.play('duck'); // Duck when standing
        } else if (!player.body.touching.down){
            if (player.body.velocity.y > 0)
                player.body.velocity.y = 0; // Hover when not moving up or down in the air
        }
            
        // Note: collectCoin() will boost the player up when cursors.up.isDown = true
    } else {
        player.body.acceleration.y = 0; // Fall
    }
    
    // Special Functions
    
    // Spacebar
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && player.body.touching.down)
    {
        if (canBoost > 0 && boostOnCooldown == false){
            player.body.velocity.y = -333;
            canBoost--;
            boostText.text = 'Boost: ' + canBoost;
            doRocketBoost();
        }
    }
//=============================================================
    

//===================== Update UI =============================
    uiTick++;
    
    if (uiTick > uiTickRate){
        levelProgressText.text = 'Progress: ' + Math.floor(player.body.x) + "/" + levelLength;
        
        uiTick = 0;
    }
//=============================================================
}
// END GAME LOOP # # # # # # # # # # # # # # # # # # # # # # # #

function rocketPackIs(stateIs){
    if (stateIs == 'left'){
        // Moving left
        flames.x = player.body.x + 36;
        flames.y = player.body.y + 22;
        flames.animations.play('flames-left');
        player.animations.play('jump-left');
        rocketOn = 'left';
    } else if (stateIs == 'right'){
        // Moving right or not pressing left or right keys and falling
        flames.x = player.body.x - 36;
        flames.y = player.body.y + 22;
        flames.animations.play('flames-right');
        player.animations.play('jump-right');
        rocketOn = 'right';
    } else if (stateIs == 'off'){
        flames.y = game.world.height + 128; // hide rocket pack exhaust off the screen
    }
}

function douseFlames(){
    boostBlast.kill();
    
    if (boostOnCooldown)
        boostOnCooldown = false;
}

function doRocketBoost(){
    boostBlast = game.add.sprite(player.body.x, player.body.y + 32, 'effects');
    boostBlast.animations.add('blast', [0,1,0,2,3], 10, true);
    boostBlast.animations.play('blast');
    game.time.events.add(Phaser.Timer.SECOND * 0.5, douseFlames, boostBlast);
    boostOnCooldown = true;
}

function collectCoin (player, coin) {
    // Removes the coin from the screen
    coin.kill();
    
    // Give boost (prevented by pressing down arrow)
    if (cursors.up.isDown)
        player.body.velocity.y = -160;

    //  Add and update the score
    score += 1;
    scoreText.text = 'Coins: ' + score + "/" + numCoins;
}

function drawBackdrop(top, bottom){
    var out = [];
    var y = 0;

    for (var i = 0; i < 360; i++)
    {
        var c = Phaser.Color.interpolateColor(top, bottom, 360, i);

        // console.log(Phaser.Color.getWebRGB(c));

        backdrop.rect(0, y, levelLength, y+2, Phaser.Color.getWebRGB(c));

        out.push(Phaser.Color.getWebRGB(c));

        y += 2;
    }
}
