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
    this.load.image('tiles', 'data/platforms.png');
    this.load.spritesheet('tux', 'data/tux.png', 64, 64);
    this.load.spritesheet('coin', 'data/coin.png', 32, 64);
    this.load.spritesheet('effects', 'data/effects.png', 64, 64);
    this.load.audio('collect', 'data/sounds/collect.ogg');
    this.load.audio('menu', 'data/music/menu.ogg');
    this.load.audio('song1', 'data/music/song1.ogg');
    this.load.audio('song2', 'data/music/song2.ogg');
  },
  create: function() {
  	this.state.start('MainMenu');
  }
};
