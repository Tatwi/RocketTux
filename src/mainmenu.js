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
    
    // UI
    this.world.add(slickUI.container.displayGroup);

//==================Main Panel========================
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
    
    // Powerup icon
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
    
    // Quest Button
    var btQuest;
    panel.add(btQuest = new SlickUI.Element.Button(0, this.game.height - 271, 140, 80));
    btQuest.events.onInputUp.add(this.toggleCubimals, this); // Testing place holder
    btQuest.add(new SlickUI.Element.Text(0, 0, 'Quests')).center();
    this.qstOpen = false;
    this.qstPage = 0;
    
    // Cubimal Button
    var btCubimals;
    panel.add(btCubimals = new SlickUI.Element.Button(0, this.game.height - 189, 140, 80));
    btCubimals.events.onInputUp.add(this.toggleCubimals, this);
    btCubimals.add(new SlickUI.Element.Text(0, 0, 'Cubimals')).center();
    this.cubOpen = false;
    this.cubPage = 0;
    
    // Inventory Button
    var btInventory;
    panel.add(btInventory = new SlickUI.Element.Button(0, this.game.height - 107, 140, 80));
    btInventory.events.onInputUp.add(this.toggleInventory, this);
    btInventory.add(new SlickUI.Element.Text(0, 0, 'Inventory')).center();
    this.invOpen = false;
    this.invPage = 0;
    
    this.add.tween(panel).from({alpha: 0}, 500, Phaser.Easing.Quadratic.In).start();
    this.add.tween(panel).from({x: -150}, 500, Phaser.Easing.Back.InOut).start();

//==================INVENTORY========================
    // Inventory Background
    this.invBg = this.game.add.sprite(this.game.width - 461, 10, 'ui-bg')
    this.invBg.scale.setTo(4.54, 6.46); // 454x644
    this.invBg.visible = false;
    // Inventory Window Controls
    this.invPanel;
    slickUI.add(this.invPanel = new SlickUI.Element.Panel(this.game.width - 464, this.game.height - 58, 460, 50));
    this.invPanel.visible = false;
    this.invPage = 0;
    var btInvNext;
    this.invPanel.add(btInvNext = new SlickUI.Element.Button(360, 0, 100, 46));
    btInvNext.events.onInputUp.add(this.invNextPage, this);
    btInvNext.add(new SlickUI.Element.Text(0, 0, 'Next')).center();
    var btInvBack;
    this.invPanel.add(btInvBack = new SlickUI.Element.Button(0, 0, 100, 46));
    btInvBack.events.onInputUp.add(this.invPrevPage, this);
    btInvBack.add(new SlickUI.Element.Text(0, 0, 'Back')).center();
    var invName;
    this.invPanel.add(invName = new SlickUI.Element.Text(0, 0, 'Inventory Page: ' + (this.invPage + 1) ));
    invName.centerHorizontally();
    invName.centerVertically();
    // Quantity/Icon/Description Slots
    this.invQnt = [];
    this.invIcons = this.game.add.group();
    this.invDesc = [];
    var lineSpace = 0;
    for (i = 0; i < 12; i++){
        // Quant
        this.invPanel.add(this.invQnt[i] = new SlickUI.Element.Text(0, -640 + lineSpace, '999'));
        //Icons
        var tmpIcon = this.invIcons.create(this.game.width - 408, 24 + lineSpace, 'atlas');
        tmpIcon.frameName = 'icon-' + i;
        // Description
        this.invPanel.add(this.invDesc[i] = new SlickUI.Element.Text(100, -648 + lineSpace, 'Item Name\nHint line is about this long here.'));

        lineSpace += 53;
    }
    this.invIcons.visible = false;

