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
    
    // Enforce coin cap at 9,999,999
    if (tmpCoins > 9999998){
        localStorage.setItem('RocketTux-myWallet', '9999999');
    }
   
    if (tmpCoins == null || tmpCoins == undefined){
        // Initial first saved data
        localStorage.setItem('RocketTux-myWallet', '1');
    }
    
    this.coinIcon
    panel.add(new SlickUI.Element.DisplayObject(8, 265, this.coinIcon = this.game.make.sprite(0, 0, 'atlas')));
    this.coinIcon.frameName = 'ui-coin';
    text = ': ' + localStorage.getItem('RocketTux-myWallet');
    panel.add(new SlickUI.Element.Text(42, 267, text));
    
    // Show game logo
    this.logo = this.coinIcon = this.game.make.sprite(0, 0, 'logo')
    this.logo.scale.setTo(2, 0.5); //wide, tall
    this.logo.anchor.setTo(0.5);
    panel.add(new SlickUI.Element.DisplayObject(408, 40, this.logo));
    
    // Show power up icon
    var tmpPwrup = localStorage.getItem('RocketTux-powerUpActive');
    
    if (tmpPwrup != 'none') {
        var btPowerup;
        panel.add(btPowerup = new SlickUI.Element.Button(30, 306, 70, 70));
        btPowerup.events.onInputOver.add(this.powerupToolTipOver, this);
        btPowerup.events.onInputOut.add(this.powerupToolTipOut, this);
        
        this.powerUpIcon;
        panel.add(new SlickUI.Element.DisplayObject(26, 304, this.powerUpIcon = this.game.make.sprite(0, 0, 'atlas')));
        this.powerUpIcon.frameName = 'pwrup-icon-' + tmpPwrup;
        this.powerUpIcon.scale.setTo(2.5, 2.5); 
    }
    
    // Inventory Window
    this.inventoryWindow;
    slickUI.add(this.inventoryWindow = new SlickUI.Element.Panel(this.game.width - 610, 20, 600, this.game.height - 40));
    var invName;
    this.inventoryWindow.add(invName = new SlickUI.Element.Text(0, 0, 'Inventory'));
    invName.centerHorizontally();
    this.inventoryWindow.visible = false;
    
    // Inventory Button
    var btInventory;
    panel.add(btInventory = new SlickUI.Element.Button(0, this.game.height - 107, 140, 80));
    btInventory.events.onInputUp.add(this.toggleInventory, this);
    btInventory.add(new SlickUI.Element.Text(0, 0, 'Inventory')).center();
    
    // Cubimal Window
    this.cubimalWindow;
    slickUI.add(this.cubimalWindow = new SlickUI.Element.Panel(164, 120, 500, 580));
    var cubName;
    this.cubimalWindow.add(cubName = new SlickUI.Element.Text(0, 0, 'Cubimals'));
    cubName.centerHorizontally();
    this.cubimalWindow.visible = false;
    
    // Cubimal Button
    var btCubimals;
    panel.add(btCubimals = new SlickUI.Element.Button(0, this.game.height - 189, 140, 80));
    btCubimals.events.onInputUp.add(this.toggleCubimals, this);
    btCubimals.add(new SlickUI.Element.Text(0, 0, 'Cubimals')).center();
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
  powerupToolTipOver: function(){
    this.powerupToolTip;
    slickUI.add(this.powerupToolTip = new SlickUI.Element.Panel(164, 300, 360, 130));

    var txt; 
    
    if (RocketTux.powerUpActive == 'star'){
        txt = 'Star: Makes you run at super speed, while also causing you to fly faster.';
    } else if (RocketTux.powerUpActive == 'fire'){
        txt = 'Fire: Makes you fly very fast and gives you a chance to gain a boost when collecting coins (up to 5 boosts).';
    } else if (RocketTux.powerUpActive == 'water'){
        txt = 'Water: Ice Armor makes you invincible and very lucky at no cost, but the armor is consumed after one use.';
    } else if (RocketTux.powerUpActive == 'air'){
        txt = 'Air: Makes you lighter so can jump higher, boost better, and fall more slowly.';
    } else if (RocketTux.powerUpActive == 'earth'){
        txt = 'Earth: Stone Form makes you invincible and a bit more lucky, at the cost of making you much heavier.';
    }
    
    txt += " Powerups are found inside purple boxes!"
    
    this.powerupToolTip.add(new SlickUI.Element.Text(4, 0, txt));
    this.powerupToolTipIsOn = true;
  },
  powerupToolTipOut: function(){
    if (this.powerupToolTipIsOn)
        this.powerupToolTip.destroy();
        
    this.powerupToolTipIsOn = false;
  },
  toggleInventory: function(){
    if (this.inventoryWindow.visible){
        this.inventoryWindow.visible = false;
    } else {
        this.inventoryWindow.visible = true;
    }
  },
  toggleCubimals: function(){
    if (this.cubimalWindow.visible){
        this.cubimalWindow.visible = false;
    } else {
        this.cubimalWindow.visible = true;
    }
  }
};
