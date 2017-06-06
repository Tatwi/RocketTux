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
    
    music = this.game.add.audio('menu');
    music.loop = true;
    music.play();
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      music.destroy();
      this.game.state.start('Game');
    }
  }
};