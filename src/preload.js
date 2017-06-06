var RocketTux = RocketTux || {};
 
// Load the game assets
RocketTux.Preload = function(){};
 
RocketTux.Preload.prototype = {
  preload: function() {
  	// Show loading screen 
  	this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);
 
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
 
    this.load.setPreloadSprite(this.preloadBar);
 
  	// Load game assets
    this.load.image('world', 'data/world.png');
    this.load.spritesheet('entities', 'data/entities.png', 64, 64);
    this.load.audio('collect', 'data/sounds/collect.ogg');
    this.load.audio('menu', 'data/music/menu.ogg');
    this.load.audio('song1', 'data/music/song1.ogg');
    this.load.audio('song2', 'data/music/song2.ogg');
    this.load.audio('rocketpack-start', 'data/sounds/rocketpack-start.ogg');
    this.load.audio('rocketpack-windup', 'data/sounds/rocketpack-windup.ogg');
    this.load.audio('rocketpack-boost', 'data/sounds/rocketpack-boost.ogg');
    this.load.audio('rocketpack-running', 'data/sounds/rocketpack-running.ogg');
    
    // Initialize variables used to generate levels
    this.worldObjects(); // Tiled objects from world texture
    this.otherVariables(); // Misc objects, variables, settings
    
    // Initialize player saved data and preferences
    this.loadSavedData();
  },
  create: function() {
  	this.state.start('MainMenu');
  },
    otherVariables: function(){
    RocketTux.songs = ['song1', 'song2', 'song1', 'song2', 'song1', 'song2', 'song1']; // More songs will be added later
    RocketTux.groundSpeed = 180; // Preference up to 220
    RocketTux.airSpeed = 300; // Preference up to 340. Star +10.
    RocketTux.boostSpeed = 333; // Preference up to 340. Flame guy +20 at time of collision.
  },
  loadSavedData: function(){
    // N/A atm
  },
  worldObjects: function(){
    // Each of these are 10 tile wide sections of maps. 
    // I laid them out using the Tiled editor and copied the values here, after converting them doc/tiled_value_converter.html.
    RocketTux.candyland = {
        a:[
            '0,0,0,37,0,39,0,37,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,999,1000,998,1000,1001,263,0,',
            '0,0,0,0,0,1023,0,0,0,0,',
            '0,0,0,0,0,1023,0,0,0,0,',
            '0,0,37,0,0,1023,0,37,0,0,',
            '0,876,877,877,877,1023,877,877,877,878,',
            '0,908,909,909,909,909,909,909,909,910,',
            '0,972,973,973,973,973,973,973,973,974,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,39,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,997,',
            '0,0,0,0,0,0,0,0,0,1023,',
            '0,192,193,194,195,196,0,0,0,1023,',
            '0,224,225,226,227,228,0,0,0,1023,',
            '0,256,257,258,259,260,261,262,263,1023,',
            '0,288,289,290,291,292,293,294,295,1023,',
            '0,320,321,322,323,324,325,326,327,1023,',
            '37,352,353,354,355,356,357,358,359,1023,',
            '877,384,385,386,387,388,389,390,391,1023,',
            '909,909,909,909,909,909,909,909,909,909,',
            '941,941,941,941,941,941,941,941,941,941,'
        ],
        b:[
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,202,203,0,0,0,0,0,0,',
            '0,233,234,235,236,0,0,0,0,0,',
            '0,265,266,267,268,0,0,0,0,0,',
            '0,297,298,299,300,0,133,134,135,136,',
            '0,329,330,331,332,0,165,166,167,168,',
            '0,361,362,363,364,365,197,198,199,200,',
            '392,393,394,395,396,397,229,230,231,232,',
            '909,909,909,909,909,909,909,909,909,909,',
            '941,941,941,941,941,941,941,941,941,941,'
        ],
        c:[
            '0,0,0,0,0,0,0,0,0,0,',
            '0,0,0,0,0,0,0,0,0,37,',
            '0,0,0,0,0,0,0,876,877,878,',
            '39,0,0,0,0,0,0,908,909,910,',
            '0,0,0,0,0,0,0,940,941,942,',
            '999,998,1001,0,0,0,0,972,973,974,',
            '0,1023,0,0,0,0,0,0,0,0,',
            '0,1023,0,0,37,0,0,0,0,0,',
            '876,1023,877,877,878,0,0,0,0,0,',
            '908,909,909,909,910,0,0,0,0,0,',
            '940,941,941,941,942,0,0,0,0,0,',
            '972,973,973,973,974,0,0,999,998,1001,',
            '0,0,0,0,0,0,0,0,1023,0,',
            '38,0,0,0,0,0,0,0,1023,0,',
            '0,0,0,0,0,0,0,0,1023,0,',
            '999,1000,998,1000,1001,0,0,0,1023,0,',
            '0,0,1023,0,0,0,0,0,1023,0,',
            '0,0,1023,0,0,0,0,0,1023,0,',
            '0,0,1023,0,0,0,0,0,1023,0,',
            '0,0,1023,0,0,0,37,0,1023,0,',
            '877,877,1023,877,877,877,877,877,1023,877,',
            '909,909,909,909,909,909,909,909,909,909,',
            '941,941,941,941,941,941,941,941,941,941,'
        ],
    }
  },
};
