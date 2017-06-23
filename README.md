# RocketTux
A pengiun with a rocket pack? It sure is as awesome as you're imagining!  

RocketTux is a side scroller adventure with player-influenced random level generation, quests, reputations, basic crafting, and other fun stuff! The game is primarily about collecting coins and completing quests by collecting and/or crafting items, while puzzling your way through resources management and level navigation. While there isn't any combat in the game, the ever mischievous Nolok has a tendency to let his walking bombs and other "hilarious machines" run wild... Along with Nolok's toy-box gone wrong, the Tux may also encounter extreme weather, angry stones, and various projectiles of questionable origin.  

### About Development
- **Current Version:** 0.2.5 (June 2017)
- **Next Version Expected:** July 2017
- **Version 1.0 Expected:** February 4th, 2018 (My 40th birthday!)
- Programmed from scratch using [Phaser CE](http://phaser.io/download/stable), as a way to learn the Phaser CE framework and because making games is fun!
- Based on visual art assets from [SuperTux](https://supertuxproject.org/) and [Glitch](https://www.glitchthegame.com/public-domain-game-art/).
- RocketTux is its own unique game, rather than a clone of Supertux.
- Created with Linux Mint 17 on an AMD FX-8320 / R9 270 based desktop PC. 
- Tested on an [HP Chromebook 14 G4](https://support.hp.com/us-en/product/hp-chromebook-14-g4/8326221/document/c04828937).
- Optimized for Chromebooks, designed for 1280x720 resolution (will stretch up to 3840×2160 aka 4K, but likely will look terrible past 1080p).
- **No advertisements, subscriptions, micro-transaction, or purchase fees.** Just free, open source fun!

#### Milestones
- Vesion 0.0: Prototype converted into a real project.
- Vesion 0.1: Basic world generation and player movement, and day/night art.
- Vesion 0.2: Complete player, level generation, and entity spawning mechanics.
- Vesion 0.2.5: Playable basic game with usable UI.
- Vesion 0.3: Complete the sprites, tiles, the enemy game mechanics, and the game sounds.
- Vesion 0.4: Create all the level themes and level sections.
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
- "Coin-Bounce" or use a boost to move up higher in the air. Hold up/down to maintain height. Puzzle your way through the obstacles to collect all the coins and quest items.
- Meet new people, do quests for them, and gain reputation with them to unlock unique rewards. They'll even become your travel companion, each offering their own utility.
- Randomly generated levels with at least 26 different tiles per theme.
- Influence the time and place of your adventures, along with other properties of the world.
- No death mechanic. If you bump into an enemy, you lose some coins and your rocket pack loses some integrity.
- No time limits. Stop and smell the Fire Flowers!
- No forced movement through levels. This ain't no "endless runner" game!
- No need to reach the end of a level to "beat it". In fact, you'll probably go back and forth a few times! The level ends when you feel like leaving it. You get a bonus for collecting all the coins though.
- No "secret areas" or other potentially annoying mechanics that you'll need to look up on the Internet just to understand!

### Installation
RocketTux is built as an "HTML5 web app" that is optimized to run well on basic Chromebooks or on desktops using the Google Chrome browser (it's slow in Firefox and I don't recommend using anything other than Google Chrome for the game). This makes RocketTux "cross platform compatible" with any system that can run a the Chrome web browser (either Google's version or the open source "Chromium" version), which means it will work on Chromebooks and Linux/Window/Mac PCs! Heck, it even runs on my Samsung Galaxy S6 Android phone, but at this time there aren't any touch screen controls for the game (Perhaps I will make them eventually). Chrome makes for a great "run time environment" for WEBGL applications.  

Until such a time as I create a website to host the game, you will need to download it run it at home. However, there is a catch!  

To run RocketTux at home, you'll need to use a "local web server" on your computer to "host" the game. This sounds complicated (and you *can* make it complicated...), but there are some really simple tools available on Linux, Mac, and Windows. Here is how you can download and run RocketTux:

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
- You will have to host RocketTux from a desktop computer on your home network, by following the steps above. The only difference is on the Chromebook you will have to type in the network address of the computer that is hosting the game, rather than 127.0.0.1. If you don't know how to find the ip address of the host computer, you can use the included Python "runserver.py" script to find it or you can do a quick internet search about how to find the IP address of the host computer. :) Personally, I set the IP address on my desktop as a "static ip" of 192.168.0.77 so that it will always be the same and it is easy to remember.
- At this time, RocketTux does not have controls for touch screen devices, such as Android phones and tablets. So, while it will load on them, you won't be able to DO anything in the game.

    
#### Windows
- Untested, unsupported.
- Please search the web on how to install and run a web server in Windows. The rest of steps are pretty much the same as for Linux (though you can download Chrome from Google's website rather than using the command prompt).

#### Mac
- Untested, unsupported.
- Please search the web on how to install and run a web server in MacOS. I don't have access to a Mac, but I would imagine that the rest of steps are pretty much the same as for Linux.

#### iPhone and other devices
- Untested, unsupported.

### Controls
- RocketTux is designed to be used with keyboard and mouse. I might add game controller and touch screen support in the distant future.
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

