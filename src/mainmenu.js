RocketTux.MainMenu = function(){};
 
RocketTux.MainMenu.prototype = {
  create: function() {
  	//show the space tile, repeated
    this.background = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.background.anchor.setTo(0.5);
 
    //start game text
    var text = "Click to Play!";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2 + 80, text, style);
    t.anchor.set(0.5);
    
    // Display player's coins
    var coins = rtStorage.myCoins;
    if (coins == undefined){
        saveStorage('myCoins', 0);
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.showCoinsFirstTime, this); // Init value using function that listens for changes...
    } else{
        text = "Coins: " + coins;
        var coinDisplay = this.game.add.text(16, 8, text, style);
    }
    
    music = this.game.add.audio('menu');
    music.loop = true;
    music.play();
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      music.destroy();
      this.game.state.start('Game');
    }
  }, 
  showCoinsFirstTime: function(){
    var coins = rtStorage.myCoins;
    var text = "Coins: " + coins;
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var coinDisplay = this.game.add.text(16, 8, text, style);
  },
};
