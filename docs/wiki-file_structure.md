## Project File Structure
Just in case it's not obvious, here is a description of what all the files are directories in the project are for, starting with the project root directory.  

### / 
- builder: A BASH shell script that I use to create the build directory, which contains the Windows or Linux desktop version of the game.
- favicon.ico: The RocketTux icon, which is named this for reasons I can no longer recall, but it had something to do with automatically being used by something. Anyway, it's a Windows compatible icon.
- index.html: The main/starting game file when the game is run using a web server.
- LICENSE: A copy of the General Public 3 License and the Creative Commons 3 License.
- package.json: This is the first file loaded by NW.js when running the game as desktop program. It tells NW.js where the rest of the files are as well as other configuration info.
- README.md: The project's main information file.
- runserver.py: A Python script for Linux to run a simple web server to host the game on one's own computer.
- runserver-windows.py: A Python script for Windows to run a simple web server to host the game on one's own computer.
- window.html: The second file run by NW.js when running the game as a desktop program. It's almost identical to index.html, both of which start the whole "web site" / JavaScript aspect of the game.

### /build
- Not included in the repo.
- This is where the builder script puts the NW.js and game files that work together to make the game playable as a desktop program.

### /data
- Contains all of the images, sounds, icons, etc. that make up the game.
- logo.png: The main logo / title.
- loadingbar.png: It's the loading bar seen when first opening the game.
- skies.png/skies-special.png: The 8 background images for the game, seen in the levels and on the menu screens.
- world.json: This file tells Phaser the names and locations of sprites on the world sprite map.
- world.png: This enormous file is both the main sprite map and the tilemap for the game. The idea here is that when playing a level only two image files are used, the background image and this image, which dramatically improves the performance on low-end hardware, such the old Chromebooks which were the original target devices for the game.

### /data/icons
- Icons of various sizes, in png format. Primarily for use in Linux.

### /data/music
- The Vorbis (ogg) format music files used by the game.

### /data/sounds
- The Vorbis (ogg) format sound effect files used by the game.

### /data/tilemap_sections
- These files are not actually used by the game!
- Each level in the game is made up of 26 tilemap sections that are 40 tiles wide and 23 tiles tall. For the sake of my sanity, I used the program called "Tiled" to draw these map sections, however the game only uses the comma separated value data within these files. That said, it's important to keep these files so that one can quickly load and modify/fix a map section.
- The data in these files is manually exported using /tools/tiled_value_converter.html and copy/pasted into /src/preload.js.
- tilemap.tsx: The tilemap guide used by the Tiled program to keep track of what is where.


### /data/ui
- These files are used to create the user interface in the menus of the game. The very simple UI you see when playing a level is generated using graphics only on /data/world.png for performance reasons.
- friends.tmx, inventory.tmx, main-menu.tmx: These are also Tiled files that I used to draw the background for the menu screens. In these cases, two layers are used to allow the "game device" chassis to be tinted various colours for fun!
- main-menu.tsx: The tilemap guide used by the Tiled program to keep track of what is where.
- menu_map.png: Like the world.png, this file is both the sprite sheet and tilemap for the menu screens.
- sceens.json: This file tells Phaser the names and locations of sprites on the screens sprite map.
- screens.png: The main menu is designed to look like a portable game device. These are the "screens" representing each level type seen on that device.
- ui.json: This file tells Phaser the names and locations of sprites on the menu sprite map.

### /docs
- This is where you find the detailed documentation for the project, such as the file you are reading right now!
- config.ylm: A GitHub Pages related file that works some magic.
- inventory_items.ods: The spreadsheet I used to generate all of names of and associations for the inventory items in the game. Some of it was automated, some was manually created.
- .md files: Helpful information about the project.

### /GIMP
- On my system this is where the GIMP images files used to make the game are stored and worked on. Git isn't able to track their internal changes and the files are very large, so they are not included in the repository. Instead, the README.md inside this directory links to a folder on my Google Drive where I keep a backup of these files.

### /lib
- Software written by other people that is required by the game.
- phaser.map, phaser.min.js: The JavaScript game engine, based upon and including PIXI, which is what makes RocketTux possible!
- yuicompressor-2.4.8.jar: A handy tool that I use to remove all the comments and other unnecessary stuff in the source code of the game when packaging it as a desktop program.

### /screenshots
- Images take of the game at various points during development.

### /src
- The JavaScript source code that comprises the game and all its levels.
- main.js: Run first. Main Phaser configuration for the game states and the game window.
- boot.js: Run second. Setups up the loading bar for use by the next stage.
- preload.js: Loads all of the assets and shared variables used by the game and menus.
- mainmenu.js: The main menu.
- game.js: Every level in the game is a variation of this file!
- friends, help, inventory, settings: All of the other menu pages for various parts of the game.

### /tools
- json_atlas_tool.html: A tool that I used to create the JSON entries I needed for the 192 icons in RocketTux.
- tile_num_generator.html: Handy tool for making a number grid to put behind a tile map image in GIMP!
- tiled_value_converter.html: Tilemaps in Phaser start at 0, where as tilempas in the Tiled editor start at 1. This tools converts the Tiled CSV data into Phaser CSV data, while also formatting it all nice like for easy copy/pasting.