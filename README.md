# RocketTux
A penguin with a rocket pack? Sure, why not!  

RocketTux is an easygoing side-scroller game about collecting coins and items. Help Tux navigate his way through the randomly pieced together levels, managing his boosts, earning Cubimals for bonuses, and avoiding the ever mischievous Nolok's walking bombs and other "hilarious machines"...

## Download
- Latest Working Version: 0.4.3 (2018.12.17)
- **Windows:** [7/8/10 64Bit](https://drive.google.com/open?id=1cPh6nHXv2BINCHQCf4hkMBSbqZwogfcI), [7/8/10 32Bit](https://drive.google.com/open?id=1N7hpHihpHhqDWuDJJyq30eRu--3v3Gy8)
- **Linux:** [AMD64](https://drive.google.com/open?id=1CxWSmGFCafJP1mbnsVHUh1IHvjvhn-fH), [x86](https://drive.google.com/open?id=1u9zUUZrFrAFiLNuKlKe1ggBJ4YOW3oFk)
- Previous Versions: [Directory of all releases](https://drive.google.com/open?id=1HIeXdRdk2E9728L978p4-uPapfudT1VS)
- MacOS: Not supported.
- Android/iOS: Not supported.

## System Requirements
I can verify the game works fine using the following specs, but it will likely run fine on a system with less RAM and a modest graphics accelerator.  

- **CPU:** AMD FX 8320
- **Graphics:** Nvidia Geforce 1660
- **RAM:** 24GB

## About Development
- **Current Version:** 0.4.4 (Nov 2020)
- **Expected Completion Date:** When I get there! Maybe sometime 2021...
- Programmed from scratch using [Phaser CE](https://github.com/photonstorm/phaser-ce).
- Based on visual art assets from [SuperTux](https://supertuxproject.org/) and [Glitch](https://www.glitchthegame.com/public-domain-game-art/).
- RocketTux is its own unique game, rather than a clone of Supertux.
- Created with Linux Mint 17 and Windows 10 64Bit on an AMD FX-8320 based desktop PC. 
- Originally intended to be a Chrome App and optimized for low end Chromebooks, but it's now intended to be run on a desktop PC. 
- Packaged as a native application for Windows and Linux using [NW.js](https://github.com/nwjs/nw.js), which is based on [Node.js](https://nodejs.org/en/about/) and the [Chromium](https://www.chromium.org/Home)  web browser.
- **No advertisements, no subscriptions, no micro-transaction, and no purchase fees.** Just free, open source fun!

### Milestones to Release
- Version 0.5: All map sections completed.
- Version 0.6: All entities are fully functional.
- Version 0.7: Quest system completed.
- Version 0.8: Cubimal bonus system completed.
- Version 0.9: Music, sounds, and art finalized. Settings/preferences menu implemented.
- Version 1.0: All known issues fixed and content is as polished as it will get.

### Milestones Reached
- Vesion 0.0: Prototype converted into a real project.
- Vesion 0.1: Basic world generation and player movement, and day/night art.
- Vesion 0.2: Complete player, level generation, and entity spawning mechanics.
- Vesion 0.2.5: Playable basic game with usable UI.
- Vesion 0.3: Block spawning (Quest, Powerup, Loot, Dangerous Loot) mechanic, functional powerups, implemented the 196 quest item icons, in-level item collection tracking, quest window.
- Version 0.3.5: Enemy spawning, 3 functional enemies, player interaction with enemies, several performance improvements.
- Version 0.4.0: All maps have level sections, functional item collection and inventory, ui window for Cubimals, game packaged to make it easy to play on Linux and Windows.

## Target Audience
RocketTux is designed for kids and light-hearted adults alike. It's not meant to be a difficult or frustrating game. Students can play the game at school and browse or modify the source code to learn about programming.

## Story
That naughty Nolok has been up to no good, again! This time he and his minions decided it would be hilarious if they took people's everyday items and hid them inside of magic blocks all over the world. Someone has to clean up Nolok's mess and Tux is always up for a challenge. Of course, Nolok isn't going to make it easy for him, even though he does think that rocket pack thing is cool. Word is that the [Rescue Girlies](https://github.com/Tatwi/RescueGirlies) are also making an effort to reign in Nolok's chaos.

## Gameplay
When the game is finished, the following game play will be available.  

- Boost and fly around collecting coins and items to spend on customizations to the game and to complete quests.
- "Coin-Bounce" or use a boost to puzzle your way around obstacles to collect all the coins and quest items.
- Open various blocks (by simply passing over them) that grant items, quests, and powerups.
- Use one of 5 types of powerups to customize your game play experience.
- Unlock new areas, get bonuses, and set perferences by purchasing Cubimals with your coins. Up to six Cubimals can be active at a time, in any combination.
- Randomly generated levels with at least 26 different map sections per theme and 8 total themes.
- Use Cumbimals to influence the time and place of your adventures, as many items can only be found in certain places at specific times of the day.
- No death mechanic. If Tux collides with an enemy or an explosion, he gets knocked back and loses some coins from his wallet (unless he is invincible at the time). Easy mode loses fewer coins, where hard mode loses more coins.
- No "murder hobo" lifestyle; Nolok's minions are obstacles to be avoided (you can't kill them, though the bomb guys do explode).
- No time limits. Stop and smell the Fire Flowers!
- No forced movement through levels.
- No need to reach the end of a level to "beat it". In fact, you'll probably go back and forth a few times to collect everything. The level ends when you feel like leaving it. You get a bonus for collecting all the coins, but you don't have to collect them all.
- No "secret areas" or other potentially annoying mechanics that you'll need to look up on the Internet just to understand!

### Controls
- RocketTux is designed to be used with keyboard and mouse. I might add game controller, but I will not be adding touch screen support.
- The idea is to collect as many coins as you can. You have a limited amount of boosts and "coins jumps" to reach the high ones.
- Left/Right Arrows: Move left and right.
- Spacebar: Boost into the air. Provided he doesn't run into anything along the way, a boost will move Tux to the top of the screen.
- Control: Small jump that will move Tux up two "blocks". Only works when standing or running.
- Up Arrow: Gain altitude when collecting coins ("coin jump"). Hover when in the air. A small amount of altitude is lost over time.
- Down Arrow: Hover when in the air. Do NOT gain altitude when collecting coins (handy for collecting a row of coins). Duck when on the ground.
- Music Controls: M for mute, Comma for quieter, Period for louder.
- B: Toggles the display of the Adventure Bag, which shows the items Tux found in a level.
- Mouse: Used for clicking menu buttons.

### Powerups
- Powerups are found in purple blocks and are awarded by some quests. Purple blocks are not found when playing in hard mode, though certains events may spawn them if Tux is lucky.
- Star: Makes Tux fly a bit faster and makes him run at super speed!
- Fire Flower: Tux flies even faster than with the Star and he has a chance to gain a boost when collecting coins (to a max of 5 active boosts).
- Water Flower: Makes Tux invincible and very lucky, but the powerup is consumed after the first time Tux collides with an enemy or an explosion.
- Earth Flower: Makes Tux completely invincible at the cost of also making him very, very heavy. Tux can only jump 1 block, he will not boost all the way to the top of the level, and he will lose altitude much more quickly.
- Air Flower: Makes Tux much lighter, improving his jumps (3 blocks), coin-jumps, and boosts, while also causing him to lose altitude at a slower rate.
- All powerups, with the exception of the Earth Flower, are lost on contact with an enemy or an explosion.
- Powerups can be removed by clicking the icon in the toolbar when playing a level.

### Enemies
- Mr. Bomb: Walks around, preferably on the ground. He is programmed to run, tick, and explode when Tux gets near him. Large blast radius.
- Mr. Short-fuse: Walks around, preferably on the ground. He doesn't have time for ticking, he just explodes! Smaller blast radius.
- Jumpy: Likes to stay in one spot and hop the day away. Invincible, everlasting.
- Woody: Like Jumpy, but made of wood and only found in the forest.
- Rocketboots: Flies around, bouncing off things. He is programmed to explode when Tux gets near him, but he may well blow himself up just by bouncing around. Enormous blast radius.
- Proppy: A special kind of bomb dropped by Nolok when Tux opens orange boxes. Proppy is a bomb who hovers up and down, waiting for Tux to come near. Large blast radius.
- Fightly Fish: These giant fish love to eat penguins. Normally that's the other way around... best to avoid these bad guys if possible!

### Gameplay Tips
- Each map is a puzzle, where the idea is to collect as many coins as possible. However, you only have so many boosts and "coin jumps" to get up to the high coins and to get over obstacles. So the biggest tip is to get up to the top of the screen and go back and forth, collecting highest coins first, then work your way down. 
- If you have run out of boosts and you're stuck between obstacles, unable to small-jump out, then that's it for you on that level! Hit the "Quit" buton and play again.
- Don't sweat it if you weren't able to collect all the coins in a level.


## Wiki
The following are links to documents related to the development of the game. Hopefully there is enough information here to help students and hobbyists make sense of how the project is laid out, how to develop for it, and how to use the included tools.

### Running and Building
- [Running the game on a Chromebook](doc/wiki-chromebooks.md)
- [Using a web server in Linux or Windows to host the game](doc/wiki-using_a_webserver.md)
- [Building an executable using NW.js](doc/wiki-building.md)

### Project and Programming
- [Art and release files in my Google Drive](https://drive.google.com/open?id=0By31kDj_eHBcWHdXRlFzdnZIdUU)
- [File structure and types](doc/wiki-file_structure.md)
- [Overview of Phaser CE, Pixi, Slick-UI, and JavaScript](doc/wiki-programming_overview.md)
- [Step by step walk through of the game states](doc/wiki-game_states.md)
- [Slick-UI usage and limiations](doc/wiki-slick_ui.md)
- [Data storage and loot tables](doc/wiki-data_loot.md)
- [How the tilemap works](doc/wiki-tilemap.md)
- [Explaining the sprite sheet and backgrounds](doc/wiki-sprites.md)

### Tools
- [Creating map sections using Tiled](doc/wiki-map_section_creation.md)
- [Adding/modifying map sections](doc/wiki-map_section_tools.md)
- [Creating sprites with GIMP](doc/wiki-sprite_creation.md)
- [Adding sprites to the game](doc/wiki-sprites_adding_new.md)
- [Using the inventory spreadsheet](doc/wiki-inventory_spreadsheet.md)

## License
The RocketTux source code is released under the General Public License Version 3, 29 June 2007 and the RocketTux artwork is released under the Creative Commons License. See the [LICENSE](LICENSE) file for more information. You may *not* copy or "fork" this repository and sell RocketTux as your own creation, no matter how you've repackaged or re-branded it. 

## Credits
This is an open source project that stands on the backs of many others, which is something I truly appreciate! The following is a list of people and groups who either directly or indirectly contributed to RocketTux. Without their effort, this project would not exist.

### Software
- Game Engine: [Phaser CE 2.8.0](http://phaser.io/download/stable).
- Level Building: [Tiled](http://www.mapeditor.org/) by Thorbjørn Lindeijer.
- User Interface: Versions 0.40 and older used SlickUI/Kenny, while more recent versions I created myself (Tatwi).
- Operating System: [Debian](http://www.debian.org/), [Linux Mint](https://linuxmint.com/), [XFCE](https://xfce.org/).
- Graphics: [GIMP](https://www.gimp.org/) with some brushes by [Bill Scott](http://www.texturemate.com/content/about).
- Sound: [Audacity](http://www.audacityteam.org/), [Sunvox](http://www.warmplace.ru/soft/sunvox/) by Alexander Zolotov.
- Misc: [Git](https://git-scm.com/), [GitHub](https://github.com/), [Geany](http://www.geany.org/), [Thunar](https://en.wikipedia.org/wiki/Thunar), [Firefox Browser](https://www.mozilla.org/en-US/), [Google Chrome Browser](https://www.google.com/chrome/index.html).

### Graphics
- [SuperTux2](https://supertuxproject.org/) Team for the art style and many assets.
- [Tiny Spec](https://www.glitchthegame.com/public-domain-game-art/) for the public domain release of the assets they created for their game, Glitch. All the collectable items in RocketTux are from [ThirdPartyNinja's](https://github.com/ThirdPartyNinjas/GlitchAssets) repository of Glitch items converted into PNG format.

### Sound and Music
- Sounds: [SuperTux](https://supertuxproject.org/) and contributors for some sound effects, [Richard Boulanger](http://www.csounds.com/boulanger/) for some intruments in some songs, [Mike Koenig](https://soundcloud.com/koenig) some portions of sound effects.
- Music: [R. Bassett Jr.](http://github.com/tatwi) aka Tatwi.

### QA Testers
- Neillia Bassett, Baylea Bassett, Abby Bassett. 

### Artistic Advisers
- Neillia Bassett, Baylea Bassett, Abby Bassett.

### Special Thanks
- My family. You guys rock!
- The [Phaser](http://phaser.io) and [HTML5 Game Devs](http://www.html5gamedevs.com) communities for sharing their knowledge!

