RocketTux.MainMenu = function(){};
 
RocketTux.MainMenu.prototype = {
  create: function() {
  	// Add background
    this.activeBG = this.game.add.sprite(0, 0, 'skies');
    this.activeBG.animations.add('stand', [3], 1, true);
    this.activeBG.scale.setTo(1.25, 0.71); //wide, tall
    this.activeBG.width = this.game.width;
    this.activeBG.play('stand');
    this.activeBG.bringToTop();
    this.activeBG.fixedToCamera = true;
    
    // Game Logo
    this.logo = this.game.add.sprite(412, 52, 'logo')
    this.logo.scale.setTo(2, 0.5);
    this.logo.anchor.setTo(0.5);

    // Music and sounds
    music = this.game.add.audio('menu');
    music.loop = true;
    music.play();
    this.mouseoverSnd = this.game.add.audio('mouseover');    
  },
  
//==================GAME LOOP START========================
  update: function() {
	// Keyboard input
	if (this.game.input.keyboard.downDuration(Phaser.Keyboard.ONE, 1)){
		this.startGame();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.TWO, 1)){
		this.startGameEasy();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.THREE, 1)){
		this.startGameHard();
	}
  },
//__________________GAME LOOP END___________________________ 
  
  startGame: function () {
    music.destroy();
    RocketTux.gameMode = 'normal';
    this.game.state.start('Game');
  },
  startGameEasy: function () {
    music.destroy();
    //RocketTux.bonusBoosts = 50;
    RocketTux.gameMode = 'easy';
    this.game.state.start('Game');
  },
  startGameHard: function () {
    music.destroy();
    RocketTux.gameMode = 'hard';
    this.game.state.start('Game');
  }
};
