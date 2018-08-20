var RocketTux = RocketTux || {};
 
// Load the game assets
RocketTux.Preload = function(){};
 
RocketTux.Preload.prototype = {
  preload: function() {
  	// Show loading screen 
  	this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.scale.setTo(2, 0.5); //wide, tall
    this.splash.anchor.setTo(0.5);
 
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
 
    this.load.setPreloadSprite(this.preloadBar);
 
  	// Load game assets
    this.load.image('ui-bg', 'data/ui/ui-bg.png'); // For use in main menu
    this.load.image('world', 'data/world.png'); // For tilemap
    this.game.load.atlas('atlas', 'data/world.png', 'data/world.json');  // For all other elements
    this.load.spritesheet('skies', 'data/skies.png', 1024, 1024);
    this.load.spritesheet('skies-special', 'data/skies-special.png', 1024, 1024);
    this.load.audio('collect', 'data/sounds/collect.ogg');
    this.load.audio('mouseover', 'data/sounds/mouseover.ogg');
    this.load.audio('warp', 'data/sounds/warp.ogg');
    this.load.audio('menu', 'data/music/menu.ogg');
    this.load.audio('song1', 'data/music/song1.ogg');
    this.load.audio('song2', 'data/music/song2.ogg');
    this.load.audio('rocketpack-start', 'data/sounds/rocketpack-start.ogg');
    this.load.audio('rocketpack-windup', 'data/sounds/rocketpack-windup.ogg');
    this.load.audio('rocketpack-boost', 'data/sounds/rocketpack-boost.ogg');
    this.load.audio('rocketpack-running', 'data/sounds/rocketpack-running.ogg');
    this.load.audio('rocketpack-boost-fail', 'data/sounds/rocketpack-boost-fail.ogg');
    this.load.audio('collide', 'data/sounds/collide.ogg');
    this.load.audio('blk-danger', 'data/sounds/blk-danger.ogg');
    this.load.audio('blk-misc', 'data/sounds/blk-misc.ogg');
    this.load.audio('blk-powerup', 'data/sounds/blk-powerup.ogg');
    this.load.audio('blk-quest', 'data/sounds/blk-quest.ogg');
    this.load.audio('coin-drop', 'data/sounds/coin-drop.ogg');
    this.load.audio('explosion', 'data/sounds/explosion.ogg');
    this.load.audio('ticking', 'data/sounds/ticking.ogg');
    this.load.audio('shakeoff', 'data/sounds/shakeoff.ogg');
    
    // Initialize variables used to generate levels
    this.worldObjects(); // Tiled objects from world texture
    this.otherVariables(); // Misc objects, variables, settings
    
    // Slick-UI
    slickUI = this.game.plugins.add(Phaser.Plugin.SlickUI);
    slickUI.load('data/ui/kenney.json');
  },
  create: function() {
  	this.state.start('MainMenu');
  },
  otherVariables: function(){
    RocketTux.songs = ['song1', 'song2', 'song1', 'song2', 'song1', 'song2', 'song1']; // More songs will be added later
    RocketTux.groundSpeed = 180; // Preference up to 200. Star +75.
    RocketTux.airSpeed = 300; // Preference up to 340. Star + 20, Fire Flower + 40.
    RocketTux.boostSpeed = 325; // Preference up to 340.
    RocketTux.bonusBoosts = 0; // Preference up to 3
    RocketTux.tuxGravity = 65; // Air Flower - 15, Earth Flower + 35 (but enemies can't hurt you)
    RocketTux.favortieTheme = 'none';
    RocketTux.favortieTime = 'none';
    RocketTux.gameMode = 'normal';
    RocketTux.favortiePowerUp = 'none'; // Star, Fire, Water, Air, Earth
    RocketTux.luck = 0, // Increases chance to get rare loot
    
    RocketTux.unlocks = {
        themes:'snow1,snow2,forest1,candyland,forest2,beach', // Unlocks: snow3, forest2, candyland, beach, beachfront
        timesOfDay: 'sunrise,day,sunset,night', // Unlocks: supertuxDay, supertuxNight
        levelSectionsMin: 5, // Unlocks: Upto +5
        levelSectionsMax: 12, // Unlocks: Upto +3
    };
    
    // Data used for spawning enemeies
    RocketTux.badguyConfig = {
        // Spawn groups
        snow1:['badguy-1', 'badguy-2', 'badguy-3', 'badguy-4'],
        snow2:['badguy-1', 'badguy-2', 'badguy-3', 'badguy-4'],
        snow3:['badguy-1', 'badguy-2', 'badguy-3', 'badguy-4'],
        forest1:['badguy-1', 'badguy-2', 'badguy-3', 'badguy-4'],
        forest2:['badguy-1', 'badguy-2', 'badguy-3', 'badguy-4'],
        beach:['badguy-1', 'badguy-2', 'badguy-3', 'badguy-4'],
        beachfront:['badguy-1', 'badguy-2', 'badguy-3', 'badguy-4'],
        candyland:['badguy-1', 'badguy-2', 'badguy-3', 'badguy-4'],
        // Personal details
        'badguy-1':{ // Mr. Bomb
            type: 'walker',
            gravity: 200,
            frames: 2,
            fps: 5
        },
        'badguy-2':{ // Jumpy
            type: 'hopper',
            gravity: 200,
            frames: 2,
            fps: 7
        },
        'badguy-3':{ // Short-Fuse
            type: 'walker',
            gravity: 200,
            frames: 2,
            fps: 5
        },
        'badguy-4':{ // Short-Fuse
            type: 'flyer',
            gravity: 30,
            frames: 3,
            fps: 10
        }
    }
    
    // Powerup state
    RocketTux.powerUpActive = 'none';
    var tmpPwrup = localStorage.getItem('RocketTux-powerUpActive');
    if (tmpPwrup == null || tmpPwrup == undefined){
        // Initial first saved data
        localStorage.setItem('RocketTux-powerUpActive', 'none');
    } else {
        RocketTux.powerUpActive = tmpPwrup;
    }
    
    // Load Inventory
    RocketTux.inventory = {};
    var tmpInv = localStorage.getItem('RocketTux-invItem196');
    if (tmpInv == null || tmpInv == undefined){
        // Initial first saved data
        for (i = 0; i < 197; i++){
            localStorage.setItem('RocketTux-invItem' + i, 0);
        }
        // Set initialized condition (Only items 0-195 are used as actual inventory items)
        localStorage.setItem('RocketTux-invItem196', 999);
    } else {
       // Load data into array
       for (i = 0; i < 197; i++){
            RocketTux.inventory[i] = parseInt(localStorage.getItem('RocketTux-invItem' + i));
        }
    }
    
    // Loot group values are array positions that represent the icon numbers 0 to 196. 
    // Numbers are used in the atlas.json like so, icon-0, icon-1, etc. to point to the images of the icons.
    // Numbers are also used in the tables below to match the names and descriptions of the items.
    RocketTux.lootgroups = {
        sunrise:{
            snow1:[13,104,140,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            snow2:[96,142,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            snow3:[90,177,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            forest1:[61,65,18,19,25,29,34,38,42,53,67,70,72,92,93,102,105,109,138,144,147,166,180,184,186,193,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            forest2:[4,56,18,19,25,29,34,38,42,53,67,70,72,92,93,102,105,109,138,144,147,166,180,184,186,193,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190]
        },
        day:{
            snow1:[47,169,174,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            snow2:[80,162,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            snow3:[52,143,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            forest1:[16,64,18,19,25,29,34,38,42,53,67,70,72,92,93,102,105,109,138,144,147,166,180,184,186,193,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            forest2:[28,194,18,19,25,29,34,38,42,53,67,70,72,92,93,102,105,109,138,144,147,166,180,184,186,193,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            candyland:[32,37,58,81,82,89,97,100,145,157,158,168,172,173,191,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            beach:[12,54,79,171,26,36,43,46,50,71,95,98,123,124,160,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            beachfront:[7,11,129,164,26,36,43,46,50,71,95,98,123,124,160,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190]
        },
        sunset:{
            snow1:[73,94,113,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            snow2:[59,99,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            snow3:[76,192,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            forest1:[51,78,18,19,25,29,34,38,42,53,67,70,72,92,93,102,105,109,138,144,147,166,180,184,186,193,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            forest2:[24,39,18,19,25,29,34,38,42,53,67,70,72,92,93,102,105,109,138,144,147,166,180,184,186,193,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190]
        },
        night:{
            snow1:[8,31,60,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            snow2:[15,183,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            snow3:[57,141,0,1,2,3,5,6,14,17,30,40,45,55,68,91,107,108,148,149,155,159,170,178,179,195,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            forest1:[69,175,18,19,25,29,34,38,42,53,67,70,72,92,93,102,105,109,138,144,147,166,180,184,186,193,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190],
            forest2:[49,125,18,19,25,29,34,38,42,53,67,70,72,92,93,102,105,109,138,144,147,166,180,184,186,193,9,10,20,21,22,23,27,33,35,41,44,48,62,63,66,74,75,77,83,84,85,86,87,88,101,103,106,110,111,112,114,115,116,117,118,119,120,121,122,126,127,128,130,131,132,133,134,135,136,137,139,146,150,151,152,153,154,156,161,163,165,167,176,181,182,185,187,188,189,190]
        }, 
        rares:[13,104,140,96,142,90,177,61,65,4,56,47,169,174,80,162,52,143,16,64,28,194,12,54,79,171,7,11,129,164,73,94,113,59,99,76,192,51,78,24,39]
    };
    
    RocketTux.lootNames = [
        'Mana Potion','Health Potion','Tux Doll','Frozen Egg','Key','Barrel of Fish','Hockey Stick','Best Stew Award','Candle','Top Cook Award','Best Chopper Award','Star Cushion','Sundae Badge','Big Heart','Supertuxium','Iceomium','Goldinite','Snowonium','Apple','Boot','Jewlery Case','Mirror','Beatup Old Box','Necklace','Torn Manuscript',
        'Golden Apple','Pys Dance Award','Stew Pot','Greenium','Fraisium','Coldite','Darkium','Holiday Bell','Backgammon Set','Barrel','Cubimal Pouch','Purse','Can of Red Soda','Pretty Diorama','Homework Diorama','Tux-o-vision','Golden Box','Pumpkinium','Bananamyte','Linuxinoate','Tuximyte','Television','Greeting Badge','Boxed Movie Camera',
        'Corkboard','Makeup Kit','Green Toolbox','Red Toolbox','Dung Tree','Beach Ball','Can of Blue Ale','Rosegoldium','Nolokium','Rainbowinoate','Plasmonium','Dinner Bell','Birch Syrup','Blender','Best Blender Award','Bird Bath','Garden Gnome','A Brick','Broccoli','Penguin Egg','Butterfly Badge','Cabbage','Camera','Carrot','Busted Caldron',
        'Cheese','Whipped Cheese','Sprocket','Orange Butter','The Platformer','Taco','First Place Trophy','Snow Globe','Cubimal World Trophy','Cubimal Army Trophy','Chocolate Bunny','Desk Lamp','Lamp-O-Gems','Decorative Globe','Decorative Tree','Santa Yeti Doll','Super Multi Tool','A Package','Cornucopia of Food','Cornucopia of Flowers',
        'Cold Brand Soda','Padlock','Cubimal Kit Season 1','Cubimal Kit Season 2','Dice','Twenty Sided Die','Wrapped Egg','Token of Magic','Token of Storms','Token of Bomerang','Token of Sailing','Token of Humbaba','Token of Indecision','Token of Shoveling','Token of Cruise Ship','Token of Trees','Token of Controller','Token of Peaks',
        'Well Loved Plushy','Award of Epicness','Bottle of Liquid Purple','Lemon Floweraide','Whistle','Crystal Ball','Fortune Cookie','Scrub Brush','Fried Egg','Super Juice-O-Matic','Lava Lamp','Over Yonder Painting','Trendy Collage','Moony Night','Vase','Bass Trophy','Cash Register','Gold Fish Bowl','Panda Bowl','Scarecrow Doll',
        'Vintage Cash Register','Mushroom Lamp','Pixi Lamp','Viewscreen','Glitch Game Box','Royal Crown','Garlic','Amber','Diamond','Moonstone','Ruby','Saphire','Ginger Root','Wrapped Present','Grilled Cheese','Honey','Ice Cube','Crystal Shard','Empty Jar','Vintage Juicer','Plate of Old Cottage','Lemon','Black Licorice','Yeti Doll','Yum Burger',
        'Strange Toy','Dangerous Toy','Whale Milk','Sack of Pennies','Motar and Pestle','Top Secret Blueprint','Butterfly Ornament','Newstand','Olive Oil','Onion','Orange','Christmas Ornament','Party in a Box','Pick Axe','Pineapple','Playcube x11','Bottled Ranbow','Participation Awrard','Cat-O-Lantern','Pumpkin Pie','Joyful Bookend','Blueberry Snowcone',
        'Rainbow Snowcone','Spinach','Starfruit','Fresh Baked Bread','Telescope','Tomato','Eggplant Smoothie','Turnip','Waffle','Blueberry Jam','Raspberry Jam','Bag of Vegetables','Popcorn','Poutine','Salad','Watermelon','Tux Cap'
    ];
    
    RocketTux.lootDesc = [
        'Any Snowy Region','Any Snowy Region','Any Snowy Region','Any Snowy Region','Forest Region 2 (Sunrise)','Any Snowy Region','Any Snowy Region','Beach Front Dr. (Day)','Snow Region 1 (Night)','Everywhere','Everywhere','Beach Front Dr. (Day)','The Beach (Day)','Snow Region 1 (Sunrise)','Any Snowy Region','Snow Region 2 (Night)','Forest Region 1 (Day)','Any Snowy Region','Any Forest Region','Any Forest Region','Everywhere','Everywhere','Everywhere','Everywhere','Forest Region 2 (Sunset)','Any Forest Region','Anywhere near the Beach',
        'Everywhere','Forest Region 2 (Day)','Any Forest Region','Any Snowy Region','Snow Region 1 (Night)','Candyland','Everywhere','Any Forest Region','Everywhere','Anywhere near the Beach','Candyland','Any Forest Region','Forest Region 2 (Sunset)','Any Snowy Region','Everywhere','Any Forest Region','Anywhere near the Beach','Everywhere','Any Snowy Region','Anywhere near the Beach','Snow Region 1 (Day)','Everywhere','Forest Region 2 (Night)','Anywhere near the Beach','Forest Region 1 (Sunset)','Snow Region 3 (Day)',
        'Any Forest Region','The Beach (Day)','Any Snowy Region','Forest Region 2 (Sunrise)','Snow Region 3 (Night)','Candyland','Snow Region 2 (Sunset)','Snow Region 1 (Night)','Forest Region 1 (Sunrise)','Everywhere','Everywhere','Forest Region 1 (Day)','Forest Region 1 (Sunrise)','Everywhere','Any Forest Region','Any Snowy Region','Forest Region 1 (Night)','Any Forest Region','Anywhere near the Beach','Any Forest Region','Snow Region 1 (Sunset)','Everywhere','Everywhere','Snow Region 3 (Sunset)','Everywhere',
        'Forest Region 1 (Sunset)','The Beach (Day)','Snow Region 2 (Day)','Candyland','Candyland','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Candyland','Snow Region 3 (Sunrise)','Any Snowy Region','Any Forest Region','Any Forest Region','Snow Region 1 (Sunset)','Anywhere near the Beach','Snow Region 2 (Sunrise)','Candyland','Anywhere near the Beach','Snow Region 2 (Sunset)','Candyland','Everywhere','Any Forest Region',
        'Everywhere','Snow Region 1 (Sunrise)','Any Forest Region','Everywhere','Any Snowy Region','Any Snowy Region','Any Forest Region','Everywhere','Everywhere','Everywhere','Snow Region 1 (Sunset)','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Anywhere near the Beach','Anywhere near the Beach','Forest Region 2 (Night)','Everywhere','Everywhere','Everywhere','Beach Front Dr. (Day)',
        'Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Any Forest Region','Everywhere','Snow Region 1 (Sunrise)','Snow Region 3 (Night)','Snow Region 2 (Sunrise)','Snow Region 3 (Day)','Any Forest Region','Candyland','Everywhere','Any Forest Region','Any Snowy Region','Any Snowy Region','Everywhere','Everywhere','Everywhere','Everywhere','Everywhere','Any Snowy Region','Everywhere',
        'Candyland','Candyland','Any Snowy Region','Anywhere near the Beach','Everywhere','Snow Region 2 (Day)','Everywhere','Beach Front Dr. (Day)','Everywhere','Any Forest Region','Everywhere','Candyland','Snow Region 1 (Day)','Any Snowy Region','The Beach (Day)','Candyland','Candyland','Snow Region 1 (Day)','Forest Region 1 (Night)','Everywhere','Snow Region 3 (Sunrise)','Any Snowy Region','Any Snowy Region','Any Forest Region','Everywhere','Everywhere',
        'Snow Region 2 (Night)','Any Forest Region','Everywhere','Any Forest Region','Everywhere','Everywhere','Everywhere','Everywhere','Candyland','Snow Region 3 (Sunset)','Any Forest Region','Forest Region 2 (Day)','Any Snowy Region'
    ];
    
    // Cubimal Data
    var tmpcubCF = localStorage.getItem('RocketTux-cubItemBonus');
    if (tmpcubCF == null || tmpcubCF == undefined){
        // Initial first saved data
        localStorage.setItem('RocketTux-cubItemBonus', '2'); // 3-6 reduce Cubimal item cost
    }
    var tmpcubCF = localStorage.getItem('RocketTux-cubCoinBonus');
    if (tmpcubCF == null || tmpcubCF == undefined){
        // Initial first saved data
        localStorage.setItem('RocketTux-cubCoinBonus', '0'); // Percent change Cubimal coin cost
    }
    
    RocketTux.cubNames = [
        'Bajorg','Batterfly','Bureaucrat','Butler','Butterfly','Cactus','Chick','Crab','Craftybot','Deimaginator',
        'Dustbunny','Emobear','Energettica','Firebog','Firefly','Fox','Foxranger','Frog','Garden Avenger','Gnome',
        'Greeterbot','Groddle','Gwendolyn','Helga','Hellbart','Ilmenskie Jones','Juju','Magicrock','Maintenancebot',
        'Melavender','Phantom','Piggy','Rook','Rube','Scion of Purple','Senior Fun Pickle','Sloth','Smuggler','Snocone Lubber',
        'Squid','Toolian','Trisor','Uncle Friendly','Uralia','Yeti'
    ];
    
    RocketTux.cubDesc = [
        'Bonus description goes here description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...',
        'Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...',
        'Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...',
        'Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...',
        'Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...',
        'Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...',
        'Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...',
        'Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...',
        'Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...','Bonus description goes here...',
    ];
    
    RocketTux.cubCost = [
        // Bajorg:[coins,item1,item2,item3,item4],Batterfly:[coins,item1,item2,item3,item4,...
        [8555,10,5,2,1],[45,10,5,2,1],[657,10,5,2,1],[86,10,5,2,1],[135,10,5,2,1],[784,10,5,2,1],[8447,10,5,2,1],[3525,10,5,2,1],[1356,10,5,2,1],[77335,10,5,2,1],
        [8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],
        [8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],
        [8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],
        [8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1],[8555,10,5,2,1]
    ];
    RocketTux.cubCostIcons = [
        // Bajorg:[item1,item2,item3,item4],Batterfly:[item1,item2,item3,item4,...
        [0,1,2,3],[1,12,24,36],[2,51,28,31],[3,21,62,113],[4,121,32,7],[10,19,29,39],[4,15,6,7],[46,17,22,36],[144,133,92,33],[70,153,23,31],
        [120,11,29,39],[4,15,6,7],[6,7,8,3],[4,18,25,39],[166,187,128,137],[10,19,29,39],[4,15,6,7],[44,1,2,3],[43,1,2,3],[41,1,2,3],
        [130,10,9,19],[4,125,86,71],[57,13,2,36],[10,11,22,3],[20,1,22,3],[10,19,29,39],[4,15,6,7],[0,1,2,32],[0,1,2,33],[0,1,2,34],
        [150,12,89,89],[4,145,56,74],[45,14,2,3],[40,31,2,3],[0,61,42,3],[10,19,29,39],[4,15,6,7],[0,1,2,3],[0,1,2,3],[0,1,2,3],
        [170,17,39,69],[4,185,26,76],[92,17,2,0],[50,71,2,1],[90,81,62,2]
    ];
  },
  worldObjects: function(){
    // Each of these are 10 tile wide sections of maps. 
    // I laid them out using the Tiled editor and copied the values here, after converting them doc/tiled_value_converter.html.
    
    RocketTux.snow1 = {
        a:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,',
            '0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,',
            '0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3330,3331,3331,3329,3331,3331,3332,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,3330,3331,3329,3331,3332,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,0,0,59,60,60,60,61,0,0,',
            '0,0,0,0,0,0,0,0,3330,3331,3329,3331,3332,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,0,0,127,124,124,381,125,0,0,',
            '0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,59,60,191,124,124,317,125,0,0,',
            '0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,123,124,124,251,252,124,125,0,0,',
            '0,0,0,0,0,0,0,0,0,0,299,0,0,634,635,636,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,123,124,124,315,316,124,190,61,0,',
            '0,0,0,0,0,0,0,0,0,0,299,0,0,698,699,700,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,123,317,317,124,124,124,253,125,0,',
            '3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,',
            '3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,'
        ],
        b:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,',
            '0,3330,3331,3331,3329,3331,3331,3332,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,',
            '0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,',
            '0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,299,0,0,0,0,0,0,0,0,0,3330,3331,3331,3331,3329,3331,3331,3331,3332,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,237,238,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,301,302,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,299,0,0,0,47,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,437,365,366,439,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,299,0,0,0,111,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,3703,3704,3704,3704,3704,3704,3704,3705,0,0,0,0,0,0,0,',
            '0,0,501,502,503,0,0,0,175,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,3767,3768,3768,3768,3768,3768,3768,3769,0,0,0,0,0,0,0,',
            '3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3901,3964,3964,3964,3706,3964,3900,3704,3704,3704,3704,3711,3768,3768,3768,3768,3768,3768,3710,3704,3704,3704,3704,3704,3704,3704,',
            '3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3967,3965,3965,3965,3965,3965,3966,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,'
        ],
        c:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,',
            '0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,',
            '0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,',
            '0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,',
            '0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,',
            '0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,',
            '0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,',
            '0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,629,630,631,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,693,694,695,0,0,0,3703,3705,0,0,0,3703,3704,3705,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,757,758,759,0,0,3703,3711,4027,444,0,442,3898,3768,3710,3704,3704,3704,3704,3705,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,3703,3704,3704,3704,3704,3704,3704,3704,3711,3768,4027,508,0,506,3447,3448,3252,3253,3768,3768,3768,3710,3704,3704,3705,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,3703,3704,3711,3768,3768,3768,3768,3768,3768,3768,3768,3768,4027,508,0,570,441,568,3316,3317,3448,3448,3448,3448,3448,3578,3710,3705,0,0,0,0,',
            '0,0,0,0,0,0,0,3703,3711,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,4027,504,444,442,505,632,507,507,633,697,507,440,441,4026,3768,3710,3704,3705,0,0,',
            '0,0,0,0,0,0,3703,3711,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,4027,568,504,505,507,507,633,507,507,507,568,504,505,4026,3768,3768,3768,3769,0,0,',
            '3704,3704,3704,3704,3704,3704,3711,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3710,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3711,3768,3768,3768,3710,3704,3704,',
            '3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,'
        ],
        d:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,3330,3329,3332,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,3330,3331,3329,3331,3332,0,0,',
            '0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,',
            '0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,',
            '0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,',
            '0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,',
            '0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3328,0,0,0,0,0,0,0,299,0,0,0,0,',
            '0,0,0,3703,3704,3704,3704,3704,3704,3705,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,0,0,0,0,',
            '0,0,0,3767,3768,3516,3384,3384,3258,3710,3704,3705,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,0,0,0,0,',
            '0,0,0,3767,3768,4095,381,124,3322,3323,3258,3710,3704,3705,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,48,0,0,0,0,299,0,0,0,0,',
            '0,0,0,3767,3768,4095,124,62,63,124,3322,3323,3517,3769,0,0,0,3956,3957,3957,3957,3957,3957,3957,3957,3958,0,299,0,0,112,0,0,0,0,299,0,0,0,0,',
            '0,0,0,3767,3519,4095,124,126,127,124,124,124,4094,3710,3705,0,3956,3958,0,0,0,0,0,0,0,3956,3958,299,0,0,176,0,0,0,0,299,0,0,0,0,',
            '0,0,319,3962,3768,4095,124,190,191,124,251,252,4094,3768,3710,3704,3704,3705,0,0,0,0,0,0,59,3960,3704,3704,3704,3704,3704,3704,3705,0,0,299,0,0,0,0,',
            '0,319,191,3383,3517,3710,3704,3704,4093,124,315,316,3383,3258,3259,3768,3768,3963,318,0,0,0,0,0,123,3383,3384,3384,3384,3517,3768,3768,3963,318,0,299,0,0,0,0,',
            '319,191,381,124,3383,3384,3384,3384,3385,124,124,124,124,3322,3323,3384,3384,3385,126,0,0,0,0,0,127,124,124,124,124,3383,3384,3384,3385,125,0,299,0,0,0,0,',
            '123,124,124,124,124,381,124,124,124,124,62,188,188,188,63,124,124,124,190,318,0,0,0,0,255,63,124,124,124,124,124,124,124,125,0,299,0,0,0,0,',
            '123,124,124,124,124,124,124,124,317,124,126,0,0,0,127,124,380,124,124,190,0,0,573,574,575,123,124,124,124,124,124,124,124,125,0,299,0,0,0,0,',
            '3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,',
            '3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,'
            ],
    };
    
    RocketTux.snow2 = {
        a:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,',
            '0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1333,1334,1335,1333,1334,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,509,510,511,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,',
            '4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,'
        ],
        b:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,',
            '0,1268,1269,1270,1271,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1332,3341,3342,3343,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1396,1397,1398,1399,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,629,630,631,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,693,694,695,0,',
            '0,0,0,0,0,0,0,0,0,3884,3885,3886,3887,0,0,0,445,446,447,0,0,0,0,0,0,4008,4009,4010,4011,4012,4013,4014,4015,0,0,0,757,758,759,0,',
            '3953,3954,3763,3964,3964,3964,3964,3964,3964,3948,3949,3950,3951,3964,3964,3964,3945,3946,3947,3964,3964,3964,3964,3964,3964,4072,4073,4074,4075,4076,4077,4078,4079,3964,3964,3964,3762,3954,3953,3954,',
            '4017,4018,3825,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3824,4018,4017,4018,'
        ],
        c:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,433,434,435,436,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,497,498,499,500,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,561,562,563,564,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,',
            '0,0,0,0,0,442,443,443,443,444,0,625,626,627,628,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,',
            '0,0,0,0,442,505,507,507,507,3764,3953,3954,3953,3954,3955,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,442,443,505,507,507,507,3515,3828,4017,4018,4017,4018,4019,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,442,505,507,507,440,571,571,441,3828,4081,4082,4081,4082,4083,437,438,438,438,438,438,438,438,439,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,506,507,3450,3452,504,443,443,505,3892,4017,4018,4017,4018,3379,3956,3957,3957,3957,3957,3957,3957,3957,3958,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,505,440,441,507,507,507,3450,3451,3451,3451,3451,3451,3451,3451,3452,508,0,0,0,0,0,0,3952,3953,3954,3953,3954,3955,439,0,0,0,0,0,0,0,0,0,0,',
            '442,507,504,505,507,507,507,568,697,507,507,440,441,507,632,507,504,444,0,0,0,0,0,4016,4017,4018,4017,4018,4019,4022,439,0,0,0,0,0,0,0,0,0,',
            '506,507,507,507,507,3515,632,507,507,507,507,504,505,507,507,632,507,504,444,0,0,0,0,4080,4081,4082,4081,4082,4083,3956,3958,0,0,0,0,0,445,446,447,0,',
            '3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,3953,3954,',
            '4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,4017,4018,'
        ],
        d:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,',
            '0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,',
            '0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,',
            '0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,1268,1269,1270,1271,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1269,1270,1271,1272,0,0,0,',
            '0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,3341,3342,3343,1336,0,0,0,',
            '0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1397,1398,1399,1400,0,0,0,',
            '0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,3884,3885,3886,3887,0,0,0,0,0,0,0,3884,3885,3886,3887,0,0,0,4008,4009,4010,4011,4012,4013,4014,4015,0,0,0,509,510,511,0,0,0,0,0,0,',
            '3763,3964,3948,3949,3950,3951,3964,3964,3964,3964,3964,3964,3964,3948,3949,3950,3951,3964,3964,3964,4072,4073,4074,4075,4076,4077,4078,4079,3964,3964,3964,3945,3946,3947,3964,3964,3964,3964,3964,3762,',
            '3825,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3824,'
        ],
    };
    
    RocketTux.snow3 = {};
    
    RocketTux.forest1 = {
        a:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,25,26,27,28,29,30,31,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,88,89,90,91,92,93,94,95,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,152,153,154,155,156,157,158,159,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,216,217,218,219,220,221,222,223,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,',
            '0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,',
            '0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,33,0,0,408,409,410,411,412,413,414,415,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,0,0,472,473,474,475,476,477,478,479,0,0,0,34,35,36,37,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,161,0,0,0,0,538,539,542,543,0,0,0,0,0,98,99,100,101,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,225,0,0,0,0,602,603,606,3493,3494,3495,0,0,0,162,163,164,165,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,4052,4053,4053,4053,3989,3989,4053,4054,0,0,538,539,670,671,0,0,0,0,0,226,227,228,229,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,364,0,0,0,352,353,0,364,0,0,602,603,604,605,0,0,0,14,15,16,17,18,19,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,416,417,0,300,0,0,538,537,540,541,0,0,0,78,79,80,81,82,83,0,0,0,0,0,0,',
            '0,0,0,0,677,678,679,680,0,0,0,236,0,0,0,480,481,0,300,3557,3558,3559,601,604,605,0,0,0,142,143,144,145,146,147,0,0,0,0,0,0,',
            '0,0,0,0,741,742,743,744,0,0,4052,4053,4054,0,0,544,545,0,300,0,0,538,665,540,541,0,0,0,206,207,208,209,210,211,0,0,0,0,0,0,',
            '0,0,0,0,805,1002,1003,808,0,0,0,364,0,0,0,608,609,0,300,0,0,602,603,604,605,0,0,0,270,271,272,273,274,275,0,0,0,0,0,0,',
            '0,0,0,0,933,934,935,936,0,0,0,300,0,0,1125,862,863,1128,300,0,0,666,667,668,669,0,0,0,334,335,336,337,338,339,0,0,0,0,0,0,',
            '802,803,803,804,997,998,999,1000,801,802,802,621,802,803,1189,926,927,1192,621,803,802,468,469,470,471,803,802,803,804,399,400,401,402,403,801,803,802,803,802,803,',
            '3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,',
            '3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,'
        ],
        b:[
            '0,0,0,408,409,410,411,412,413,414,415,0,0,472,473,474,475,476,477,478,479,0,0,0,0,0,0,0,0,0,0,0,0,0,0,602,603,604,605,0,',
            '0,0,0,472,473,474,475,476,477,478,479,0,0,0,0,538,539,542,543,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,538,539,540,541,0,',
            '0,0,0,0,0,602,603,542,543,0,0,0,0,0,0,602,603,606,3493,3494,3493,3494,3495,0,0,0,0,0,0,0,0,0,0,0,0,602,603,604,605,0,',
            '0,0,0,0,0,538,539,606,3493,3494,3495,0,0,0,0,538,537,670,671,0,0,0,0,0,0,0,0,0,0,0,0,3557,3558,3559,3558,3559,601,540,541,0,',
            '0,0,0,0,0,602,603,670,671,0,0,0,0,3557,3558,3559,601,604,605,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,602,665,604,605,0,',
            '0,0,0,0,0,538,539,540,541,0,0,0,0,0,0,538,665,540,541,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,538,539,540,541,0,',
            '0,0,0,0,0,602,537,604,605,0,0,0,0,0,0,602,603,604,605,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,602,603,542,543,0,',
            '0,0,3557,3558,3558,3559,601,540,541,0,0,0,0,0,0,538,539,540,541,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,538,539,606,3493,3495,',
            '0,0,0,0,0,602,665,604,605,0,0,0,0,0,0,602,603,542,543,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,602,603,670,671,0,',
            '0,0,0,0,0,538,539,540,541,0,0,0,0,0,0,538,537,606,3493,3494,3495,35,36,37,0,0,0,0,0,0,0,0,0,0,0,538,539,540,541,0,',
            '0,32,33,0,0,602,603,604,605,0,0,0,3557,3558,3558,3559,601,670,671,0,98,99,100,101,0,0,0,0,0,0,0,0,0,0,0,602,603,604,605,0,',
            '0,96,97,0,0,538,539,540,541,0,0,0,0,0,0,538,665,540,541,0,162,163,164,165,0,0,0,0,0,0,0,0,0,0,0,538,537,540,541,0,',
            '0,160,161,0,0,602,603,542,543,0,0,0,0,0,0,602,603,604,605,0,226,227,228,229,1268,1269,1270,1271,1272,0,0,0,0,3557,3558,3559,601,604,605,0,',
            '0,224,225,0,0,538,539,606,3493,3494,3495,0,0,0,0,538,539,540,541,0,290,291,292,293,1332,3341,3342,3343,1336,0,0,0,0,0,0,538,665,540,541,0,',
            '20,21,22,23,0,602,603,670,671,0,0,0,0,0,0,602,603,604,605,0,354,355,356,357,1396,1397,1398,1399,1400,0,0,0,0,0,0,602,603,604,605,0,',
            '84,85,86,87,0,1689,1690,1691,1692,1310,1311,1313,1314,1315,1701,1702,1690,1691,1692,1310,1695,1697,1698,1699,1701,1318,1306,1307,1308,1310,1311,1313,1314,1315,1701,1702,1690,1691,1692,1693,',
            '148,149,150,151,0,1753,1754,1755,1756,1374,1375,1377,1378,1379,1765,1766,1754,1755,1756,1374,1759,1761,1762,1763,1765,1382,1370,1371,1372,1374,1375,1377,1378,1379,1765,1766,1754,1755,1756,1757,',
            '212,213,214,215,0,1817,1818,1819,1820,1438,1439,1441,1442,1443,1829,1830,1818,1819,1820,1438,1823,1825,1826,1827,1829,1446,1434,1435,1436,1438,1439,1441,1442,1443,1829,1830,1818,1819,1820,1821,',
            '276,277,278,279,0,1881,1882,1883,1884,1502,1503,1505,1506,1507,1893,1894,1882,1883,1884,1502,1887,1889,1890,1891,1893,1510,1498,1499,1500,1502,1503,1505,1506,1507,1893,1894,1882,1883,1884,1885,',
            '340,341,342,343,0,1945,1946,1947,1948,1566,1567,1569,1570,1571,1957,1958,1946,1947,1948,1566,1951,1953,1954,1955,1957,1574,1562,1563,1564,1566,1567,1569,1570,1571,1957,1958,1946,1947,1948,1949,',
            '404,405,406,407,0,2009,2010,2011,2012,1630,1631,1633,1634,1635,2021,2022,2010,2011,2012,1630,2015,2017,2018,2019,2021,1638,1626,1627,1628,1630,1631,1633,1634,1635,2021,2022,2010,2011,2012,2013,',
            '3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,',
            '3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,'
        ],
        c:[
            '0,0,0,0,0,0,0,0,0,0,0,0,88,89,90,91,92,93,94,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,152,153,154,155,156,157,158,159,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,216,217,218,219,220,221,222,223,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1268,1269,1270,1271,1272,0,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1332,3341,3342,3343,1336,0,0,0,0,408,409,410,411,412,413,414,415,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,',
            '0,0,0,1396,1397,1398,1399,1400,0,0,0,0,472,473,474,475,476,477,478,479,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,538,537,540,541,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,3557,3558,3559,601,604,605,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,34,35,36,37,0,0,0,0,0,0,0,0,0,538,665,542,543,0,0,0,0,0,0,0,0,0,0,0,0,0,0,172,0,0,0,0,0,0,0,',
            '0,98,99,100,101,0,0,0,0,0,0,0,0,0,602,603,606,3493,3494,3495,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,',
            '0,162,163,164,165,0,0,0,0,0,0,0,0,0,538,539,540,541,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,',
            '0,226,227,228,229,0,0,0,0,0,0,0,0,0,602,537,604,605,0,0,0,0,0,0,0,0,0,0,738,738,0,0,300,0,0,0,0,0,0,0,',
            '0,290,291,292,293,0,0,0,0,0,3557,3558,3559,3558,3559,601,540,541,0,0,0,0,0,0,0,0,0,4052,4053,4053,4053,4053,4054,0,0,0,0,0,0,0,',
            '0,354,355,356,357,0,0,0,0,0,0,0,0,0,602,665,604,605,0,0,0,0,0,0,0,0,1110,1111,1111,1111,1111,1111,1111,1112,0,0,0,0,0,0,',
            '0,1696,1697,1698,1699,1700,0,1312,1313,1314,1315,1316,0,0,1689,1690,1691,1692,1310,1311,1313,1314,1315,1316,0,1110,1111,1111,1239,1111,1111,1239,1111,1111,1112,0,0,0,0,0,',
            '0,1760,1761,1762,1763,1764,0,1376,1377,1378,1379,1380,0,0,1753,718,719,1756,1374,1375,1377,1378,1379,1380,1110,1111,1111,1111,1111,1111,1111,1111,1111,1111,1111,1112,0,0,0,0,',
            '0,1824,1825,1826,1827,1828,0,1440,1441,1442,1443,1444,0,0,1817,782,783,1820,1438,1439,1441,1442,1443,1444,1110,1111,1111,1240,1238,1111,1111,1240,1238,1111,1111,1112,0,1069,1070,1071,',
            '0,1888,1889,1890,1891,1892,0,1504,1505,1506,1507,1508,0,0,1881,603,1883,1884,1502,1503,1505,1506,1507,1508,1110,1111,1111,1240,1238,1111,1111,1240,1238,1111,1111,1112,0,1133,1134,1135,',
            '0,1952,1953,1954,1955,1956,0,1568,1569,1570,1571,1572,0,0,1945,1946,1947,1948,1566,1567,1569,1570,1571,1572,1110,1111,1111,1111,1111,1111,1111,1111,1111,1111,1111,1112,0,1197,1198,1199,',
            '0,2016,2017,2018,2019,2020,0,1632,1633,1634,1635,1636,0,0,2009,2010,2011,2012,1630,1631,1633,1634,1635,1636,1110,1111,1111,1111,1111,1111,1111,1111,1111,1111,928,1112,0,1261,1262,1263,',
            '3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,',
            '3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,'
        ],
        d:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,217,218,219,220,221,222,223,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,0,0,0,0,0,0,0,',
            '1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,1268,1269,1270,1271,1272,0,0,',
            '1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,408,409,410,411,412,413,414,415,0,0,0,0,1332,3341,3342,3343,1336,0,0,',
            '1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,472,473,474,475,476,477,478,479,35,36,37,0,1396,1397,1398,1399,1400,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,602,537,604,605,0,98,99,100,101,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3557,3558,3559,601,540,541,0,162,163,164,165,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,602,665,604,605,0,226,227,228,229,0,0,0,0,0,0,0,0,',
            '0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,1305,1306,1307,1308,1310,1702,1690,1691,1692,1694,1695,1697,1698,1699,1700,0,0,0,0,0,0,0,',
            '0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,1369,1370,1371,1372,1374,1766,718,719,1756,1758,1759,1761,1762,1763,1764,0,0,0,0,0,0,0,',
            '0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,1433,1434,1435,1436,1438,1830,782,783,1820,1822,1823,1825,1826,1827,1828,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1497,1498,1499,1500,1502,1894,1882,1883,1884,1886,1887,1889,1890,1891,1892,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1561,1562,1563,1564,1566,1958,1946,1947,1948,1950,1951,1953,1954,1955,1956,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,801,803,804,0,0,0,0,801,1625,1626,1627,1628,1630,2022,2010,2011,2012,2014,2015,2017,2018,2019,2020,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,801,4002,3877,3622,1137,1138,1137,1137,3621,3877,3877,3877,3877,3877,3877,3877,3877,3877,3877,3877,3877,3877,3877,4003,804,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,801,803,4002,3939,3941,3687,1265,1202,1518,3482,3748,3942,3941,3813,3814,3813,3814,3814,3813,3814,3813,3814,3941,3941,3941,3938,4003,804,0,0,0,0,0,',
            '0,0,0,801,803,802,803,4002,3877,3939,3813,3814,3687,1518,1201,3812,3813,3941,3941,3751,1201,1201,1201,1201,1201,1201,1201,1201,1201,3748,3941,3813,3814,3938,3879,0,0,0,0,0,',
            '0,0,0,3876,3877,3877,3877,3939,3813,3815,1201,1201,3813,3815,1201,1201,1201,3812,3813,3751,1201,1201,1201,1201,1201,1201,1521,1201,1201,3748,3815,1201,1201,3748,3943,0,0,0,0,0,',
            '0,0,0,3940,3941,3941,3813,3815,1201,1201,1201,1201,1201,1201,1265,1389,1201,1201,1201,3560,1520,1520,1519,1521,1201,1201,3560,1201,1518,3560,1201,1201,1201,3748,3874,804,0,0,0,0,',
            '0,801,803,3875,3941,3687,1201,1201,1201,1201,1201,1201,1201,1201,1518,3560,1453,1201,1201,3812,3813,3813,3813,3815,1201,1201,3560,1201,3812,3815,1201,1201,1201,3812,3938,3879,0,0,0,0,',
            '803,4002,3877,3939,3941,3751,1201,1201,1201,1201,1201,1201,1201,1518,3684,3687,3482,1521,1201,1201,1201,1201,1201,1201,1201,1518,3560,1201,1201,1201,1201,1201,1201,1201,3748,3874,804,802,803,802,',
            '3877,3939,3941,3942,3941,3687,1201,1201,1201,1201,1201,1201,1201,3684,3941,3941,3941,3687,1519,1520,1519,1520,1519,1520,1519,3748,3687,1520,1519,1520,1519,1520,1519,1325,3748,3938,3877,3877,3877,3877,',
            '3941,3941,3941,3941,3941,3751,3750,3750,3750,3750,3750,3750,3750,3684,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3942,3941,'
        ],
        e:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,212,213,214,215,0,416,417,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,276,277,278,279,0,480,481,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,340,341,342,343,0,864,865,0,0,0,0,0,0,0,0,0,660,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,801,804,404,405,406,407,930,928,929,932,0,0,0,3744,3745,0,0,801,724,804,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,3876,3878,3877,3878,3877,3878,3877,3878,3878,3623,3964,3964,3964,3808,3809,3964,3964,3624,3878,3879,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,801,804,1194,1195,1195,3812,3814,3813,3814,3813,3814,3813,3814,4006,3944,3965,3965,3965,3965,3965,3965,3965,3752,3814,3815,1194,1196,801,804,0,0,',
            '0,0,0,0,0,0,0,0,0,3876,3622,1266,1265,1266,1265,1266,1265,1266,1265,1266,1265,1266,3812,4006,4005,4006,4005,4006,4005,4006,4005,3751,1265,1266,1265,1266,3621,4003,804,0,',
            '0,0,0,0,0,0,0,0,0,4004,3751,1202,1201,1202,1325,1520,1519,1519,1520,1202,1201,1202,1201,3812,3814,3813,3814,3813,3813,3813,3814,3815,1201,1202,1201,1389,3748,3938,3879,0,',
            '0,0,0,0,0,801,804,1194,1194,4004,3751,1266,1265,1266,3812,3813,3813,3813,3815,1266,1265,1266,1265,1266,1265,1266,1265,1265,1265,1266,1265,1266,1265,1266,1519,3748,4005,4005,4007,0,',
            '32,33,0,660,0,3876,3622,1201,1201,3748,3751,1202,1201,1202,1265,1265,1265,1265,1265,1265,1265,1202,1519,1519,1521,1202,1265,1265,1201,1202,1519,1520,1519,1520,3748,4005,3941,3941,4007,0,',
            '96,97,801,724,803,3940,3815,1265,1265,3812,3815,1266,1265,1266,1519,1520,1519,1520,1265,1266,1265,1518,3748,4006,3815,1266,1266,1266,1266,1518,3748,3941,4006,3813,3814,3813,3814,3813,4071,0,',
            '160,161,3876,3878,3878,3815,1202,1201,1201,1265,1266,1202,1201,1202,3748,4006,4006,3815,1201,1202,1201,3812,3813,3815,1266,1266,1266,1518,1521,3748,3941,4006,3815,1202,1201,1202,1201,1203,0,0,',
            '224,225,3940,4006,3815,1265,1201,1519,1519,1520,1519,1520,1265,1266,3812,3813,3815,1266,1265,1266,1265,1266,1265,1266,1266,1266,1518,3748,3941,3941,3942,3815,1265,1266,1265,1266,1265,1203,0,0,',
            '288,289,4004,3751,1520,1201,1202,3748,4006,4006,4006,3751,1201,1201,1265,1266,1201,1202,1201,1519,1519,1520,1201,1202,1266,1518,3748,3941,3941,3941,3751,1202,1201,1266,1201,1266,1518,1267,1064,0,',
            '352,353,3940,4006,3751,1265,1266,3812,3814,3813,3814,3751,1521,1266,1201,1202,1265,1519,1520,3748,4006,3751,1265,1266,1518,3748,4006,4006,3813,3814,3815,1266,1266,1266,1266,1518,3748,4006,3943,0,',
            '416,417,4004,4006,3751,1201,1202,1201,1201,1202,1265,3748,3751,1389,1265,1202,1518,3748,4006,4006,3813,3815,1201,1202,3812,3813,3814,3815,1201,1202,1201,1266,1266,1266,1518,3748,4006,4006,3943,0,',
            '480,481,3940,4006,3815,1265,1266,1265,1265,1266,1265,3748,4006,3751,1265,1266,3748,4006,3813,3815,1265,1266,1265,1266,1265,1266,1265,1266,1265,1266,1266,1266,1266,1266,3748,4006,4006,4006,4007,0,',
            '544,545,4004,3751,1520,1519,1520,1519,1520,1202,1265,3748,4006,3751,1265,1266,3812,3815,1201,1202,1201,1202,1201,1202,1201,1519,1520,1519,1520,1519,1521,1202,1201,1202,3748,4006,4006,3813,4071,0,',
            '608,609,4068,3814,4005,4005,4005,4005,3751,1265,1265,3812,3814,3815,1201,1202,1265,1266,1265,1266,1265,1266,1265,1518,1520,3748,3813,3814,3813,3814,3751,1389,1265,1266,3748,4006,3815,1203,0,0,',
            '672,673,0,1200,3812,3813,3813,3813,3815,1265,1266,1202,1201,1202,1265,1202,1519,1520,1389,1520,1201,1202,1201,3812,3813,3815,1201,1202,1201,1202,3748,3751,1201,1202,3812,3815,1201,1267,0,0,',
            '864,865,1194,1200,1266,1265,1266,1265,1266,1265,1266,1266,1265,1266,1265,1518,3748,4006,4006,3751,1519,1266,1265,1393,1265,1266,1265,1326,1455,1327,3748,3751,1521,1266,1265,1266,1265,1267,801,803,',
            '3877,3622,1519,1389,1520,1519,1520,1519,1520,1519,1520,1519,1520,1519,1520,3748,4006,3942,4006,4006,3751,1519,1520,1392,1519,1520,1519,1457,1453,1457,3748,4006,3751,1519,1520,1520,1519,1325,3621,3877,',
            '4006,4005,4005,4006,4005,4006,4006,4005,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,4005,4006,'
        ],
        f:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,',
            '0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,',
            '0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,',
            '0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,689,690,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,801,803,753,754,804,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3876,3877,3877,3878,3879,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,801,3875,3942,3941,3941,3874,803,804,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '804,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3876,3939,4005,4005,4005,3938,3878,3879,0,0,0,0,0,0,0,0,0,0,3931,0,0,0,801,',
            '3816,3964,3964,3964,3964,3964,3860,3861,3862,3964,3964,3964,3964,3863,3964,3964,3964,3688,3941,3941,3617,3618,3619,4005,3880,3964,3964,3964,3964,3860,3861,3862,3964,3964,3964,3991,3964,3964,3964,3624,',
            '3944,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3752,4005,4005,3681,3682,3683,4005,3944,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3752,'
        ],
        g:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,32,33,0,0,',
            '0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,96,97,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,160,161,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,224,225,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,416,417,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,480,481,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1125,862,863,1128,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,801,1189,926,927,1192,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3876,3877,3877,3878,3879,0,',
            '803,802,803,804,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,801,3875,3942,3941,3941,3874,803,',
            '3878,3878,3878,3816,3964,3964,3964,3860,3861,3862,3964,3964,3964,3863,3964,3964,3964,3964,3964,3860,3861,3861,3862,3964,3964,3964,3964,3964,3964,3860,3861,3862,3964,3624,3939,4005,4005,4005,3938,3878,',
            '4005,4005,4005,3944,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3752,3941,3941,3617,3618,3619,4005,'
        ],
        h:[
            '344,345,346,347,348,349,350,351,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,217,218,219,220,221,222,223,0,0,',
            '408,409,410,411,412,413,414,415,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,',
            '472,473,474,475,476,477,478,479,0,0,0,0,0,4052,4053,4053,4053,4053,4053,4053,4053,4053,4053,4054,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,0,',
            '0,0,538,539,542,543,0,0,0,0,0,0,422,295,487,0,0,0,300,0,0,0,486,294,423,0,0,0,0,0,408,409,410,411,412,413,414,415,0,0,',
            '0,0,602,603,606,3493,45,109,46,0,0,422,295,487,0,0,0,0,300,0,0,0,0,486,294,423,0,0,0,0,472,473,474,475,476,477,478,479,0,0,',
            '0,0,538,539,540,541,0,300,0,0,422,295,487,0,0,0,0,0,300,0,0,0,0,0,486,294,423,0,0,0,0,0,602,537,542,543,0,0,0,0,',
            '0,0,602,603,604,605,0,170,109,4052,4053,4053,4053,4054,44,44,44,4052,4053,4054,0,0,0,0,0,486,294,423,0,42,109,43,3559,601,606,3493,3495,0,0,0,',
            '0,0,538,539,540,541,0,0,300,0,0,0,0,300,0,0,0,300,0,170,44,44,109,4052,4053,4053,4053,4054,44,44,171,0,602,665,540,541,0,0,0,0,',
            '0,0,602,603,604,605,0,0,300,0,0,0,0,300,0,0,0,300,0,0,0,0,300,0,0,0,103,423,0,0,0,0,602,603,604,605,0,0,0,0,',
            '0,0,538,539,540,541,0,0,300,0,0,0,0,300,0,0,0,300,0,0,0,0,300,0,0,0,553,167,0,0,0,0,538,539,540,541,0,0,0,0,',
            '0,0,602,537,604,605,0,4052,4053,4053,4053,4053,4053,4054,0,0,0,300,0,0,0,0,300,0,0,4052,4053,4053,4054,0,0,0,602,603,604,605,0,0,0,0,',
            '3557,3558,3559,601,540,541,0,0,300,0,0,0,0,0,0,0,0,4052,4053,4053,4053,4053,4054,0,0,0,0,0,0,0,0,0,538,539,542,543,0,0,0,0,',
            '0,0,602,665,604,605,0,0,300,0,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,0,602,603,606,3493,3494,3495,0,0,',
            '0,0,538,539,540,541,0,4052,4053,4054,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,0,538,539,540,541,0,0,0,0,',
            '0,0,602,603,604,605,0,0,0,170,44,107,0,0,0,0,422,104,44,44,44,4052,4053,4054,0,622,623,624,0,0,0,0,602,603,604,605,0,0,0,0,',
            '0,0,1689,1690,1691,1692,1310,1311,1313,1314,1315,4052,4053,4053,4053,4053,4053,4053,4054,0,0,0,0,0,685,686,687,688,0,0,0,0,1689,1690,1691,1692,1693,0,0,0,',
            '0,0,1753,1754,1755,1756,1374,1375,1377,1378,1379,1380,0,0,0,0,0,0,0,0,0,0,0,0,749,750,751,752,0,0,0,0,1753,1754,1755,1756,1757,0,0,0,',
            '0,0,1817,1818,1819,1820,1438,1439,1441,1442,1443,1444,0,0,0,0,0,0,0,0,0,0,0,0,813,814,815,816,817,818,819,0,1817,1818,1819,1820,1821,0,0,0,',
            '0,0,1881,1882,1883,1884,1502,1503,1505,1506,1507,1508,0,0,0,0,0,0,0,0,0,0,0,0,877,878,879,880,881,882,883,0,1881,1882,1883,1884,1885,0,0,0,',
            '0,0,1945,1946,1947,1948,1566,1567,1569,1570,1571,1572,0,0,0,0,0,0,689,690,0,0,0,0,941,942,943,944,945,946,947,0,1945,1946,1947,1948,1949,660,0,0,',
            '803,802,2009,2010,2011,2012,1630,1631,1633,1634,1635,1636,803,802,803,802,803,802,753,754,803,802,803,803,1005,1006,1007,1008,1009,1010,1011,803,2009,2010,2011,2012,2013,724,803,802,',
            '3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,',
            '4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,'
        ],
        i:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,',
            '0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,',
            '0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1125,1126,1127,1128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,801,803,803,1189,1190,1191,1192,803,804,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3876,3878,3878,3878,3878,3878,3878,3878,3879,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4068,3814,3813,3814,3813,3814,3813,3814,3815,1194,1196,801,804,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1200,1201,1202,1201,1201,1201,1201,1266,1265,1266,3620,4003,804,0,0,0,0,0,1268,1269,1270,1271,1272,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,801,1583,1582,1583,1582,1583,1713,1201,1202,1201,1521,3748,3938,3879,0,0,0,0,0,1332,3341,3342,3343,1336,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,801,802,4002,3878,3878,3878,3878,3878,3622,1201,1266,1201,3748,4005,4005,4007,0,0,0,0,0,1396,1397,1398,1399,1400,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,3876,3878,3939,3941,3813,3814,3813,3814,3815,1265,1265,1201,3812,4005,4005,4007,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,801,3875,3941,4005,3815,1201,1201,1201,1201,1201,1201,1201,1265,1201,3812,4005,4007,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,3876,3939,4005,3815,1201,1201,1201,1201,1201,1201,1201,1201,1201,1201,1201,3812,4071,0,0,0,0,0,0,677,678,679,680,0,',
            '0,0,0,0,0,3392,3393,0,0,0,0,0,4068,3814,3815,1265,1265,1265,1265,1649,1583,1582,1713,1265,1265,1265,1265,1203,0,0,0,3392,3393,0,0,741,742,743,744,0,',
            '0,0,3840,3841,3585,3587,3457,0,0,0,0,0,0,1200,1201,1201,1201,1201,1649,3935,3878,3878,3622,1201,1201,1201,1201,1267,0,0,0,3456,3457,0,0,805,806,807,808,0,',
            '803,802,3904,3905,3649,3651,3265,803,802,803,803,803,804,1581,1582,1583,1582,1583,3935,3939,3941,3941,3999,1582,1583,1582,1583,1584,801,803,803,3394,3395,801,804,869,870,871,872,801,',
            '3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,3878,4066,4005,4005,4005,3938,3878,3878,3878,3878,3878,3878,3878,3878,3458,3459,3876,3878,3878,3878,3878,3878,3878,',
            '4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,4005,3943,3522,3523,3940,4005,4005,4005,4005,4005,4005,'
        ],
        j:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3607,3734,3734,3734,3734,3734,3734,3734,3734,3734,3734,3608,0,0,0,0,0,0,0,',
            '0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,3609,3610,3611,0,0,364,0,0,364,0,0,0,3670,0,0,0,0,0,0,0,',
            '0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,236,0,0,236,0,0,0,3670,0,0,0,0,0,0,0,',
            '0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3735,3736,3735,3736,0,0,3609,3610,3611,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3400,3401,0,0,0,0,0,0,0,364,0,0,364,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3464,3465,0,0,3673,3674,3675,0,0,236,0,0,236,0,0,0,0,0,0,0,0,0,0,0,',
            '1268,1269,1270,1271,1272,0,0,0,0,0,0,3735,3736,3734,3734,3734,3735,3736,3734,3734,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,0,3673,3674,3675,0,0,0,0,0,0,',
            '1332,3341,3342,3343,1336,0,0,0,0,0,0,364,0,0,0,0,3528,3529,0,0,0,0,0,0,0,0,364,0,3735,3736,3735,3736,3735,3736,0,0,0,0,0,0,',
            '1396,1397,1398,1399,1400,0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,364,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,3607,3608,0,0,236,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,300,0,0,0,0,0,0,0,',
            '0,0,0,0,3606,3734,3734,3735,3736,3734,3734,3606,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,3392,3393,0,300,0,0,0,0,0,0,0,',
            '0,0,0,0,364,0,0,0,0,0,0,364,0,0,0,0,3392,3393,0,0,0,0,0,0,3840,3841,3269,3585,3585,3587,3712,3585,3269,3842,3843,0,0,0,0,0,',
            '0,0,0,0,300,0,0,0,0,0,0,300,0,0,0,3606,3456,3457,0,0,0,0,0,0,3904,3905,3268,3649,3649,3649,3649,3649,3268,3906,3907,0,0,0,0,0,',
            '0,0,0,0,300,0,0,0,0,0,0,300,0,3840,3841,3269,3587,3712,3586,0,0,0,0,0,3456,3457,300,0,0,0,0,0,300,3456,3457,0,0,0,0,0,',
            '0,0,0,0,300,0,0,0,0,0,0,300,0,3904,3905,3268,3651,3776,3650,0,0,0,0,0,3520,3521,300,0,0,0,0,0,300,3456,3457,0,0,0,0,0,',
            '0,0,0,0,300,0,0,0,3840,3841,3585,3269,3585,3970,3971,300,3456,3457,0,0,0,0,0,0,0,0,300,0,0,0,0,0,3735,3736,3735,3736,0,0,0,0,',
            '0,0,0,0,300,0,0,0,3904,3905,3649,3268,3649,4034,4035,300,3520,3521,0,0,0,0,0,0,0,0,300,3673,3674,3675,0,1110,1111,1111,1111,1111,1112,0,0,0,',
            '0,0,0,0,300,3392,3393,0,3456,3457,0,300,0,0,0,300,0,0,0,0,3400,3401,0,0,0,0,300,0,3670,3606,0,1110,1239,1111,1239,1111,1112,0,689,690,',
            '804,3392,3393,0,300,3456,3457,0,3456,3457,0,236,0,0,0,236,0,0,0,0,3464,3465,0,0,3400,3401,236,0,3670,3606,3606,1110,1111,1111,1111,1111,1112,801,753,754,',
            '3879,3456,3712,3585,3269,3587,3712,3585,3587,3457,3735,3736,3735,3736,3735,3736,3392,3393,3735,3736,3464,3720,3593,3593,3595,3465,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3877,3878,3877,3878,',
            '3943,3456,3776,3649,3649,3649,3649,3649,3651,3457,3735,3736,3735,3736,3735,3736,3456,3457,3735,3736,3464,3784,3657,3657,3659,3465,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3941,3941,3941,3942,'
        ],
        k:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,89,90,91,92,93,94,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,153,154,155,156,157,158,159,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,217,218,219,220,221,222,223,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,0,0,',
            '0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,0,0,',
            '0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,408,409,410,411,412,413,414,415,0,0,0,0,0,0,',
            '0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,32,33,0,0,472,473,474,475,476,477,478,479,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,0,0,0,0,538,537,540,541,0,0,35,36,37,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,161,0,0,3557,3558,3559,601,604,605,0,98,99,100,101,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,657,658,659,0,0,0,0,0,224,225,0,0,0,0,538,665,540,541,0,162,163,164,165,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,657,855,722,854,658,658,659,0,0,288,289,0,0,0,0,602,603,604,605,0,226,227,228,229,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,657,855,917,790,786,788,786,787,0,0,480,481,657,658,659,0,538,718,719,541,0,290,291,292,293,0,32,33,',
            '0,0,0,0,0,0,0,0,0,0,0,0,721,916,722,854,0,852,0,851,0,657,464,465,855,917,723,0,602,782,783,605,0,354,355,356,357,0,96,97,',
            '1305,1306,1307,1308,1310,1311,1313,1314,1315,1316,0,657,855,722,722,723,659,658,658,915,658,855,528,529,722,722,787,0,1689,1690,1691,1692,1694,1695,1697,1698,1699,0,160,161,',
            '1369,1370,1371,1372,1374,1375,1377,1378,1379,1380,0,656,1044,1045,1044,1045,1044,1044,722,722,1044,1045,462,463,1044,1045,720,0,1753,1754,1755,1756,1758,1759,1761,1762,1763,1764,224,225,',
            '1433,1434,1435,1436,1438,1439,1441,1442,1443,1444,657,3876,3878,3877,3878,3877,3878,3366,722,722,3365,3877,3878,3877,3878,3877,3879,659,1817,590,591,1820,1822,1823,1825,1826,1827,1828,288,289,',
            '1497,1498,1499,1500,1502,1503,1505,1506,1507,1508,721,3428,3429,3430,3429,3430,3429,3431,722,722,3428,3430,3429,3430,3429,3430,3431,723,1881,654,655,1884,1886,1887,1889,1890,1891,1892,480,481,',
            '1561,1562,1563,1564,1566,1567,1569,1570,1571,1572,721,722,722,722,916,722,722,722,722,722,917,722,722,722,722,916,722,723,1945,1946,1947,1948,1950,1951,1953,1954,1955,1956,672,673,',
            '1625,1626,1627,1628,1630,1631,1633,1634,1635,1636,784,1044,1045,1044,1045,1044,1045,1044,1045,1044,1045,1044,1045,1044,1045,1044,1045,848,2009,2010,2011,2012,2014,2015,2017,2018,2019,2020,864,865,',
            '3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,',
            '3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,'
        ],
        l:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,0,0,0,0,660,0,0,0,0,0,0,0,0,0,',
            '0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,660,0,0,0,0,0,0,0,160,161,0,801,802,803,724,802,803,804,659,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,657,801,802,803,724,803,802,803,804,0,0,0,224,225,0,3876,3877,3877,3877,3878,3877,3366,723,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,721,3365,3877,3877,3878,3877,3878,3877,3366,659,0,0,288,289,0,4068,3429,3429,3430,3429,3430,3431,723,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,855,3428,3429,3430,3429,3430,3429,3430,3431,723,0,0,352,353,0,0,721,722,722,722,722,722,723,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,657,855,722,722,722,722,722,722,722,722,787,0,0,416,417,657,658,855,917,722,722,722,916,723,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,657,855,722,722,722,722,722,916,790,791,723,852,0,0,480,481,721,722,722,722,722,722,790,786,787,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,660,657,855,722,722,917,722,722,722,722,723,721,854,658,658,658,464,465,721,916,722,722,790,791,723,0,851,0,0,0,0,0,',
            '0,0,0,0,0,0,0,657,724,784,1045,1045,1044,1045,1049,722,722,722,723,721,722,722,722,722,528,529,722,722,722,722,854,855,723,0,852,0,0,0,0,0,',
            '0,0,0,0,0,0,0,721,3365,3877,3877,3877,3878,3877,3366,722,916,722,854,855,722,722,1044,1049,592,593,1044,1045,1049,722,722,722,723,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,721,3428,3429,3430,3429,3430,3429,3431,722,722,722,722,917,722,722,3365,3877,3877,3877,3878,3877,3366,722,722,722,854,658,658,659,0,0,0,0,',
            '0,0,0,0,0,0,0,721,722,722,722,722,722,722,722,722,722,722,722,722,722,722,3428,3429,3430,3941,3941,3941,3367,722,722,722,722,722,722,723,0,0,0,0,',
            '0,0,0,801,802,803,804,784,1044,1049,722,790,786,786,791,722,1044,1044,1045,1049,722,722,790,788,791,3364,3941,3941,3367,722,722,1044,1044,1045,1049,723,0,0,0,0,',
            '0,0,657,3365,3877,3877,3877,3878,3877,3366,722,723,0,0,721,722,3365,3878,3877,3366,722,722,723,851,721,3364,3941,3941,3367,786,791,3365,3878,3877,3366,854,659,0,0,0,',
            '0,0,721,3428,3429,3430,3429,3430,3429,3431,917,854,658,658,855,722,3428,3429,3941,3367,722,722,723,851,721,3364,3941,3941,3367,657,855,3428,3429,3429,3431,722,723,0,0,0,',
            '0,0,721,722,722,722,916,722,722,722,722,722,722,722,722,722,722,722,3364,3367,722,722,854,915,855,3364,3941,3941,3367,722,722,722,722,722,917,722,723,659,0,0,',
            '802,803,721,722,1044,1044,1044,1044,1044,1044,1044,1044,1044,1044,1044,1044,1044,1044,3364,3367,1044,1044,1044,1044,1044,3364,3941,3941,3367,1044,1044,1044,1044,1044,1044,1044,1045,720,802,803,',
            '3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3877,3878,3877,3878,3877,3878,3878,3941,3941,3878,3878,3877,3878,3877,3941,3941,3941,3941,3877,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,',
            '3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,'
        ],
        m:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,89,90,91,92,93,94,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,153,154,155,156,157,158,159,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,217,218,219,220,221,222,223,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,24,25,26,27,28,29,30,31,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,88,89,90,91,92,93,94,95,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,408,409,410,411,412,413,414,415,0,152,153,154,155,156,157,158,159,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,472,473,474,475,476,477,478,479,0,216,217,218,219,220,221,222,223,0,0,0,0,0,0,',
            '0,0,0,34,35,36,37,0,0,0,0,0,0,0,0,0,0,0,0,538,537,540,541,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,0,0,',
            '0,0,0,98,99,100,101,0,0,0,0,0,0,0,0,3557,3558,3558,3558,3559,601,604,605,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,0,0,',
            '0,0,0,162,163,164,165,0,0,0,0,0,0,0,0,0,0,0,0,538,665,540,541,0,0,0,408,409,410,411,412,413,414,415,0,32,33,0,0,0,',
            '0,0,0,226,227,228,229,0,0,0,0,0,0,0,0,0,0,0,0,602,603,604,605,0,0,0,472,473,474,475,476,477,478,479,34,96,97,37,0,0,',
            '0,0,0,290,291,292,293,0,0,0,0,0,0,0,34,35,36,37,0,538,537,540,541,0,0,0,0,0,538,539,542,543,0,0,0,160,161,0,0,0,',
            '0,0,0,354,355,356,357,0,0,0,0,0,0,0,98,99,100,101,3557,3559,601,604,605,0,0,0,0,0,602,603,606,3493,3494,3495,0,224,225,0,0,0,',
            '0,0,0,290,291,292,293,0,0,0,0,0,0,0,162,163,164,165,0,538,665,540,541,0,0,0,0,0,538,539,670,671,0,0,0,288,289,0,0,0,',
            '0,14,15,16,17,18,19,0,0,0,0,0,0,0,226,227,228,229,0,602,603,604,605,0,0,0,0,0,602,603,604,605,0,0,20,21,22,23,0,0,',
            '0,78,79,80,81,82,83,0,0,1305,1306,1307,1308,1694,1695,1697,1698,1699,1701,1702,718,719,1692,1310,1311,1313,1314,1701,1702,590,591,1692,1693,0,84,85,86,87,0,0,',
            '0,142,143,144,145,146,147,0,0,1369,1370,1371,1372,1758,1759,1761,1762,1763,1765,1766,782,783,1756,1374,1375,1377,1378,1765,1766,654,655,1756,1757,0,148,149,150,151,0,0,',
            '0,206,207,208,209,210,211,0,0,1433,1434,1435,1436,1822,1823,1825,1826,1827,1829,1830,1818,1819,1820,1438,1439,1441,1442,1829,1830,718,719,1820,1821,0,212,213,214,215,0,0,',
            '0,270,271,272,273,274,275,0,0,1497,1498,1499,1500,1886,1887,1889,1890,1891,1893,1894,1882,1883,1884,1502,1503,1505,1506,1893,1894,782,783,1884,1885,0,276,277,278,279,0,0,',
            '0,334,335,336,337,338,339,0,0,1561,1562,1563,1564,1950,1951,1953,1954,1955,1957,1958,1946,1947,1948,1566,1567,1569,1570,1957,1958,1946,1947,1948,1949,0,340,341,342,343,0,0,',
            '803,804,399,400,401,402,403,801,804,1625,1626,1627,1628,2014,2015,2017,2018,2019,2021,2022,2010,2011,2012,1630,1631,1633,1634,2021,2022,2010,2011,2012,2013,610,404,405,406,407,801,803,',
            '3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3877,3878,3877,3877,3878,3877,3878,3877,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,',
            '3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,'
        ],
        n:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,',
            '0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,',
            '0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,677,678,679,680,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,741,742,743,744,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1125,1126,1127,1128,0,0,0,0,933,934,935,936,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1189,1190,1191,1192,0,0,801,804,997,998,999,1000,804,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,3876,3878,3877,3366,790,791,3365,3878,3877,3877,3878,3877,3879,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,4068,3430,3429,3431,854,855,3428,3430,3429,3430,3429,3430,4071,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,657,855,722,722,722,722,722,722,722,722,722,854,659,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,801,802,804,784,1044,1044,1044,1044,1044,1044,1044,1045,917,722,1044,720,802,803,804,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,3876,3878,3877,3877,3878,3877,3877,3878,3877,3877,3878,3366,722,722,3365,3877,3878,3877,3879,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,4068,3429,3430,3429,3430,3429,3430,3429,3430,3429,3430,3431,722,917,3428,3429,3429,3430,4071,0,0,0,0,0,657,801,802,803,804,0,0,',
            '0,0,0,0,0,0,0,0,0,657,855,722,722,722,722,722,722,786,786,722,722,722,722,722,722,722,854,659,0,0,0,0,0,721,3365,3878,3877,3879,0,0,',
            '0,0,0,0,0,0,0,801,804,784,1044,1045,1045,1045,1045,1045,720,1073,1074,784,1045,1045,1045,1045,1045,1045,1045,720,802,804,0,0,657,855,3428,3429,3430,4071,0,0,',
            '0,0,657,658,659,0,0,3876,3878,3877,3877,3878,3877,3877,3878,3877,3622,1137,1138,3621,3878,3877,3877,3877,3878,3877,3877,3878,3877,3879,0,657,855,722,722,722,854,659,0,0,',
            '0,657,855,722,723,0,0,4068,3430,3813,3814,3813,3814,3813,3813,3814,3815,1202,1202,3812,3813,3814,3813,3814,3813,3814,3813,3813,3814,4071,657,855,790,791,722,722,722,854,659,0,',
            '0,721,722,917,854,658,658,658,851,1200,1202,1202,1201,1202,1201,1202,1201,1202,1201,1202,1201,1202,1202,1202,1202,1202,1202,1202,1203,658,855,722,854,855,722,722,853,722,723,0,',
            '803,784,1044,1045,1044,1045,1044,1045,1044,1517,1519,1520,1518,1519,1520,1518,1519,1518,1202,1202,1202,1202,1202,1202,1202,1518,1518,1519,1585,1045,1044,1045,1044,1045,1044,1045,1044,1045,720,803,',
            '3877,3878,3877,3878,3877,3878,3877,3878,3877,3941,3941,3941,3941,3941,3941,3941,3941,3751,1202,1202,1202,1202,1202,1202,1202,3748,3941,3941,3941,3877,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,',
            '3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3750,3750,3750,3750,3750,3750,3750,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,'
        ],
        o:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,1397,1398,1399,1397,1398,1399,1400,0,',
            '0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,1832,1832,172,1832,1832,1832,1832,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,1706,1771,1771,236,1771,1771,1771,1771,1707,0,0,0,0,1268,1269,1270,1271,0,0,0,0,0,0,',
            '0,0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,1706,1771,1771,1771,364,1771,1771,1771,1771,1771,1708,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,',
            '0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,1706,1771,1771,1771,1771,300,1771,1771,1771,1771,1771,1772,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,1706,1771,1771,1771,1771,1771,300,1771,1771,1771,1771,1771,1772,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1706,1771,1771,1771,1771,1771,1771,300,1771,1771,1771,1771,1771,1772,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1705,1771,1771,1771,1771,1771,1771,1771,300,1771,1771,1771,1771,1771,1770,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1768,1771,1771,1771,1771,1771,1771,1771,236,1771,1771,1771,1771,1704,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1768,1771,1771,1771,1771,1771,1771,1771,364,1771,1771,1771,1704,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,172,1833,1834,1834,1834,1834,1834,1834,1834,300,1834,1834,1835,0,0,0,106,44,44,105,423,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,173,44,44,44,44,107,0,0,0,236,0,0,0,106,44,44,108,3796,3797,3797,3798,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,3796,3797,3797,3797,3798,44,174,109,44,43,108,45,44,44,110,0,0,3796,3797,3797,3798,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,3796,3797,3797,3797,3798,0,300,0,0,364,0,0,0,3796,3797,3797,3797,3798,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,3796,3797,3797,3798,0,0,0,0,0,3796,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3798,0,0,0,0,0,0,0,0,0,0,0,',
            '804,3737,3739,0,3995,0,0,0,0,0,0,0,3796,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3798,0,0,0,0,0,0,0,0,0,0,0,801,',
            '3877,3737,3739,3964,3991,3964,3964,3964,3964,3964,3964,3964,3860,3861,3861,3861,3861,3861,3861,3861,3861,3861,3861,3861,3861,3861,3861,3862,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3624,',
            '3941,3737,3739,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3752,'
        ],
        p:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,1832,1832,1832,1832,1832,1832,172,1832,1832,1832,1832,1832,1832,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1706,1771,1771,1771,1771,1771,1771,236,1771,1771,1771,1771,1771,1771,1707,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1706,1771,1771,1771,1771,1771,1771,1771,300,1771,1771,1771,1771,1771,1771,1771,1707,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1771,1771,1771,1771,1771,1771,1771,1771,236,1771,1771,1771,1771,1771,1771,1771,1771,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1771,1771,1771,1771,1771,1771,1771,1771,364,1771,1771,1771,1771,1771,1771,1771,1771,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1771,1771,1771,1771,1771,1771,1771,1771,300,1771,1771,1771,1771,1771,1771,1771,1771,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1771,1771,1771,1771,1771,1771,1771,1771,236,1771,1771,1771,1771,1771,1771,1771,1771,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1771,1771,1771,1771,1771,1771,1771,1771,300,1771,1771,1771,1771,1771,1771,1771,1771,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1771,1771,1771,1771,1771,1771,1771,1771,236,1771,1771,1771,1771,1771,1771,1771,1771,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1769,1771,1771,1771,1771,1771,1771,1771,364,1771,1771,1771,1771,1771,1771,1771,1704,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1769,1771,1771,1771,1771,1771,1771,300,1771,1771,1771,1771,1771,1771,1704,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,1769,1771,1771,1771,1771,1771,236,1771,1771,1771,1771,1771,1704,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1769,1771,1771,1771,1771,300,1771,1771,1771,1771,1704,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1834,1834,1834,1834,236,1834,1834,1834,1834,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,106,44,107,300,106,44,107,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,',
            '0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,422,104,4052,3797,3797,3797,3797,3797,4054,105,423,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,4052,3797,3797,3797,3797,3864,3797,3797,3797,3797,4054,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,4052,3797,3797,3797,3797,3864,3864,3864,3797,3797,3797,3797,4054,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,4052,3797,3797,3797,3797,3864,3864,3864,3797,3797,3797,3797,4054,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,4052,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,3797,4054,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,',
            '804,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4052,3797,3797,3797,3797,3797,3797,3797,3797,3797,4054,0,0,0,0,0,0,0,0,0,0,0,0,0,801,',
            '3816,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3860,3861,3861,3861,3861,3861,3861,3861,3862,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3964,3624,',
            '3944,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3965,3752,'
        ],
        q:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,89,90,91,92,93,94,95,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,153,154,155,156,157,158,159,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,217,218,219,220,221,222,223,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,',
            '0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,',
            '0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,',
            '0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,408,409,410,411,412,413,414,415,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,472,473,474,475,476,477,478,479,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,538,537,540,541,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3557,3558,3559,601,604,605,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,538,665,542,543,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,602,603,606,3493,3494,3495,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,538,539,540,541,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,602,603,604,605,0,0,0,0,0,0,',
            '1305,1306,1307,1308,1310,1311,1313,1314,1315,1317,1318,1306,1307,1308,1310,1311,1313,1314,1315,1317,1318,1306,1307,1308,1310,1311,1313,1314,1315,1317,1702,1690,1691,1692,1310,1311,1313,1314,1315,1316,',
            '1369,1370,1371,1372,1374,1375,1377,1378,1379,1381,1382,1370,1371,1372,1374,1375,1377,1378,1379,1381,1382,1370,1371,1372,1374,1375,1377,1378,1379,1381,1766,1754,1755,1756,1374,1375,1377,1378,1379,1380,',
            '1433,1434,1435,1436,1438,1439,1441,1442,1443,1445,1446,1434,1435,1436,1438,1439,1441,1442,1443,1445,1446,1434,1435,1436,1438,1439,1441,1442,1443,1445,1830,1818,1819,1820,1438,1439,1441,1442,1443,1444,',
            '1497,1498,1499,1500,1502,1503,1505,1506,1507,1509,1510,1498,1499,1500,1502,1503,1505,1506,1507,1509,1510,1498,1499,1500,1502,1503,1505,1506,1507,1509,1894,1882,1883,1884,1502,1503,1505,1506,1507,1508,',
            '1561,1562,1563,1564,1566,1567,1569,1570,1571,1573,1574,1562,1563,1564,1566,1567,1569,1570,1571,1573,1574,1562,1563,1564,1566,1567,1569,1570,1571,1573,1958,1946,1947,1948,1566,1567,1569,1570,1571,1572,',
            '1625,1626,1627,1628,1630,1631,1633,1634,1635,1637,1638,1626,1627,1628,1630,1631,1633,1634,1635,1637,1638,1626,1627,1628,1630,1631,1633,1634,1635,1637,2022,2010,2011,2012,1630,1631,1633,1634,1635,1636,',
            '3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,',
            '3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,'
        ],
        r:[
            '0,0,0,88,89,90,91,92,93,94,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,152,153,154,155,156,157,158,159,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,216,217,218,219,220,221,222,223,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,25,26,27,28,29,30,31,0,0,0,0,',
            '0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,88,89,90,91,92,93,94,95,0,0,0,0,',
            '0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,152,153,154,155,156,157,158,159,0,0,0,0,',
            '0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,216,217,218,219,220,221,222,223,0,0,0,0,',
            '0,0,0,408,409,410,411,412,413,414,415,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,',
            '0,0,0,472,473,474,475,476,477,478,479,0,0,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,',
            '34,35,36,37,0,538,539,542,543,0,34,35,36,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,280,281,282,283,284,285,286,287,0,0,0,0,',
            '98,99,100,101,0,602,603,606,3493,3495,98,99,100,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,344,345,346,347,348,349,350,351,0,0,0,0,',
            '162,163,164,165,0,538,539,540,541,0,162,163,164,165,0,0,0,0,0,0,0,0,0,0,0,0,0,0,408,409,410,411,412,413,414,415,0,0,0,0,',
            '226,227,228,229,0,602,537,604,605,0,226,227,228,229,0,0,0,0,0,0,0,0,0,0,0,0,0,0,472,473,474,475,476,477,478,479,0,0,0,0,',
            '290,291,292,293,3557,3559,601,540,541,0,290,291,292,293,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,538,718,719,541,0,0,0,0,0,0,',
            '354,355,356,357,0,602,665,604,605,0,354,355,356,357,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,602,782,783,605,0,0,0,0,0,0,',
            '1696,1697,1698,1699,1701,1702,1690,1691,1692,1694,1695,1697,1698,1699,0,1305,1313,1314,1315,1317,1318,1306,1307,1308,1310,1311,1313,1314,1315,1317,1702,1690,1691,1692,1310,1311,1313,1314,1315,1316,',
            '1760,1761,1762,1763,1765,1766,1754,1755,1756,1758,1759,1761,1762,1763,1764,1369,1377,1378,1379,1381,1382,1370,1371,1372,1374,1375,1377,1378,1379,1381,1766,1754,1755,1756,1374,1375,1377,1378,1379,1380,',
            '1824,1825,1826,1827,1829,1830,1818,1819,1820,1822,1823,1825,1826,1827,1828,1433,1441,1442,1443,1445,1446,1434,1435,1436,1438,1439,1441,1442,1443,1445,1830,1818,1819,1820,1438,1439,1441,1442,1443,1444,',
            '1888,1889,1890,1891,1893,1894,1882,1883,1884,1886,1887,1889,1890,1891,1892,1497,1505,1506,1507,1509,1510,1498,1499,1500,1502,1503,1505,1506,1507,1509,1894,1882,1883,1884,1502,1503,1505,1506,1507,1508,',
            '1952,1953,1954,1955,1957,1958,1946,1947,1948,1950,1951,1953,1954,1955,1956,1561,1569,1570,1571,1573,1574,1562,1563,1564,1566,1567,1569,1570,1571,1573,1958,1946,1947,1948,1566,1567,1569,1570,1571,1572,',
            '2016,2017,2018,2019,2021,2022,2010,2011,2012,2014,2015,2017,2018,2019,2020,1625,1633,1634,1635,1637,1638,1626,1627,1628,1630,1631,1633,1634,1635,1637,2022,2010,2011,2012,1630,1631,1633,1634,1635,1636,',
            '3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,',
            '3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,'
        ],
        s:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,472,473,474,475,476,477,478,479,0,0,0,0,',
            '1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,538,539,540,541,0,0,0,0,0,0,',
            '1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,602,537,604,605,0,0,0,0,0,0,',
            '1396,1397,1398,1399,1397,1398,1399,1400,0,0,0,0,0,1268,1269,1270,1271,1269,1270,1271,1272,0,0,0,0,0,0,0,3557,3558,3559,601,540,541,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,602,665,604,605,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1397,1398,1399,1400,32,33,0,0,0,0,0,0,0,538,539,540,541,0,0,0,0,0,0,',
            '0,0,0,106,44,44,107,0,0,106,44,44,107,0,0,0,0,0,0,0,0,96,97,0,0,0,0,0,0,0,602,603,604,605,0,0,0,0,0,0,',
            '0,0,0,236,0,0,236,0,0,236,0,0,236,0,0,0,0,0,0,0,0,160,161,0,0,0,0,0,0,0,538,539,542,543,0,0,0,0,0,0,',
            '0,0,0,4052,4053,4053,4053,4053,4053,4053,4053,4053,4054,0,0,0,0,0,0,0,0,224,225,1268,1269,1270,1271,1272,0,0,602,603,606,3493,3494,3495,0,0,0,0,',
            '0,0,0,0,0,364,0,0,0,0,364,0,0,35,36,37,0,0,0,0,0,288,289,1332,3341,3342,3343,1336,0,0,538,539,670,541,0,0,0,0,0,0,',
            '0,0,0,0,0,300,0,0,0,0,300,0,98,99,100,101,0,0,0,0,0,352,353,1396,1397,1398,1399,1400,0,0,602,603,604,605,0,0,0,0,0,0,',
            '0,0,0,0,0,236,0,0,0,0,236,0,162,163,164,165,0,0,0,0,0,416,417,0,0,0,0,0,0,0,666,667,668,669,0,0,0,0,0,0,',
            '0,0,0,0,4052,4053,4053,4053,4053,4053,4053,4054,226,227,228,229,0,0,0,0,20,21,22,23,0,0,0,0,801,802,858,859,860,861,803,802,803,804,0,0,',
            '0,0,0,0,0,364,0,0,0,0,364,0,290,291,292,293,0,0,0,0,84,85,86,87,0,0,0,801,4002,3877,3877,3877,3877,3877,3877,3877,3877,3879,0,0,',
            '0,0,0,0,0,300,0,0,0,0,300,0,354,355,356,357,0,0,0,0,148,149,150,151,0,0,0,3876,3939,4006,4005,4006,4005,4006,4005,4006,4005,3943,0,0,',
            '0,0,0,0,0,236,0,0,0,0,236,0,418,419,420,421,0,0,0,0,212,213,214,215,0,0,0,3812,3813,3814,3813,3814,3813,3814,3813,3814,3813,3815,0,0,',
            '0,0,0,0,0,4052,4053,4053,4053,4053,4054,0,482,483,484,485,0,0,0,0,276,277,278,279,0,0,0,1200,1201,1202,1201,1201,1201,1201,1201,1201,1201,1203,0,0,',
            '0,1069,1070,1071,0,364,0,0,0,0,364,0,546,547,548,549,0,0,0,0,340,341,342,343,689,690,0,1264,1201,1202,1201,1201,1202,1202,1202,1202,1201,1203,0,0,',
            '0,1133,1134,1135,0,173,44,105,615,104,110,0,0,611,612,613,0,0,801,804,404,405,406,407,753,754,0,1200,1202,1201,1201,1201,1201,1202,1202,1202,1201,1203,0,0,',
            '0,1197,1198,1199,0,300,0,486,231,487,300,738,738,675,676,0,0,801,4002,3877,3878,3878,3878,3878,3878,3879,0,1200,1202,1201,1453,1201,1202,1202,1202,1202,1201,1203,0,0,',
            '804,1261,1262,1263,802,616,802,803,802,803,616,738,738,739,740,0,0,3876,3939,3941,3941,3942,3941,3941,3941,3943,1061,1517,1519,1519,1393,1519,1519,1519,1325,1519,1519,1389,802,803,',
            '3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3878,3877,3941,3617,3618,3619,3941,3941,3941,3942,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3877,3878,',
            '3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3681,3682,3683,3941,3942,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,3941,'
        ],
        t:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,42,109,46,0,0,0,0,0,0,0,0,0,0,0,0,1110,1111,1111,1111,1111,1111,1111,1111,1111,1112,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,0,0,0,0,3673,3674,3675,0,0,0,0,1110,1111,1111,1111,1111,1111,1111,1111,1111,1112,0,',
            '0,0,0,0,0,422,104,44,44,108,44,44,105,423,0,0,0,0,0,0,0,0,0,3670,0,0,0,0,0,1110,1111,1111,1111,1111,1111,1111,1111,1111,1112,0,',
            '0,0,1514,1515,1516,3799,3735,3736,3735,3736,3735,3736,3735,3736,0,0,0,3607,3734,3734,3734,3734,3734,3672,0,0,0,0,0,4052,4053,4053,4053,4053,4053,4053,4053,4053,4054,0,',
            '0,0,1578,1579,1580,3800,364,0,0,0,0,0,0,364,0,0,3735,3736,3734,3608,0,0,364,0,0,738,738,0,0,364,0,0,0,738,738,738,0,0,364,0,',
            '0,0,1642,1643,1644,3606,300,0,0,0,0,0,0,236,0,0,3670,364,0,3670,0,0,236,0,738,738,738,0,0,236,738,738,0,738,738,738,738,738,236,0,',
            '0,0,3735,3736,3735,3736,300,0,0,0,3607,3734,3734,3734,3734,3734,3672,300,0,3670,0,0,3735,3736,3606,3735,3736,45,43,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,0,',
            '0,0,364,0,0,0,300,0,0,0,3670,0,0,364,0,0,422,102,0,3670,0,0,0,0,364,0,0,0,0,364,0,0,1514,1515,1515,1515,1515,1516,3799,0,',
            '0,0,300,0,0,0,300,0,0,0,3670,0,0,300,0,422,295,487,0,3670,0,0,0,0,300,0,0,0,0,236,0,0,1578,1579,1579,1579,1579,1580,3800,0,',
            '0,0,300,0,0,0,236,0,0,0,3670,0,0,300,422,168,552,0,3609,3610,3611,0,0,0,300,0,0,0,0,3735,3736,3799,1642,1643,1643,1643,1643,1644,3799,0,',
            '0,0,170,43,3606,3606,3606,0,0,3609,3610,3611,0,173,41,550,38,0,0,0,0,0,0,422,102,0,0,0,0,364,0,3800,173,44,108,108,44,110,3800,0,',
            '0,0,0,0,0,0,364,0,0,0,0,0,0,300,0,0,300,0,0,0,0,422,166,168,169,615,104,3606,105,102,0,3735,3736,3735,3736,3735,3736,3735,3736,0,',
            '0,0,0,0,0,0,300,0,1174,1238,1239,1240,1176,236,0,0,300,0,1174,1175,1176,39,231,232,233,232,552,0,39,487,0,0,0,364,0,0,0,0,364,0,',
            '0,0,0,0,0,0,173,43,3735,3736,3735,3736,3735,3736,45,105,102,0,1174,1175,1176,236,3606,39,38,486,38,0,236,0,0,0,0,300,0,0,0,0,300,0,',
            '0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,486,40,43,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,0,0,0,236,0,0,0,0,236,0,',
            '0,0,0,0,0,0,300,0,0,0,0,0,0,0,1174,1175,1175,1175,1176,0,0,364,0,0,0,0,0,0,364,0,0,0,0,3735,3736,3735,3736,3735,3736,0,',
            '0,0,0,0,0,0,236,0,0,1174,1175,1175,1175,1176,1174,1175,1175,1175,1176,0,0,236,0,0,0,0,0,0,236,0,0,0,0,364,0,0,0,0,364,0,',
            '0,0,0,3735,3736,3735,3736,1174,1238,1239,1240,1176,1174,1175,1175,1176,1174,1175,1175,1176,0,3735,3736,3735,3736,3735,3736,3735,3736,0,0,0,0,236,0,0,0,0,236,0,',
            '0,0,0,3799,1514,1516,364,1174,1238,1239,1240,1176,1174,1175,1175,1176,1174,1175,1175,1176,0,364,0,0,0,0,0,0,364,0,0,691,692,3799,1515,1515,1515,1515,3799,0,',
            '804,0,0,3800,1642,1644,236,1174,1238,1239,1240,1176,1174,1175,1175,1176,1174,1175,1175,1176,0,236,0,0,0,0,0,0,236,0,0,755,756,3800,1579,1579,1579,1579,3800,801,',
            '3877,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3799,3964,3964,3964,3964,3964,3964,3799,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3878,',
            '3941,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3800,3965,3965,3965,3965,3965,3965,3800,3735,3736,3735,3736,3735,3736,3735,3736,3735,3736,3941,'
        ],
    };
    
    RocketTux.forest2 = {
        a:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,',
            '0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,',
            '0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1557,1558,1559,1558,1560,0,0,1557,1558,1559,1558,1560,0,0,0,0,0,0,0,0,0,0,0,0,887,888,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,1557,1682,3427,3427,3427,1624,0,1557,1682,3427,3427,3427,1624,0,0,0,0,0,993,994,995,996,948,949,950,951,952,953,958,959,995,996,0,',
            '0,0,0,0,1557,1558,1559,1682,3363,3491,3554,3554,1424,1812,1682,3363,3491,3554,3554,1424,1430,0,0,0,0,1230,1231,1059,1060,1012,1013,1014,1015,1016,1017,1022,1023,1059,1060,0,',
            '0,0,0,1557,1682,3427,3427,3363,3554,3554,1745,1878,1680,1619,3363,3554,3554,1745,1879,1880,1365,1430,0,0,1038,1294,1295,1486,1124,1076,1077,1078,1079,1080,1081,1086,1087,1123,1260,0,',
            '0,0,1557,1682,3363,3491,3554,3490,3554,1745,1680,1362,1427,1877,1878,1879,1878,1680,1362,1362,1362,1365,1430,819,910,1358,1359,1550,1188,1140,1141,1142,1143,1020,1021,1150,1151,1323,1324,0,',
            '1559,1558,1682,3363,3555,3554,3490,3554,3554,1809,1622,1623,1622,1623,1622,1623,1622,1623,1622,1622,1622,1623,1304,883,974,1422,1423,1614,1252,1148,1149,1206,1207,1084,1085,1214,1215,1449,1559,1559,',
            '3426,3427,3363,3554,3554,3490,3490,3554,3490,3362,3427,3427,3427,3427,3426,3427,3426,3427,3427,3427,3427,3427,3427,3427,3426,3427,3427,3427,3427,3427,3427,3427,3426,3427,3427,3427,3427,3427,3426,3427,',
            '3490,3554,3554,3490,3555,3491,3491,3555,3490,3490,3491,3554,3491,3490,3555,3491,3490,3491,3490,3491,3490,3554,3490,3555,3490,3491,3554,3490,3490,3491,3555,3555,3490,3490,3555,3491,3554,3554,3490,3555,'
        ],
        b:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,172,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,',
            '0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,',
            '0,0,0,0,0,0,0,1557,1558,236,1560,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,1396,1397,1398,1399,1400,',
            '0,0,0,0,0,0,0,1621,3427,3427,1681,1560,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,1557,1618,3490,3491,3362,1624,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,1557,1682,3363,3491,3490,3555,3556,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1557,1558,1560,0,0,0,0,',
            '0,0,0,0,1557,1682,3363,3555,3490,3490,3554,3554,1237,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1621,3427,1681,1560,0,0,0,',
            '0,0,0,1557,1682,3363,3491,3555,3491,3555,3555,3554,1752,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1557,1618,3490,3362,1681,1560,0,0,',
            '0,0,0,1621,3363,3490,3554,3555,3555,3490,3555,3555,3486,3556,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1557,1682,3363,3490,3555,3362,1681,1560,0,',
            '0,0,1557,1618,3555,3555,3555,3491,3555,3555,3491,3555,3555,3555,1237,0,0,0,0,991,992,0,0,0,991,992,0,0,0,0,1557,1682,3363,3490,3555,3491,3555,3362,1624,0,',
            '0,1557,1682,3363,3555,3554,3555,3554,3555,3554,3555,3554,3555,3555,1752,0,0,0,1054,1055,0,0,0,1054,1055,0,0,0,0,1557,1682,3363,3555,3555,3491,3555,3490,3490,1688,0,',
            '0,1621,3363,3555,3555,3555,3555,3491,3555,3555,3554,3555,3555,3554,3556,0,0,1117,1118,1119,1120,0,1117,1118,1119,1120,0,0,0,1621,3363,3555,3491,3554,3554,3490,3555,3555,1617,1560,',
            '0,1685,3490,3555,1745,1878,1879,1879,1746,3555,3555,3555,3491,3555,3555,1237,0,1181,1182,1183,1184,0,1181,1182,1183,1184,0,0,0,3492,3555,3490,3555,3555,3491,3555,3555,3491,3362,1624,',
            '0,1749,3555,1745,1680,1426,1427,1427,1362,1746,3555,3555,3490,3555,3555,3556,0,1245,1246,1247,1246,1246,1246,1246,1247,1246,1246,1248,1236,3555,3491,3490,3555,3490,3555,3490,3554,3555,3555,1688,',
            '0,1234,1878,1680,1363,1362,1362,1363,1426,1744,1879,1746,3555,3555,3554,3553,3487,3487,3488,3489,3486,3487,3488,3489,3487,3488,3489,3486,3487,3552,3491,3555,3491,3555,3491,3555,1879,1879,1879,1235,',
            '1558,1303,1233,1427,1427,1427,1427,1427,1427,1427,1427,1744,1879,1878,1879,1879,1878,1879,1878,1879,1878,1879,1878,1879,1878,1879,1878,1879,1878,1879,1878,1879,1878,1879,1878,1879,1426,1426,1232,1304,',
            '3427,3426,3363,3486,3487,3486,3487,3486,3487,3551,1363,1427,1362,1427,1363,1427,1427,1362,1427,1427,1363,1427,1363,1427,1426,1427,1363,1427,1427,1426,1427,1362,1426,1426,1362,1426,1426,3550,3362,3427,',
            '3491,3555,3555,3491,3554,3554,3555,3554,3555,3553,3486,3486,3487,3488,3489,3486,3487,3488,3489,3486,3487,3488,3489,3486,3487,3488,3489,3489,3486,3487,3488,3486,3487,3488,3486,3486,3488,3552,3555,3555,'
        ],
        c:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,',
            '0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,',
            '0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3492,3486,3489,3487,3486,3488,3556,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1236,3490,1745,1746,3553,3489,3490,3553,3556,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,3492,3486,3489,3486,3490,1684,1744,1878,1746,3553,3489,3553,3556,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,1236,3486,3488,3553,3489,3489,3490,1745,1680,1427,1426,1744,1879,1746,3490,3490,1171,1300,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,1234,1431,1878,1879,1878,1878,1878,1680,1427,1362,1363,1362,1362,1744,1878,1878,1680,1365,1430,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,1429,1366,1495,1363,1426,1427,1427,1555,1622,1623,1622,1623,1622,1623,1556,1363,1426,1362,1362,1364,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1297,1366,1362,1362,1427,1362,1426,1362,1619,3426,3426,3426,3426,3426,3427,1620,1363,1427,1362,1427,1365,1300,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1361,1362,1426,1362,1426,1427,1427,1427,1877,1878,1878,1879,1878,1879,1431,1880,1426,1362,1363,1427,1362,1365,1298,1430,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1425,1426,1362,1426,1362,1362,1555,1622,1623,1623,1556,1426,1362,1362,1495,1426,1363,1363,1426,1362,3550,1173,1172,3556,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,3548,0,1361,1362,1362,1362,1427,1427,1619,3426,3426,3427,1620,1362,1362,1301,1490,1302,1362,1427,1362,1427,3490,1684,1683,3553,3556,0,0,0,0,0,0,0,',
            '0,0,0,0,0,3548,3548,3548,3492,3489,3551,1427,1432,1362,1877,1431,1431,1431,1880,1362,1427,1364,0,1425,1427,1427,1362,3550,3490,1748,1747,3490,3553,3556,0,0,0,0,0,0,',
            '0,0,0,0,3492,3489,3487,3486,3490,3554,3553,3486,3551,1426,1362,1495,1495,1495,1362,3549,1362,1365,1299,1366,1362,3550,3486,3552,3490,1684,1747,3490,3490,3553,3556,0,0,0,0,0,',
            '0,0,0,1236,3490,3490,3553,3490,3490,3490,3554,3490,3553,3486,3551,1362,1362,1363,3549,3549,1362,3550,3488,3486,3486,3552,3490,3554,1745,1680,1744,1878,1746,3490,3553,3488,3556,0,0,0,',
            '1558,1559,1559,3492,3490,3553,3490,3554,3553,3490,3490,3553,3554,3490,3553,3486,3486,3488,3486,3488,3486,3552,3490,3554,3490,3553,3490,1745,1680,1362,1496,1362,1744,1746,3490,3490,3553,3556,1558,1559,',
            '3424,3423,3422,3490,3553,3490,3554,3490,3490,3490,3490,3490,3553,3490,3553,3490,3554,3490,3553,3490,3490,3490,3553,3490,3554,3490,3490,1684,1362,3549,3549,1363,1368,1683,3490,3490,3490,3490,3423,3427,',
            '3489,3553,3490,3554,3554,3554,3554,3554,3489,3554,3490,3554,3554,3554,3490,3490,3554,3554,3554,3553,3490,3553,3554,3554,3554,3554,3554,3489,3486,3486,3487,3486,3487,3489,3554,3490,3490,3554,3554,3553,'
        ],
        d:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,1899,1900,1901,1902,1269,1270,1271,1900,1901,1902,1269,1270,1271,1900,1901,1902,1903,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,1963,3344,3345,3346,3341,3342,3343,3344,3345,3346,3341,3342,3343,3344,3345,3346,1967,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,2027,2028,2029,2030,1397,1398,1399,2028,2029,2030,1397,1398,1399,2028,2029,2030,2031,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1899,1900,1901,1902,1269,1270,1271,1900,1901,1902,1903,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1963,3344,3345,3346,3341,3342,3343,3344,3345,3346,1967,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2027,2028,2029,2030,1397,1398,1399,2028,2029,2030,2031,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,1899,1900,1901,1902,1269,1270,1271,1900,1901,1902,1903,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,1963,3344,3345,3346,3341,3342,3343,3344,3345,3346,1967,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,2027,2028,2029,2030,1397,1398,1399,2028,2029,2030,2031,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,887,888,0,0,0,0,0,0,0,0,0,0,0,0,0,0,887,888,0,0,0,0,0,0,0,0,0,0,887,888,0,0,0,0,0,0,0,',
            '948,949,950,951,952,953,954,955,0,911,912,0,993,994,995,996,948,949,950,951,952,953,958,959,995,996,911,912,948,949,950,951,952,953,954,955,993,994,995,996,',
            '1012,1013,1014,1015,1016,1017,1018,1019,0,975,976,0,1057,1058,1059,1060,1012,1013,1014,1015,1016,1017,1022,1023,1059,1060,975,976,1012,1013,1014,1015,1016,1017,1018,1019,1057,1058,1059,1060,',
            '1076,1077,1078,1079,1080,1081,1082,1083,1038,1039,1040,1041,1387,1122,1123,1260,1076,1077,1078,1079,1080,1081,1086,1087,1123,1259,1039,1040,761,1077,1078,1079,1080,1081,1082,1083,1121,1122,1123,1124,',
            '1140,1141,1142,1143,1144,1145,1146,1147,1102,1103,1104,1105,0,1452,1323,0,1140,1141,1142,1143,1144,1145,1150,1151,1323,1102,1103,1104,825,1141,1142,1143,1020,1021,1146,1147,823,824,1187,1188,',
            '1148,1149,1206,1207,1208,1209,1212,1213,1166,1167,1168,1169,1558,1448,1449,1558,1148,1149,1206,1207,1208,1209,1214,1215,1449,1166,1167,1168,889,1149,1206,1207,1084,1085,1212,1213,883,884,1251,1252,',
            '3422,3423,3424,3425,3426,3427,3424,3425,3426,3427,3422,3423,3424,3423,3422,3427,3422,3423,3424,3423,3426,3427,3422,3423,3424,3425,3426,3427,3422,3423,3424,3426,3426,3427,3422,3423,3424,3425,3426,3427,',
            '3555,3490,3555,3554,3554,3555,3554,3554,3490,3554,3554,3555,3490,3491,3555,3554,3490,3554,3554,3491,3554,3490,3554,3490,3554,3490,3555,3554,3490,3554,3491,3554,3555,3490,3554,3554,3491,3555,3490,3491,'
        ],
        e:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,172,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1899,1900,1901,1902,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1963,3344,3345,3346,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,2027,2028,2029,2030,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1899,1900,1901,1902,1269,1270,1271,1272,0,0,0,0,0,0,300,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1963,3344,3345,3346,3341,3342,3343,1336,0,0,0,0,0,0,300,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2027,2028,2029,2030,1397,1398,1399,1400,0,0,0,0,0,0,300,0,0,0,0,0,0,0,',
            '0,1899,1900,1901,1902,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1110,1111,1112,0,0,0,300,0,0,1268,1269,1270,1271,1272,',
            '0,1963,3344,3345,3346,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1110,1111,1111,1111,1112,0,0,300,0,0,1332,3341,3342,3343,1336,',
            '0,2027,2028,2029,2030,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1110,1111,1111,1111,1111,1111,1112,0,300,0,0,1396,1397,1398,1399,1400,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1110,1111,1111,1111,1111,1111,1111,1111,1112,300,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1255,1256,1257,1258,0,0,0,0,1429,1430,0,1110,1111,1240,1238,1111,1240,1238,1111,1112,300,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1319,1320,1321,1322,1557,1558,1559,1811,1366,1365,1430,1110,1111,1111,1111,1111,1111,1111,1111,1112,616,804,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,1384,1385,1557,1682,3422,3427,3423,3422,3423,3424,3427,3422,3427,3423,3427,3427,3425,3424,3427,3427,3425,3556,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,1557,1558,1448,1449,1682,3363,3490,3554,3554,3491,3554,3490,3554,3490,3554,3490,1745,1879,1746,3554,3491,3554,3555,3490,1237,0,0,0,0,',
            '0,0,0,0,0,0,0,0,1557,1558,1559,1682,3425,3427,3423,3363,3491,3554,3490,3554,3554,3490,3554,1745,1879,1878,1879,1880,1363,1877,1746,3555,3554,3490,3554,3556,0,0,0,0,',
            '0,0,0,0,0,0,1557,1558,1682,3422,3427,3363,3554,1745,1746,3490,3554,3490,3554,3490,3554,3490,1745,1880,1427,1363,1427,1172,3551,1427,1427,1879,1746,3491,3554,3555,3556,0,0,0,',
            '0,0,0,0,1557,1558,1682,3422,3363,3554,3554,3491,3554,1684,1747,3490,1745,1431,1746,3554,3554,3490,1684,1363,1172,3486,3487,3488,3490,3551,1427,1363,1877,1879,1746,3491,3554,1171,1430,0,',
            '0,1557,1558,1559,1682,3425,3363,3554,3554,3491,3554,3490,1745,1680,1877,1879,1880,1495,1363,1426,1746,3490,3488,1173,1747,3554,1745,1878,1746,3553,3488,3551,1426,1363,1427,1878,1879,1880,1428,0,',
            '1558,1682,3422,3423,3363,3554,3491,3554,3490,3554,3490,3554,1684,1363,1427,1363,1172,3551,1426,1363,1877,1879,1879,1880,1877,1879,1880,1427,1877,1746,3490,3553,3486,3551,1363,1427,1426,1362,1686,1751,',
            '3422,3423,3554,3554,3490,3554,3554,3555,3554,3491,3555,3554,1684,1367,1426,1427,3550,3553,3488,3551,1426,1363,1426,1363,1426,1427,1426,1362,1426,1747,3491,3555,3554,3553,3489,3488,3489,3488,3426,3427,',
            '3555,3490,3555,3554,3554,3555,3554,3554,3490,3554,3554,3555,3488,3486,3487,3488,3489,3554,3554,3491,3486,3487,3488,3489,3488,3489,3486,3487,3488,3489,3491,3554,3555,3490,3554,3554,3491,3555,3490,3491,'
        ],
    };
    
    RocketTux.beach = {
        a:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1899,1900,1901,1902,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1963,3344,3345,3346,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,2027,2028,2029,2030,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1899,1900,1901,1902,1269,1270,1271,1272,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1963,3344,3345,3346,3341,3342,3343,1336,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2027,2028,2029,2030,1397,1398,1399,1400,0,',
            '0,0,3438,3500,3500,3500,3500,3439,0,0,0,0,0,3435,0,0,0,3435,0,0,0,0,0,0,0,0,3435,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,2154,2091,2093,2280,2282,2152,0,0,0,0,0,3371,0,3435,0,3371,0,0,0,0,0,0,3435,0,3371,0,3435,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,2154,2219,2221,2347,2283,2152,0,0,0,0,0,3372,3500,3500,3500,3373,0,0,0,0,0,0,3372,3500,3500,3500,3373,0,0,0,0,2214,2213,0,0,0,0,0,',
            '0,0,2154,2280,2282,2344,2346,2152,0,0,0,0,0,1897,2091,2092,2093,1898,0,0,0,0,0,0,1897,1960,1961,1962,1898,0,0,0,2214,2279,2276,2213,0,0,0,0,',
            '0,0,2154,2347,2283,2091,2093,2152,0,0,0,0,0,1897,2155,2156,2157,2024,2025,2025,2025,2025,2025,2025,2026,1898,1959,1897,1898,0,0,2214,2279,1895,1895,2276,2213,0,0,0,',
            '0,0,2154,2344,2346,2219,2221,2152,0,0,0,0,0,1897,2219,2220,2221,1895,1895,2085,1961,1961,2086,1895,1895,2024,2025,2026,1898,0,2214,2279,1895,1895,1895,1895,2276,2213,0,0,',
            '0,3438,3500,3500,3500,3500,3500,3500,3439,0,0,0,0,1897,1895,1895,1895,1895,2148,2342,1959,1959,2343,2151,1895,1895,1895,1895,1898,0,3372,3500,3500,3500,3500,3500,3500,3373,0,0,',
            '0,2154,1895,1895,1895,1895,1895,1895,2152,0,0,0,0,1897,1895,1895,1895,1895,2212,2340,1959,1959,2341,2215,1895,1895,1895,1895,1898,0,1897,1895,1895,1895,1895,1895,1895,1898,0,0,',
            '0,2154,1895,2085,1961,1961,2086,1895,2152,0,0,0,0,1897,1895,1895,1895,1895,1895,2277,2025,2025,2278,1895,1895,1895,1895,1895,1898,0,1897,2091,2093,2091,2093,2091,2093,1898,0,0,',
            '0,2154,2148,2342,1959,1959,2343,2151,2152,0,0,0,0,1897,2280,2281,2281,2282,1895,2280,2281,2281,2282,1895,2280,2281,2281,2282,1898,0,1897,2155,2157,2155,2157,2155,2157,1898,0,0,',
            '0,2154,1898,1959,1959,1959,1959,1897,2155,2156,2156,2156,2156,1897,2344,2345,2345,2346,1895,2347,1959,1959,2283,1895,2344,2345,2345,2346,1898,0,1897,2155,2157,2155,2157,2155,2157,1898,0,0,',
            '0,2154,1898,1959,1959,1959,1959,1897,2155,2156,2156,2156,2156,1897,1895,1895,1895,1895,1895,2347,1959,1959,2283,1895,1895,1895,1895,1895,1898,0,1897,2155,2157,2155,2157,2155,2157,1898,0,0,',
            '3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,'
        ],
        b:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1899,1900,1901,1902,1269,1270,1271,1900,1901,1902,1903,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1963,3344,3345,3346,3341,3342,3343,3344,3345,3346,1967,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2027,2028,2029,2030,1397,1398,1399,2028,2029,2030,2031,0,0,0,0,0,0,0,0,0,0,',
            '0,1899,1900,1901,1902,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1963,3344,3345,3346,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,2027,2028,2029,2030,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1900,1901,1902,1903,0,0,0,0,0,0,0,0,0,0,3438,3500,3500,3500,3500,3500,3500,3500,3500,3500,3439,0,0,',
            '0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3344,3345,3346,1967,0,0,0,0,0,0,0,0,0,0,2154,2091,2092,2093,2091,2092,2093,2091,2092,2093,2152,0,0,',
            '0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,2028,2029,2030,2031,0,0,0,0,0,0,0,0,0,0,2154,2155,2211,2157,2155,2156,2157,2155,2211,2157,2152,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2154,2155,2275,2157,2155,2211,2157,2155,2275,2157,2152,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2154,2155,2147,2157,2155,2275,2157,2155,2147,2157,2152,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,2214,2213,0,0,0,0,0,0,0,0,0,0,0,0,2154,2155,2339,2157,2155,2339,2157,2155,2339,2157,2152,0,0,',
            '0,0,0,0,0,0,0,2214,2213,0,0,0,2214,2279,2276,2213,0,0,0,0,0,0,0,0,3438,3500,3500,3500,3500,3500,3500,3500,3500,3500,3500,3500,3500,3500,3500,3439,',
            '0,0,0,2214,2213,0,2214,2279,2276,2213,0,2214,2279,1895,1895,2276,2213,0,0,0,0,0,0,0,2154,2280,2281,2281,2282,2280,2281,2281,2281,2281,2282,2280,2281,2281,2282,2152,',
            '0,0,2214,2279,2276,2023,2279,1895,1895,2276,2087,2279,1895,1895,2348,1895,2276,2213,0,0,0,0,0,0,2154,2347,1959,1959,2283,2347,1959,2286,1959,1959,2283,2347,1959,1959,2283,2152,',
            '0,2214,2279,1895,1895,2276,2083,1895,1895,2084,2279,1895,1895,1895,1895,1895,1895,2276,2213,0,0,0,0,0,2154,2347,1959,1959,2283,2344,2345,2345,2345,2345,2346,2347,1959,2287,2283,2152,',
            '3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,'
        ],
        c:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1900,1901,1902,1903,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,3344,3345,3346,1967,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,2028,2029,2030,2031,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1268,1269,1270,1271,1900,1901,1902,1903,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,',
            '0,1332,3341,3342,3343,3344,3345,3346,1967,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,',
            '0,1396,1397,1398,1399,2028,2029,2030,2031,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,3438,3500,3500,3500,3500,3500,3439,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,2154,2155,2156,2156,2156,2157,2152,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,2154,2155,2156,2156,2156,2157,2152,0,0,0,0,0,0,0,0,0,2205,2206,2206,2206,2206,2206,2207,0,0,0,0,0,0,',
            '0,0,0,0,0,0,1941,0,1942,1943,1944,3438,3500,3500,3500,3500,3500,3439,0,0,3438,3439,0,0,0,0,0,2269,2270,2270,2270,2270,2270,2271,1942,1943,1944,0,0,0,',
            '0,3400,3401,0,0,0,2005,0,2006,2007,2008,2154,2208,2209,2209,2209,2210,2155,2211,2156,2157,2152,0,0,0,0,0,2333,2334,2334,2334,2334,2334,2335,2006,2007,2008,0,0,0,',
            '0,3464,3720,3593,3850,3851,2069,0,2070,2071,2072,2154,2272,2273,2273,2273,2274,2155,2275,2156,2157,2152,0,0,0,2202,2203,2080,2334,2143,2334,2081,2082,2335,2070,2071,2072,2202,2204,0,',
            '0,3464,3784,3657,3914,3915,2133,0,0,2268,2268,2267,2272,2273,2273,2273,2274,2155,2339,2156,2157,2152,0,0,0,2268,2268,2078,2078,2078,2078,2078,2146,2142,2204,2135,2202,2268,2268,0,',
            '3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,3502,3503,'
        ],
    };
    
    RocketTux.beachfront = {};
    
    RocketTux.candyland = {
        a:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,',
            '0,0,0,0,0,0,0,1529,1530,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,',
            '0,0,0,0,0,0,1529,1593,1594,1530,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,',
            '0,0,0,0,0,1529,1593,1723,1724,1594,1530,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,1529,1593,1657,1458,1458,1658,1594,1530,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1529,1593,1657,3146,3211,3211,3148,1658,1594,1530,0,0,0,0,0,0,0,3335,3336,3334,3336,3337,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,1592,1593,1657,1844,1845,1535,1471,1844,1845,1658,1594,1595,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,1656,1721,1458,1908,1909,1458,1458,1908,1909,1458,1722,1659,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,1586,1971,1972,1973,1974,1971,1972,1973,1974,1522,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,3335,3336,3334,3336,3337,0,0,0,',
            '0,0,0,1586,2035,2036,2037,2038,2035,2036,2037,2038,1522,1904,1905,1906,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,',
            '0,0,0,1586,1458,2100,2101,1458,1458,2100,2101,1458,1522,1968,1969,1970,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,',
            '0,0,0,1586,1458,2164,2165,1458,1458,2164,2165,1458,1522,2032,2033,2034,0,0,0,0,0,3210,3211,3212,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,',
            '0,1784,1785,1790,1791,2039,2040,2041,1276,1277,2039,2041,1522,2096,2097,2098,0,0,0,3210,3211,3275,3275,3275,3211,3212,0,0,0,0,0,0,0,0,235,0,0,0,0,0,',
            '0,1848,1849,1854,1855,2103,2104,2105,1340,1405,2103,2105,1522,2160,2161,2162,0,0,0,3274,3275,2300,3275,3275,2301,3276,0,0,0,0,0,0,0,0,235,0,0,0,0,0,',
            '3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,',
            '3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,'
        ],
        b:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3333,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,442,443,444,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,3335,3336,3336,3334,3337,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,442,362,444,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,3335,3336,3334,3337,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,442,362,444,0,0,0,0,0,0,0,3271,3271,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,3210,3211,3211,3211,3211,3211,3211,3212,0,0,0,0,0,0,3271,3271,0,0,0,3271,0,0,0,0,',
            '442,443,443,444,0,0,0,235,0,0,0,0,0,0,0,0,3274,3275,3275,3275,3275,3275,3275,3276,0,0,0,0,0,3271,3271,0,0,0,3271,3271,3271,0,0,0,',
            '506,697,507,504,444,0,442,362,444,0,0,0,0,0,0,0,3274,3275,3275,3275,3275,3275,3275,3276,442,443,443,443,3271,3271,3271,443,443,3271,3271,3271,3271,3271,443,444,',
            '3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3275,3275,3275,3275,3275,3275,3275,3275,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,',
            '3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,'
        ],
        c:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,3335,3334,3336,3336,3334,3337,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,235,0,0,235,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,235,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,',
            '0,0,0,235,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,',
            '0,0,0,235,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,',
            '0,3335,3334,3336,3336,3336,3336,3334,3337,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,235,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,235,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1469,1470,0,0,',
            '0,0,235,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3335,3336,3336,3336,3334,3336,3336,3336,3337,0,0,0,1533,1534,0,0,',
            '0,0,235,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,1469,1597,1598,1470,0,',
            '0,0,235,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,1533,1590,1591,1534,0,',
            '0,3335,3334,3336,3336,3336,3336,3334,3337,0,0,0,0,0,3271,3271,3271,3271,3271,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,1596,1597,1523,1525,1598,1599,',
            '0,0,235,0,0,0,0,235,0,0,0,0,0,3271,3271,3271,3271,3271,3271,3271,0,0,0,0,0,0,0,0,235,0,0,0,0,0,1660,1725,2103,2105,1726,1663,',
            '0,0,235,0,0,0,0,235,0,0,0,0,3271,3271,3271,3271,3271,3271,3271,3271,3271,0,0,0,0,0,0,0,235,0,0,0,0,0,0,1586,1788,1789,2175,1787,',
            '0,0,235,0,0,0,0,235,0,0,0,3271,3271,3271,3271,3271,3271,3271,3271,3271,3271,3271,0,0,0,0,0,0,235,0,0,0,0,0,0,1401,1275,1849,1850,1851,',
            '0,0,235,0,0,0,0,235,0,0,3271,3271,3271,3271,3271,3271,3271,3271,3271,3271,3271,3271,3271,0,0,0,0,0,235,0,0,0,0,0,0,1465,1339,1913,1914,1915,',
            '3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,',
            '3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,'
        ],
        d:[
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '1268,1269,1270,1271,1272,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,',
            '1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,',
            '1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,3335,3336,3336,3334,3336,3336,3337,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,',
            '0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,',
            '0,1268,1269,1270,1271,1272,0,0,0,0,235,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,',
            '0,1332,3341,3342,3343,1336,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,1396,1397,1398,1399,1400,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,0,0,0,0,0,0,0,3408,3409,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,235,0,0,0,0,3408,3409,0,0,0,0,3271,3472,3473,3271,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,235,0,0,533,534,3984,3985,3601,3601,3601,3601,3601,3603,3728,3729,3730,3731,3602,0,533,534,0,0,0,3404,3405,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,235,0,0,597,598,4048,4049,3665,3665,3665,3665,3665,3667,3792,3793,3794,3795,3666,0,597,598,0,0,3271,3468,3469,3271,0,0,0,',
            '0,0,3404,3405,0,0,0,0,0,0,235,0,0,661,662,532,532,0,0,0,0,0,3472,3473,0,0,0,0,0,661,662,0,3271,3271,3468,3469,3271,3271,0,0,',
            '0,3271,3468,3469,3271,0,0,0,0,0,235,0,0,725,726,596,596,0,0,0,0,0,3472,3473,0,0,0,0,0,725,726,3271,3271,3271,3468,3469,3271,3271,3271,0,',
            '3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3212,3472,3473,3210,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,3211,',
            '3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3276,3472,3473,3274,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,3275,'
        ],
    };
  },
};
