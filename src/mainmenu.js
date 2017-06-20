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
    btEasy.events.onInputOver.add(this.btEasyOver, this);
    btEasy.events.onInputOut.add(this.btEasyOut, this);
    btEasy.add(new SlickUI.Element.Text(0, 0, 'Play Easy')).center();
    
    var btHard;
    panel.add(btHard = new SlickUI.Element.Button(0, 164, 140, 80));
    btHard.events.onInputUp.add(this.startGameHard, this);
    btHard.events.onInputOver.add(this.btHardOver, this);
    btHard.events.onInputOut.add(this.btHardOut, this);
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
  btEasyOver: function(){
    this.btEasyTip;
    slickUI.add(this.btEasyTip = new SlickUI.Element.Panel(164, 96, 300, 110));
    var txt = 'Play with 100 Boosts, but get fewer rewards for collecting all the coins in a level.';
    this.btEasyTip.add(new SlickUI.Element.Text(4, 0, txt));
  },
  btEasyOut: function(){
    this.btEasyTip.destroy();
  },
  btHardOver: function(){
    this.btHardTip;
    slickUI.add(this.btHardTip = new SlickUI.Element.Panel(164, 182, 300, 110));
    var txt = 'Play with only 1 Boost and get more rewards for collecting all the coins in a level.';
    this.btHardTip.add(new SlickUI.Element.Text(4, 0, txt));
  },
  btHardOut: function(){
    this.btHardTip.destroy();
  },
};
