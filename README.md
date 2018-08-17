# RocketTux
A pengiun with a rocket pack? It sure is as awesome as you're imagining!  

RocketTux is a side scroller adventure with player-influenced random level generation, quests, reputations, basic crafting, and other fun stuff! The game is primarily about collecting coins and completing quests by collecting and/or crafting items, while puzzling your way through resources management and level navigation. While there isn't any combat in the game, the ever mischievous Nolok has a tendency to let his walking bombs and other "hilarious machines" run wild... Along with Nolok's toy-box gone wrong, the Tux may also encounter extreme weather, angry stones, and various projectiles of questionable origin.  

### About Development
- **Current Version:** 0.3.5 (July 2017)
- **Version 1.0 Expected:** Before 2019
- Programmed from scratch using [Phaser CE](http://phaser.io/download/stable), as a way to learn the Phaser CE framework and because making games is fun!
- Based on visual art assets from [SuperTux](https://supertuxproject.org/) and [Glitch](https://www.glitchthegame.com/public-domain-game-art/).
- RocketTux is its own unique game, rather than a clone of Supertux.
- Created with Linux Mint 17 on an AMD FX-8320 / R9 270 based desktop PC. 
- Tested on an [HP Chromebook 14 G4](https://support.hp.com/us-en/product/hp-chromebook-14-g4/8326221/document/c04828937).
- Optimized for Chromebooks, designed for 1280x720 resolution (will stretch up to 3840×2160 aka 4K, but likely will look terrible past 1080p).
- **No advertisements, subscriptions, micro-transaction, or purchase fees.** Just free, open source fun!

#### Milestones Reached
- Vesion 0.0: Prototype converted into a real project.
- Vesion 0.1: Basic world generation and player movement, and day/night art.
- Vesion 0.2: Complete player, level generation, and entity spawning mechanics.
- Vesion 0.2.5: Playable basic game with usable UI.
- Vesion 0.3: Block spawning (Quest, Powerup, Loot, Dangerous Loot) mechanic, functional powerups, implemented the 196 quest item icons, in-level item collection tracking, quest window.
- Version 0.3.5: Enemy spawning, 3 functional enemies, player interaction with enemies, several performance improvements.

### Target Audience
RocketTux is designed for kids and light-hearted adults alike. It's not meant to be a difficult or frustrating game. Students can play the game at school and browse or modify the source code to learn more about programming. Indeed, it is possible to create this entire game on a Chromebook in ChromeOS directly, with the proper apps! 

### Story
That naughty Nolok has been up to no good, again! This time he and his minions decided it would be hilarious if they took people's everyday items and hid them inside of magic blocks all over the world. Someone has to clean up Nolok's mess and Tux is always up for a challenge. Of course, Nolok isn't going to make it easy for him, even though he does think the rocket pack thing is cool.

### Gameplay
When version 1.0 is released, the following game play will be available.
- Boost and fly around collecting coins to spend on preferences, upgrades and new locales.
- "Coin-Bounce" or use a boost to move up higher in the air. Hold up/down to maintain height. Puzzle your way through the obstacles to collect all the coins and quest items.
- Open various blocks (by simply passing over them) that grant items, quests, and powerups.
- Use one of 5 types of powerups to customize your game play experience.
- Further customize your game play experience by collecting different kinds of metals which you can use to craft new (stat altering) rocketpacks in the Rocket Lab.
- Collect items to use in quests or to sell for coins.
- Collect Cubimals to play with on your main menu (and to give you better deals when buying and selling items).
- Meet new people, do quests for them, and gain reputation with them to unlock unique rewards.
- Randomly generated levels with at least 26 different tiles per theme.
- Influence the time and place of your adventures, along with other properties of the world.
- No death mechanic. The player gets knocked back and loses 10 coins from his wallet on contact with an enemy or an explosion, unless he is invincible at the time.
- No "murder hobo" lifestyle; Nolok's minions are obstacles to be avoided (you can't kill them, though the bomb guys do explode).
- No time limits. Stop and smell the Fire Flowers!
- No forced movement through levels. This ain't no "endless runner" game!
- No need to reach the end of a level to "beat it". In fact, you'll probably go back and forth a few times! The level ends when you feel like leaving it. You get a bonus for collecting all the coins though.
- No "secret areas" or other potentially annoying mechanics that you'll need to look up on the Internet just to understand!

#### Controls
- RocketTux is designed to be used with keyboard and mouse. I might add game controller and touch screen support in the distant future.
- The idea is to collect as many coins as you can. You have a limited amount of boosts and "coins jumps" to reach the high ones.
- Left/Right Arrows: Move left and right.
- Spacebar: Boost into the air.
- Control: Small jump that will move you up a single "block", when you are standing or running. 
- Up Arrow: Gain altitude when collecting coins ("coin jump"). Hover when in the air.
- Down Arrow: Hover when in the air. Do NOT altitude when collecting coins (handy for collecting a row of coins). Duck when on the ground.
- Music Controls: M for mute, Comma for quieter, Period for louder.
- B: Toggles the display of your Adventure Bag, which show the items you found in a level.

#### Powerups
- Star: Makes you fly faster and makes you run at super speed!
- Fire Flower: You fly even faster than with the Star and you have a chance to gain a boost when collecting coins (to a max of 5 active boosts).
- Water Flower: Makes you invincible and very lucky, but the powerup is consumed after the first time it protects you.
- Earth Flower: Makes you completely invincible at the cost of also making you very, very heavy.
- Air Flower: Makes you much lighter, improving your jumps, coin-jumps, and boosts, while also causing you to drop slower.
- All powerups, with the exception of the Earth Flower, are lost on contact with an enemy or an explosion.

#### Enemies
- Mr. Bomb: Walks around, preferably on the ground. He is programmed to run, tick, and explode when Tux gets near him. Large blast radius.
- Mr. Short-fuse: Walks around, preferably on the ground. He doesn't have time for ticking, he just explodes! Smaller blast radius.
- Jumpy: Likes to stay in one spot and hop the day away. Invincible, everlasting.
- Woody: Like Jumpy, but made of wood and only found in the forest.
- Rocketboots: Flies around, bouncing off things. He is programmed to explode when Tux gets near him, but he may well blow himself up just by bouncing around. Enormous blast radius.
- And more...

#### Gameplay Tips
- Each map is a puzzle, where the idea is to collect as many coins as possible. However, you only have so many boosts and "coin jumps" to get up to the high coins and to get over obstacles. So the biggest tip is to go back and forth and get all the highest coins first, then work your way down. 
- If you have run out of boosts and you're stuck between obstacles, unable to small-jump out, then that's it for you this level!
- Don't sweat it if you weren't able to collect all the coins in a map. There are an infinite amount of chances ahead of you to collect more!

### Installation
RocketTux is built as an "HTML5 web app" that is optimized to run well on basic Chromebooks or on desktops using the Google Chrome browser (it's slow in Firefox and I don't recommend using anything other than Google Chrome for the game). This makes RocketTux "cross platform compatible" with any system that can run a the Chrome web browser, however that may not always be the case, due to changes Google makes to the broswer (which is infuriating as hobby developer!). So, if you find it doesn't work and you're using a version of Chrome greater than 66 (Aug 2018), then sorry that was the most recent version of Chrome that worked for me...

To run RocketTux at home, you'll (most likely) need to use a "local web server" on your computer to "host" the game. This sounds complicated (and you *can* make it complicated...), but there are some really simple tools available on Linux, Mac, and Windows. Here is how you can download and run RocketTux:

#### Linux
- Personally, on my Linux Mint 17 desktop I use the web server that is built into Python version 2.7.6. It is dead simple to use and requires exactly *no setup at all* (beyond installing Python). The following instructions are for using the Python web server in Debian/Mint/Ubuntu 64Bit Linux with the Google Chrome browser.
- Install Python: sudo apt-get install python
- Download and install Google Chrome: 
    - Open a terminal window and issue the following commands
    - wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    - sudo dpkg -i google-chrome-stable_current_amd64.deb
- Alternately, you can use the Chromium open source browser (which may or may not properly support WEBGL, depending on the build) by opening a terminal and issuing the following command.
    - sudo apt-get install chromium-browser
- Download RocketTux by clicking the "Clone or Download" button on this page and choosing "Download Zip".
- After the download is complete, cut and paste the RocketTux-master.zip file to a location on your computer where you would like the game to live and extract the zip file, such as in your home directory (/home/MYUSERNAME). It will create a new folder called "RocketTux-master" the contains the game files.
- Start the Phython Web Server:
    - Open a terminal window in the RocketTux-master folder, which is usually most easily done by clicking File > Open Terminal Here in the various file browsers, and issue the following command:
    - python -m SimpleHTTPServer
    - Alternately you can use the Python script (which conveniently displays the ip address of the computer) that I have included by typing the command:
    - python runserver.py
- Play the game:
    - Open Chrome and go to the following "website" (that is hosted on your computer and only accessible to computers on your home network): 127.0.0.1:8000/window.html

The web address 127.0.0.1 mean "localhost", aka the computer you're sitting. The :8000 is the port that the Python web server is listing for requests on. And window.html is the page that loads the game. The Python Simple Web Server only allows a single user at a time per port, so run the command again in another terminal using 8001 to accommodate another user. Alternately, you can install a web server such as [Apache](http://httpd.apache.org/docs/2.4/getting-started.html), which can host many concurrent users and can run automatically in the background, once configured.

Now that you have the game running, you can add a link for it on your desktop and have it open in its own window (rather than a browser tab) by doing the following:
- Click the menu icon in Chrome (right side of the window) and go to More Tools > Add to Desktop...
- Put a check beside "Open as window" and press OK. 
- Now you can play just by using the desktop icon! You may need to manually resize the window for the 16:9 ratio (intended for 1280x720 resolution).
- By default the icon looks very plain, so go ahead and change it by...
    - Right click the icon and select Properties. 
    - In the properties window, click on the plain looking icon and a window will open that will allow you to choose a different icon.
    - To use the icon included with RocketTux, choose "Image Files" in the "Select icon from:" drop down menu, then navigate to the folder where RocketTux lives. You will find the icon in the RocketTux-main/data/icons/ folder.
    
#### Chromebooks and Android
- Unfortunately, Google "Packaged Apps" will no longer be supported outside of ChromeOS on Chromebooks after 2018 (and who knows how long they will be around even on ChromeOS...). That reality, along with the convoluted, **unreliable** mess that was required to store the saved game data when RocketTux was a "Google Packaged App", means that you can't run RocketTux directly on a Chromebook anymore. Take the good with the bad: Normal HTML5 data storage works great!
- Search the Google Web Store for a Chrome extention called "Web Server for Chrome". This extension will allow you to host a folder on your Chromebook as a website, allowing you to play the game at the 127.0.0.1 address, similar to the above. See the app's documentation for details on how to configure it.

    
#### Windows
- Unsupported.
- Interestingly, I was able to run the game at full speed using Firefox (version 54) in Windows 7 64Bit, by simply double clicking the window.html file. This can also be done in Linux, but the Linux build of Firefox 54 runs the game poorly. So in Windows, play it in Firefox!
- If Firefox doesn't cut it, please search the web on how to install and run a web server in Windows. The rest of steps are pretty much the same as for Linux (though you can download Chrome from Google's website rather than using the command prompt).

#### Mac
- Untested, unsupported.
- Please search the web on how to install and run a web server in MacOS. I don't have access to a Mac, but I would imagine that the rest of steps are pretty much the same as for Linux.

#### iPhone and other devices
- Untested, unsupported.

### System Requirement Suggestions
- RocketTux is designed to work great on my HP Chromebook 14 G4, which has a low-power dual core Intel Celeron CPU/GPU and 2GB of DDR3 RAM. That doesn't seem like much, but the modern CPU/GPU combo runs circles around the dual core AMD CPU/GPU setup in my 2007 era Dell Inspiron 1501 laptop. The game is pretty much unplayable in Linux Mint 17 on the Inspiron 1501 in CANVAS and in WEBGL mode, even with 3GG of RAM, due to the very poor graphics chip on the motherboard. My old Core2 Q8200 Intel quad core desktop that my kids use, which has an 512MB AMD 5670 video card and 8GB of 800MHz DDR2 RAM, performs admirably, but not always smoothly. And finally, RocketTux runs fantastically on my AMD FX-8320 / AMD R9 270 based desktop with 8GB of 2133MHz DDR3 RAM. None of these systems are "high-end", though the FX-8320 system performs much better than many current inexpensive laptops and desktops. So with that in mind, the game will likely run well on any recent dual core Intel or AMD CPU/GPU combo (or as AMD calls them, APUs), with a discrete video card being over-kill, in Linux or Windows. I don't have any experience with Macs, but anything from 2012 on will probably be fine.

### License
The RocketTux source code is released under the General Public License Version 3, 29 June 2007 and the RocketTux artwork is released under the Creative Commons License. See the [LICENSE](LICENSE) file for more information. You may *not* copy or "fork" this repository and sell RocketTux as your own creation, no matter how you've repackaged or re-branded it. 

### Credits
This is an open source project that stands on the backs of many others, which is something I truly appreciate! The following is a list of people and groups who either directly or indirectly contributed to RocketTux. Without their effort, this project would not exist.

#### Software
- Game Engine: [Phaser CE 2.8.0](http://phaser.io/download/stable), [Google Chrome Browser](https://www.google.com/chrome/index.html).
- Level Building: [Tiled](http://www.mapeditor.org/) by Thorbjørn Lindeijer.
- User Interface: [Slick-UI](https://github.com/Flaxis/slick-ui.git) by Richard Snijders, with the [Kenney Theme](http://kenney.nl/assets/ui-pack) by the Kenney Vleugels.
- Operating System: [Debian](http://www.debian.org/), [Linux Mint](https://linuxmint.com/), [XFCE](https://xfce.org/), [Google ChromeOS](https://www.chromium.org/chromium-os).
- Graphics: [GIMP](https://www.gimp.org/) with some brushes by [Bill Scott](http://www.texturemate.com/content/about).
- Sound: [Audacity](http://www.audacityteam.org/), [Sunvox](http://www.warmplace.ru/soft/sunvox/) by Alexander Zolotov.
- Misc: [Git](https://git-scm.com/), [GitHub](https://github.com/), [Geany](http://www.geany.org/), [Thunar](https://en.wikipedia.org/wiki/Thunar), [Firefox Browser](https://www.mozilla.org/en-US/).

#### Graphics
- [SuperTux2](https://supertuxproject.org/) Team for the art style and many assets.
- [Tiny Spec](https://www.glitchthegame.com/public-domain-game-art/) for the public domain release of the assets they created for their game, Glitch. All the collectable items in RocketTux are from [ThirdPartyNinja's](https://github.com/ThirdPartyNinjas/GlitchAssets) repository of Glitch items converted into PNG format.

#### Sound and Music
- Sounds: [SuperTux](https://supertuxproject.org/) and contributors for some sound effects, [Richard Boulanger](http://www.csounds.com/boulanger/) for some intruments in some songs, [Mike Koenig](https://soundcloud.com/koenig) some portions of sound effects.
- Music: [R. Bassett Jr.](http://www.tpot.ca), aka Me!

#### QA Testers
- Neillia Bassett, Baylea Bassett, Abby Bassett. 

#### Artistic Advisers
- Neillia Bassett, Baylea Bassett, Abby Bassett.

#### Special Thanks
- My family. You guys rock!
- The [Phaser](http://phaser.io) and [HTML5 Game Devs](http://www.html5gamedevs.com) communities for sharing their knowledge!

