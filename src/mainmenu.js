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
    var tmpIcon;
    
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
    this.invBg.scale.setTo(4.54, 6.46); // 454x646
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
        tmpIcon = this.invIcons.create(this.game.width - 408, 24 + lineSpace, 'atlas');
        tmpIcon.frameName = 'icon-' + i;
        // Description
        this.invPanel.add(this.invDesc[i] = new SlickUI.Element.Text(100, -648 + lineSpace, 'Item Name\nHint line is about this long here.'));

        lineSpace += 53;
    }
    this.invIcons.visible = false;

//==================CUBIMALS========================
    // Cubimal Background
    this.cubBg = this.game.add.sprite(166, 10, 'ui-bg')
    this.cubBg.scale.setTo(6.40, 6.46); // 640x646
    this.cubBg.visible = false;
    
    // Cubimal Window Controls
    this.cubPanel;
    slickUI.add(this.cubPanel = new SlickUI.Element.Panel(164, this.game.height - 58, 644, 50));
    this.cubPanel.visible = false;
    this.cubPage = 0;
    var btCubNext;
    this.cubPanel.add(btCubNext = new SlickUI.Element.Button(534, 0, 100, 46));
    btCubNext.events.onInputUp.add(this.cubNextPage, this); // Testing place holder
    btCubNext.add(new SlickUI.Element.Text(0, 0, 'Next')).center();
    var btCubBack;
    this.cubPanel.add(btCubBack = new SlickUI.Element.Button(0, 0, 100, 46));
    btCubBack.events.onInputUp.add(this.cubPrevPage, this); // Testing place holder
    btCubBack.add(new SlickUI.Element.Text(0, 0, 'Back')).center();
    var cubName;
    this.cubPanel.add(cubName = new SlickUI.Element.Text(0, 0, 'Cubimals Page: ' + (this.invPage + 1) ));
    cubName.centerHorizontally();
    cubName.centerVertically();
    
    // Display Active Cubimals
    var activeCubTitle;
    this.cubPanel.add(activeCubTitle = new SlickUI.Element.Text(0, -644, 'Active Cubimals'));
    activeCubTitle.centerHorizontally();
    var activeCubUnLn;
    this.cubPanel.add(activeCubUnLn = new SlickUI.Element.Text(0, -540, '_.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._'));
    activeCubUnLn.centerHorizontally();
    this.cubActiveIcons = this.game.add.group();
    for (i = 0; i < 6; i++){
        tmpIcon = this.cubActiveIcons.create(196 + i * 100, 56, 'atlas');
        tmpIcon.frameName = 'cub-' + i * 3; // temp value
    }
    this.cubActiveIcons.visible = false;
    
    // Icon/Description/Cost Slots
    this.cubIcons = this.game.add.group();
    this.cubDesc = [];
    lineSpace = 0;
    this.cubCostIcons = this.game.add.group();
    var iconTab = 0;
    for (i = 0; i < 5; i++){
        // Cubimal Icons
        tmpIcon = this.cubIcons.create(228, 190 + lineSpace, 'atlas');
        tmpIcon.frameName = 'cub-' + i;
        
        // Descriptions
        this.cubPanel.add(this.cubDesc[i] = new SlickUI.Element.Text(134, -490 + (i * 90), RocketTux.cubNames[i] + ': ' + RocketTux.cubDesc[i]));
        lineSpace += 90;
        
        // Cost icons
        for (j = 0; j < 5; j++){
            tmpIcon = this.cubCostIcons.create(300 + iconTab, 140 + lineSpace, 'atlas');
            tmpIcon.frameName = 'ui-coin'; // temp value
            iconTab += 100;
        }
        
        iconTab = 0;
    }
    // Cost values
    this.cubCostDesc1 = [];
    this.cubCostDesc2 = [];
    this.cubCostDesc3 = [];
    this.cubCostDesc4 = [];
    this.cubCostDesc5 = [];
    iconTab = 0;
    for (i = 0; i < 5; i++){
        this.cubPanel.add(this.cubCostDesc1[i] = new SlickUI.Element.Text(168 + iconTab, -434, 1));
        this.cubPanel.add(this.cubCostDesc2[i] = new SlickUI.Element.Text(168 + iconTab, -344, 1));
        this.cubPanel.add(this.cubCostDesc3[i] = new SlickUI.Element.Text(168 + iconTab, -254, 1));
        this.cubPanel.add(this.cubCostDesc4[i] = new SlickUI.Element.Text(168 + iconTab, -164, 1));
        this.cubPanel.add(this.cubCostDesc5[i] = new SlickUI.Element.Text(168 + iconTab, -74, 1));
        
        iconTab += 100;
    }
    this.cubIcons.visible = false;
    this.cubCostIcons.visible = false;
    
    // Cubimal Add/Remove Buttons
    this.cubButPanel;
    slickUI.add(this.cubButPanel = new SlickUI.Element.Panel(170, this.game.height - 540, 52, 460));
    this.cubBut1;
    this.cubButPanel.add(this.cubBut1 = new SlickUI.Element.Checkbox(2,20, SlickUI.Element.Checkbox.TYPE_CROSS));
    this.cubBut2;
    this.cubButPanel.add(this.cubBut2 = new SlickUI.Element.Checkbox(2,110, SlickUI.Element.Checkbox.TYPE_CROSS));
    this.cubBut3;
    this.cubButPanel.add(this.cubBut3 = new SlickUI.Element.Checkbox(2,200, SlickUI.Element.Checkbox.TYPE_CROSS));
    this.cubBut4;
    this.cubButPanel.add(this.cubBut4 = new SlickUI.Element.Checkbox(2,290, SlickUI.Element.Checkbox.TYPE_CROSS));
    this.cubBut5;
    this.cubButPanel.add(this.cubBut5 = new SlickUI.Element.Checkbox(2,380, SlickUI.Element.Checkbox.TYPE_CROSS));
    this.cubButPanel.visible = false;
    
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
//==================INVENTORY DATA========================
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
//==================CUBIMALS DATA========================
  fillCub: function(){
    var curItem = 0;
    var skp = 1;
    for (i = 0; i < 5; i++){
        curItem = i + this.cubPage * 5;
        // Item costs
        this.cubCostDesc1[i].value = RocketTux.cubCost[this.cubPage][i];
        this.cubCostDesc2[i].value = RocketTux.cubCost[this.cubPage + 1][i];
        this.cubCostDesc3[i].value = RocketTux.cubCost[this.cubPage + 2][i];
        this.cubCostDesc4[i].value = RocketTux.cubCost[this.cubPage + 3][i];
        this.cubCostDesc5[i].value = RocketTux.cubCost[this.cubPage + 4][i];
        
        // Descriptions
        this.cubDesc[i].value = RocketTux.cubNames[curItem] + ': ' + RocketTux.cubDesc[curItem];
        
        // Cubimal Icons
        this.cubIcons.getAt(i).frameName = 'cub-' + curItem;
        
        // Cost icons
        for (j = 1; j < 4; j++){
            this.cubCostIcons.getAt(this.cubPage + j).frameName = 'icon-' + RocketTux.cubCostIcons[i][j];
        }
        skp += 5;
    }
  },
  toggleCubimals: function(){
    if (this.cubOpen){
        this.cubOpen = false; // close
        this.cubBg.visible = false;
        this.cubPanel.visible = false;
        this.cubActiveIcons.visible = false;
        this.cubIcons.visible = false;
        this.cubCostIcons.visible = false;
        this.cubButPanel.visible = false;
    } else {
        this.cubOpen = true; // open
        this.fillCub();
        this.cubBg.visible = true;
        this.cubPanel.visible = true;
        this.cubActiveIcons.visible = true;
        this.cubIcons.visible = true;
        this.cubCostIcons.visible = true;
        this.cubButPanel.visible = true;
    }
  },
  cubNextPage: function(){
    if (this.cubPage == 8){
        return; // Already on last page
    }
    this.cubPage += 1;
    this.fillCub();
  },
  cubPrevPage: function(){
    if (this.cubPage == 0){
        return; // Already on first page
    }
    this.cubPage -= 1;
    this.fillCub();
  },
  testSound: function(){
    this.mouseoverSnd.play();
  }
};
