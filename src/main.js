var RocketTux = RocketTux || {};

RocketTux.config = {
    width: window.innerWidth,
    height: window.innerHeight,
    renderer: Phaser.AUTO,
    antialias: false,
    multiTexture: true,
};

RocketTux.game = new Phaser.Game(RocketTux.config);

RocketTux.game.state.add('Boot', RocketTux.Boot);
RocketTux.game.state.add('Preload', RocketTux.Preload);
RocketTux.game.state.add('MainMenu', RocketTux.MainMenu);
RocketTux.game.state.add('Game', RocketTux.Game);
 
RocketTux.game.state.start('Boot');
