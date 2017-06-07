var RocketTux = RocketTux || {};
 
RocketTux.Boot = function(){};
 
// Game configuration
RocketTux.Boot.prototype = {
  preload: function() {
  	// Loading screen assets
    this.load.image('logo', 'data/logo.png');
    this.load.image('preloadbar', 'data/loadingbar.png');
  },
  create: function() {
    this.game.stage.backgroundColor = '#000000';
 
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.minWidth = 800;
	this.scale.minHeight = 450;
    // Graphics designed for 1280x720
	this.scale.maxWidth = 3840;
	this.scale.maxHeight = 2160;

	this.scale.pageAlignHorizontally = true;
 
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.state.start('Preload');
  }
};
