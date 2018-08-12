var RocketTux = RocketTux || {};
 
RocketTux.Boot = function(){};
 
// Game configuration
RocketTux.Boot.prototype = {
  preload: function() {
  	// Loading screen assets
    this.load.image('logo', 'data/logo.png');
    this.load.image('preloadbar', 'data/loadingbar.png');
  },
  create: function() {
    this.game.stage.backgroundColor = '#000000';
 
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	this.scale.minWidth = 800;
	this.scale.minHeight = 450;
    // Graphics designed for 1280x720
	this.scale.maxWidth = 3840;
	this.scale.maxHeight = 2160;

	this.scale.pageAlignHorizontally = true;
 
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.state.start('Preload');
    
    // Hack I copy/pasted from the internet to make sound work again...
    // Author https://github.com/AleBles
    if (this.game.device.android && this.game.device.chrome && this.game.device.chromeVersion >= 55) {
        this.game.sound.touchLocked = true;
        this.game.input.touch.addTouchLockCallback(function () {
            if (this.noAudio || !this.touchLocked || this._unlockSource !== null) {
                return true;
            }
            if (this.usingWebAudio) {
                // Create empty buffer and play it
                // The SoundManager.update loop captures the state of it and then resets touchLocked to false

                var buffer = this.context.createBuffer(1, 1, 22050);
                this._unlockSource = this.context.createBufferSource();
                this._unlockSource.buffer = buffer;
                this._unlockSource.connect(this.context.destination);

                if (this._unlockSource.start === undefined) {
                    this._unlockSource.noteOn(0);
                }
                else {
                    this._unlockSource.start(0);
                }

                //Hello Chrome 55!
                if (this._unlockSource.context.state === 'suspended') {
                    this._unlockSource.context.resume();
                }
            }

            //  We can remove the event because we've done what we needed (started the unlock sound playing)
            return true;

        }, this.game.sound, true);
    }
  }
};
