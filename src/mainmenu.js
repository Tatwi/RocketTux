RocketTux.MainMenu = function(){};
 
RocketTux.MainMenu.prototype = {
  create: function() {
  	//show the space tile, repeated
    this.background = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.background.anchor.setTo(0.5);
    
    music = this.game.add.audio('menu');
    music.loop = true;
    music.play();
    
    // UI
    this.world.add(slickUI.container.displayGroup);
    var panel;
    slickUI.add(panel = new SlickUI.Element.Panel(8, 8, 150, this.game.height - 16));

    var btNormal;
    panel.add(btNormal = new SlickUI.Element.Button(0, 0, 140, 80));
    btNormal.events.onInputUp.add(this.startGame, this);
    btNormal.add(new SlickUI.Element.Text(0, 0, 'Play Normal')).center();
    
    var btEasy;
    panel.add(btEasy = new SlickUI.Element.Button(0, 82, 140, 80));
    btEasy.events.onInputUp.add(this.startGameEasy, this);
    btEasy.add(new SlickUI.Element.Text(0, 0, 'Play Easy')).center();
    
    var btHard;
    panel.add(btHard = new SlickUI.Element.Button(0, 164, 140, 80));
    btHard.events.onInputUp.add(this.startGameHard, this);
    btHard.add(new SlickUI.Element.Text(0, 0, 'Play Hard')).center();

    this.add.tween(panel).from({alpha: 0}, 500, Phaser.Easing.Quadratic.In).start();
    this.add.tween(panel).from({x: -150}, 500, Phaser.Easing.Back.InOut).start();
    
    // Coins display
    var tmpCoins = localStorage.getItem('RocketTux-myWallet');
    
    if (tmpCoins == null || tmpCoins == undefined){
        // Initial first saved data
        localStorage.setItem('RocketTux-myWallet', '1');
    }
    
    text = 'My Coins:\n' + localStorage.getItem('RocketTux-myWallet');
   // var displayCoins = this.game.add.text(8, 8, text, style);
   panel.add(new SlickUI.Element.Text(0, 0, text)).center();
    
  },
  update: function() {
/*      
    if(this.game.input.activePointer.justPressed()) {
      music.destroy();
      this.game.state.start('Game');
    }
*/
  },
  startGame: function () {
    music.destroy();
    RocketTux.gameMode = 'normal';
    slickUI.container.displayGroup.removeAll(true);
    this.game.state.start('Game');
  },
  startGameEasy: function () {
    music.destroy();
    //RocketTux.bonusBoosts = 50;
    RocketTux.gameMode = 'easy';
    slickUI.container.displayGroup.removeAll(true);
    this.game.state.start('Game');
  },
  startGameHard: function () {
    music.destroy();
    RocketTux.gameMode = 'hard';
    slickUI.container.displayGroup.removeAll(true);
    this.game.state.start('Game');
  },
};