//==================CUBIMALS========================    
    // Cubimal Window Controls
    var cubPanel;
    slickUI.add(cubPanel = new SlickUI.Element.Panel(164, this.game.height - 58, 504, 50));
    this.invPanel.visible = false;
    this.cubPage = 0;
    var btCubNext;
    cubPanel.add(btCubNext = new SlickUI.Element.Button(400, 0, 100, 46));
    btCubNext.events.onInputUp.add(this.toggleCubimals, this); // Testing place holder
    btCubNext.add(new SlickUI.Element.Text(0, 0, 'Next')).center();
    var btCubBack;
    cubPanel.add(btCubBack = new SlickUI.Element.Button(0, 0, 100, 46));
    btCubBack.events.onInputUp.add(this.toggleCubimals, this); // Testing place holder
    btCubBack.add(new SlickUI.Element.Text(0, 0, 'Back')).center();
    var cubName;
    cubPanel.add(cubName = new SlickUI.Element.Text(0, 0, 'Cubimals Page: ' + (this.invPage + 1) ));
    cubName.centerHorizontally();
    cubName.centerVertically();
  },
  update: function() {
    // Game Loop
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
//==================INVENTORY========================
  fillInv: function(){
    // Change the contents of the inventory page
    var curItem = 0;
    for (i = 0; i < 12; i++){
        curItem = i + this.invPage * 12;
        
        var tmpInvVal = parseInt(localStorage.getItem('RocketTux-invItem' + curItem));
        var spaces = '';
        if (tmpInvVal > 9){spaces = '  ';}
        if (tmpInvVal > 99){spaces = ' ';}
        if (tmpInvVal < 10){spaces = '   ';}
        
        this.invQnt[i].value = spaces + tmpInvVal;
        this.invDesc[i].value = RocketTux.lootNames[curItem] + '\nHint: ' + RocketTux.lootDesc[curItem];
        this.invIcons.getAt(i).frameName = 'icon-' + curItem;
    }
  },
  toggleInventory: function(){
    if (this.invOpen){
        this.invOpen = false; // close
        this.invBg.visible = false;
        this.invPanel.visible = false;
        this.invIcons.visible = false;
    } else {
        this.invOpen = true; // open
        this.fillInv();
        this.invBg.visible = true;
        this.invPanel.visible = true;
        this.invIcons.visible = true;
    }
  },
  invNextPage: function(){
    if (this.invPage == 15){
        return; // Already on last page
    }
    this.invPage += 1;
    this.fillInv();
  },
  invPrevPage: function(){
    if (this.invPage == 0){
        return; // Already on first page
    }
    this.invPage -= 1;
    this.fillInv();
  },
//==================CUBIMALS========================
  toggleCubimals: function(){
    if (this.cubOpen){
        this.cubWindow.destroy();
        this.cubOpen = false;
    } else {
        this.populateCubimals();
        this.cubWindow.visible = true;
    }
  },
  populateCubimals: function(){
    // Create Cubimal Window
    this.cubWindow; 
    slickUI.add(this.cubWindow = new SlickUI.Element.Panel(164, 100, 500, 600));
    this.cubName;
    this.cubWindow.add(this.cubName = new SlickUI.Element.Text(0, 0, 'Cubimals\n Page: ' + (this.cubPage + 1)));
    this.cubName.centerHorizontally();
    this.cubWindow.visible = false; 

    var btNext;
    this.cubWindow.add(btNext = new SlickUI.Element.Button(348, 0, 140, 80));
    btNext.events.onInputUp.add(this.cubNextPage, this);
    btNext.add(new SlickUI.Element.Text(0, 0, 'Next')).center();
    
    var btBack;
    this.cubWindow.add(btBack = new SlickUI.Element.Button(2, 0, 140, 80));
    btBack.events.onInputUp.add(this.cubPrevPage, this);
    btBack.add(new SlickUI.Element.Text(0, 0, 'Back')).center();
    
    // Display Active Cubimals
    var activeCubTitle;
    this.cubWindow.add(activeCubTitle = new SlickUI.Element.Text(0, 74, 'Active Cubimals\n\n\n_____________'));
    activeCubTitle.centerHorizontally();
    for (i = 0; i < 5; i++){
        var activeCub;
        this.cubWindow.add(new SlickUI.Element.DisplayObject(34 + i * 88, 94, activeCub = this.game.make.sprite(0, 0, 'atlas')));
        activeCub.frameName = 'cub-' + i * 3; 
    }
    
    this.cubOpen = true;
    
    this.showCubPage();
  }, 
  showCubPage: function(){
    this.iconLine = 178;
    for (i = 0; i < 5; i++){
        var curItem = i + this.cubPage * 5
        
        var btAdd;
        this.cubWindow.add(btAdd = new SlickUI.Element.Button(2, this.iconLine + 8, 50, 48));
        btAdd.events.onInputUp.add(this.testSound, this);
        btAdd.add(new SlickUI.Element.Text(0, 0, 'Add')).center();
        
        this.iconCub;
        this.cubWindow.add(new SlickUI.Element.DisplayObject(56, this.iconLine, this.cubIcon = this.game.make.sprite(0, 0, 'atlas')));
        this.cubIcon.frameName = 'cub-' + curItem; 
        this.iconDesc;
        this.cubWindow.add(this.iconDesc = new SlickUI.Element.Text(128, this.iconLine, RocketTux.cubNames[curItem] + ': ' + RocketTux.cubDesc[curItem]));
        
        // Coin cost
        var coinIcon;
        this.cubWindow.add(new SlickUI.Element.DisplayObject(123, this.iconLine + 47, coinIcon = this.game.make.sprite(0, 0, 'atlas')));
        coinIcon.frameName = 'ui-coin';
        var coinQnt;
        this.cubWindow.add(coinQnt = new SlickUI.Element.Text(155, this.iconLine + 50, parseInt(RocketTux.cubCost[curItem][0] * (parseInt(localStorage.getItem('RocketTux-cubCoinBonus')) / 100 + 1))));
        
        // Item cost
        var itemIcon;
        var itemQnt;
        for (j = 1; j < 4; j++){
            this.cubWindow.add(new SlickUI.Element.DisplayObject(149 + j * 75, this.iconLine + 47, itemIcon = this.game.make.sprite(0, 0, 'atlas')));
            itemIcon.frameName = 'icon-' + RocketTux.cubCost[curItem][j]; 
            this.cubWindow.add(itemQnt = new SlickUI.Element.Text(187 + j * 75, this.iconLine + 50, 22 - j * parseInt(localStorage.getItem('RocketTux-cubItemBonus'))));
        }
        
        this.iconLine += 84;
    }
  },
  cubNextPage: function(){
    if (this.cubPage == 8){
        return; // Already on last page
    }
    this.cubWindow.destroy();
    this.cubOpen = false;
    this.cubPage += 1;
    this.toggleCubimals();
  },
  cubPrevPage: function(){
    if (this.cubPage == 0){
        return; // Already on first page
    }
    this.cubWindow.destroy();
    this.cubOpen = false;
    this.cubPage -= 1;
    this.toggleCubimals();
  },
  testSound: function(){
    this.mouseoverSnd.play();
  }
};
