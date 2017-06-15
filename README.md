# RocketTux
A pengiun with a rocket pack? It sure is as awesome as you're imagining!  

RocketTux is a side scroller adventure with player-influenced random level generation. Collect and spend coins, defeat bad guys, and have fun doing it! The ultimate goal is to buy all the level components so that you may generate more iteresting levels based on your preferences (or your crazy whims).

### About Development
- **Current Version:** 0.2 (June 2017)
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
- Vesion 0.1: Basic world generation and player movement, and day/night art.
- Vesion 0.2: Complete player, level generation, and entity spawning mechanics. 
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
RocketTux is built as an "HTML5 web app" that is optimized to run well on basic Chromebooks or on desktops using the Chrome browser (it's slow in Firefox, due to the rendering of text. I don't use or develop for other web browser.). This makes RocketTux "cross platform compatible" with any system that can run a the Chrome web browser (either Google's version or the open source "Chromium" version), which means it will work on Chromebooks and Linux/Window/Mac PCs! Heck, it even runs on my Samsung Galaxy S6 Android phone, but at this time there aren't any touch screen controls for the game (Perhaps I will make them eventually). Chrome makes for a great "run time environment" for WEBGL applications.  

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

