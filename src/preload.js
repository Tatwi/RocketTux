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
    
    // Initialize variables used to generate levels
    this.worldObjects(); // Tiled objects from world texture
    this.otherVariables(); // Misc objects
    
    // Initialize player saved data and preferences
    this.loadSavedData();
  },
  create: function() {
  	this.state.start('MainMenu');
  },
  worldObjects: function(){
    // Each of these are 10 tile wide sections of maps. I laid them out using the Tiled editor and copied the values here.
    RocketTux.candyland1 = [
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
        '0,0,0,0,0,0,0,0,0,0,',
        '0,234,235,236,237,0,0,0,0,0,',
        '0,266,267,268,269,0,0,0,0,0,',
        '0,298,299,300,301,0,134,135,136,137,',
        '0,330,331,332,333,0,166,167,168,169,',
        '0,362,363,364,365,366,198,199,200,201,',
        '393,394,395,396,397,398,230,231,232,233,',
        '910,910,910,910,910,910,910,910,910,910,',
        '942,942,942,942,942,942,942,942,942,942,',
    ];
  },
  otherVariables: function(){
    RocketTux.songs = ['song1', 'song2', 'song1', 'song2', 'song1', 'song2', 'song1']; // More songs will be added later
  },
  loadSavedData: function(){
    // N/A atm
  }
};
