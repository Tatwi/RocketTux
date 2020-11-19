var RocketTux = RocketTux || {};

RocketTux.config = {
    width: 1280,
    height: 720,
    renderer: Phaser.AUTO,
    antialias: false,
    multiTexture: true,
    enableDebug: false,
};

RocketTux.game = new Phaser.Game(RocketTux.config);

RocketTux.game.state.add('Boot', RocketTux.Boot);
RocketTux.game.state.add('Preload', RocketTux.Preload);
RocketTux.game.state.add('MainMenu', RocketTux.MainMenu);
RocketTux.game.state.add('Game', RocketTux.Game);
RocketTux.game.state.add('Help', RocketTux.Help);
RocketTux.game.state.add('Settings', RocketTux.Settings);
RocketTux.game.state.add('Friends', RocketTux.Friends);
RocketTux.game.state.add('Inventory', RocketTux.Inventory);
 
RocketTux.game.state.start('Boot');
