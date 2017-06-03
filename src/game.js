var RocketTux = RocketTux || {};
 
RocketTux.Game = function(){};
 
RocketTux.Game.prototype = {
  create: function() {
    this.game.renderer.setTexturePriority(['world']);
    
    music.stop();
    music = this.game.add.audio('song2');
    music.loop = true;
    music.play();

    // Set world bounds
    var levelLength = 32 * this.game.rnd.between(125, 500); // 4000 min, 16000 max
    this.game.world.setBounds(0, 0, levelLength, 720);
    
    var rng = this.roll(); 

    //  A gradient background
    this.background = this.game.add.bitmapData(levelLength, 720);
    this.background.addToWorld();
    if (rng > 50){
        this.drawBackdrop(0x11315c, 0x48b6cd, levelLength); // Day
    } else {
        this.drawBackdrop(0x000000, 0x11315c, levelLength); // Night
    } 
    
    // DEBUG
    var myDebugText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FF0000' });
    myDebugText.fixedToCamera = true;
    myDebugText.text = RocketTux.snow1.g[0];
    
  },
  update: function() {
      
  },
  roll: function() {
    return this.game.rnd.between(0, 100);
  },
  drawBackdrop: function(top, bottom, levelLength){
    var out = [];
    var y = 0;

    for (var i = 0; i < 360; i++){
        var c = Phaser.Color.interpolateColor(top, bottom, 360, i);
        this.background.rect(0, y, levelLength, y+2, Phaser.Color.getWebRGB(c));
        out.push(Phaser.Color.getWebRGB(c));
        y += 2;
    }
  },
};
