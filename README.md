# RocketTux
A pengiun with a rocket pack? It sure is as awesome as you're imagining!  

RocketTux is a side scroller adventure with player-influenced random level generation. Collect and spend coins, defeat bad guys, and have fun doing it! The ultimate goal is to buy all the level components so that you may generate more iteresting levels based on your preferences (or your crazy whims).

### About Development
- **Current Version:** 0.1 (June 2017)
- **Next Version Expected:** July 2017
- **Version 1.0 Expected:** February 4th, 2018 (My 40th birthday!)
- Programmed from scratch using [Phaser CE](http://phaser.io/download/stable), as a way to learn the Phaser CE framework and because making games is fun!
- Based on visual art assets from [SuperTux](https://supertuxproject.org/).
- RocketTux is its own unique game, rather than a clone of Supertux.
- Created with Linux Mint 17 on an AMD FX-8320 / R9 270 based desktop PC. 
- Tested on an [HP Chromebook 14 G4](https://support.hp.com/us-en/product/hp-chromebook-14-g4/8326221/document/c04828937).
- Optimized for Chromebooks, designed for 1280x720 resolution (will stretch up to 3840×2160 aka 4K, but likely will terrible past 1080p).
- **No advertisements, subscriptions, micro-transaction, or purchase fees.** Just free, open source fun! 

#### Milestones
- Vesion 0.0: Prototype converted into a real project.
- Vesion 0.1: Basic world generation and player movement.
- Vesion 0.2: Complete player, level generation, and entity spawning mechanics. 
- Vesion 0.3: Complete the sprites, tiles, paralax, and day/night art, the enemy game mechanics, and the game sounds.
- Vesion 0.4: Create all the level themes and tile sections.
- Vesion 0.5: In level UI completion. Loot and inventory mechanics.
- Vesion 0.6: Quest and Reputation system backend.
- Vesion 0.7: Main Menu > Settings, Preferences UI.
- Vesion 0.8: Main Menu > Quest, Inventory, Reputation, Wiki UI.
- Vesion 0.9: Main Menu > Coin store. Conversion from totally random levels to based on game-coin (not real money...) purchases. Stat bumps for coins and backup/restore game to local CSV file will be added here too.
- Vesion 1.0: Final release!
- Version 1.+: Inevitable bug fixes... :)

### Target Audience
RocketTux is designed for kids and light-hearted adults alike. It's not meant to be a difficult or frustrating game. Students can play the game at school and browse or modify the source code to learn more about programming. Indeed, it is possible to create this entire game on a Chromebook in ChromeOS directly, with the proper apps! 

### Gameplay
When version 1.0 is released, the following game play will be available.
- Boost and fly around collecting coins to spend on preferences, upgrades and new locales.
- "Coin-Bounce" or use a boost to move up higher in the air. Hold up/down to maintain height. Puzzle your way through the obstacles to collect all the coins.
- Meet new people, do quests for them, and gain reputation with them to unlock unique rewards.
- Randomly generated levels with 26 different tiles per theme.
- Use a set of sliders to influence the generation of levels. Unlock each slider with coins!
- Collect stuff to sell or use in quests by vanquishing enemies!
- No death mechanic. If you bump into an enemy, you lose some coins. 
- No time limits. Stop and smell the Fire Flowers!
- No forced movement through levels. This ain't no "endless runner" game!
- No need to reach the end of a level to "beat it". In fact, you'll probably go back and forth a few times! The level ends when you feel like leaving it. You get a bonus for collecting all the coins though.
- No "secret areas" or other potentially annoying mechanics that you'll need to look up on the Internet just to understand!

### Installation
RocketTux is built as an "HTML5 web app" for the Chrome browser, optimized to run well on basic Chromebooks. Until version 1.0 is complete and the game is added to the Google Chrome Store, you can download a copy of this repository, unzip it, and add it to Chrome like so:

#### Enable Flags
- Go to chrome://flags.
- Find "Experimental Extension APIs", and click its "Enable" link.
- Restart Chrome.

#### Load The App
- To load the app, bring up the apps and extensions management page by clicking the settings icon and choosing Tools > Extensions.
- Make sure the Developer mode checkbox has been selected (this for browser extensions only, not for the entire Chromebook).
- Click the Load unpacked extension button, navigate to the folder where you unzipped the app and click OK.
- Open new tab and launch RocketTux!

Note that if you are using a "managed" Chromebook, you will need to ask an administrator to add RocketTux for you. 

### Controls
- The idea is to collect as many coins as you can. You have a limited amount of boosts and "coins jumps" to reach the high ones.
- Left/Right Arrows: Move left and right.
- Spacebar: Boost into the air.
- Control: Small jump that will move you up a single "block", when you are standing or running. 
- Up Arrow: Gain altitude when collecting coins ("coin jump"). Hover when in the air.
- Down Arrow: Hover when in the air. Do NOT altitude when collecting coins (handy for collecting a row of coins). Duck when on the ground.
- Music Controls: M for mute, Comma for quieter, Period for louder.

### Gameplay Tips
- Each map is a puzzle, where the idea is to collect as many coins as possible. However, you only have so many boosts and "coin jumps" to get up to the high coins and to get over obstacles. So the biggest tip is to go back and forth and get all the highest coins first, then work your way down. 
- If you have run out of boosts and you're stuck between obstacles, unable to small-jump out, then that's it for you this level!
- Don't sweat it if you weren't able to collect all the coins in a map. There are an infinite amount of chances ahead of you to collect more!

### License
The RocketTux source code is released under the General Public License Version 3, 29 June 2007 and the RocketTux artwork is released under the Creative Commons License. See the [LICENSE](LICENSE) file for more information. You may *not* copy or "fork" this repository and sell RocketTux as your own creation, no matter how you've repackaged or re-branded it. 

### Credits
This is an open source project that stands on the backs of many others, which is something I truly appreciate! The following is a list of people and groups who either directly or indirectly contributed to RocketTux. Without their effort, this project would not exist.

#### Software
- Game Engine: [Phaser CE 2.8.0](http://phaser.io/download/stable), [Chromium Browser](https://www.chromium.org/), [Google Chrome Browser](https://www.google.com/chrome/index.html).
- Level Building: [Tiled](http://www.mapeditor.org/) by Thorbjørn Lindeijer.
- Operating System: [Debian](http://www.debian.org/), [Linux Mint](https://linuxmint.com/), [XFCE](https://xfce.org/), [Google ChromeOS](https://www.chromium.org/chromium-os).
- Graphics: [GIMP](https://www.gimp.org/).
- Sound: [Audacity](http://www.audacityteam.org/), [Sunvox](http://www.warmplace.ru/soft/sunvox/) by Alexander Zolotov.
- Misc: [Git](https://git-scm.com/), [GitHub](https://github.com/), [Geany](http://www.geany.org/), [Thunar](https://en.wikipedia.org/wiki/Thunar), [Firefox Browser](https://www.mozilla.org/en-US/).

#### Graphics
- [SuperTux2](https://supertuxproject.org/) Team for the art style and many assets.

#### Sound and Music
- Sounds: [SuperTux](https://supertuxproject.org/), [Richard Boulanger](http://www.csounds.com/boulanger/), [Mike Koenig](https://soundcloud.com/koenig).
- Music: [R. Bassett Jr.](http://www.tpot.ca), aka Me!

#### QA Testers
- Baylea Bassett, Abby Bassett. 

#### Artistic Advisers
- Neillia Bassett, Baylea Bassett, Abby Bassett.

#### Special Thanks
- My family. You guys rock!
- The [Phaser](http://phaser.io) and [HTML5 Game Devs](http://www.html5gamedevs.com) communities for sharing their knowledge!

