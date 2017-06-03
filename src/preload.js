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
    // g = ground, p = platform, 3x2 = 3 wide, 2 high
      
    // Default Theme (Snow)
    RocketTux.snow1 = {
        g:[1,2], 
        p3x3:[1,3,2,4,5,6,7,8],
        p3x2:[1,3,2,4,5,6,4,8],
    };
  },
  otherVariables: function(){
    RocketTux.songs = ['song1', 'song2', 'song1', 'song2', 'song1', 'song2', 'song1']; // More songs will be added later
  },
  loadSavedData: function(){
    // N/A atm
  }
};
