#!/bin/bash
# This script will create an executable release using NW.js for
# Windows or Linux. When using on Windows in Git Bash, wget.exe 
# must be added to C:\Program Files\Git\mingw64\
#
# NW.js 0.58.0 runs the game using Node.js 16.10.0 and Chromium 95.
# JavaScript minified using YUICompressor 2.4.8.
# 
# Note that you can reuse a NW.js zip file that you have already
# downloaded by putting it in the root directory of the project
# and running this script.
#
# The script supports using the SDK versions of NW.js, which offer the
# F12 Chromium system tools. you can manually download your version 
# of choice at https://nwjs.io/downloads/
#
# All other platforms are not supported.

set -e
clear
echo "    Building RocketTux Release"
echo -e "==================================\n"

# Quick rebuilding for ease of development
# Usage: sh make-build.sh -q
if [[ "$1" == "--quick" ]] || [[ "$1" == "-q" ]]
then 
	echo -e "Executing quick build:\nOnly over-writing RocketTux specific files if they have been updated.\n"
	
	cp -uv README.md build/
	cp -uv LICENSE build/
	cp -uv window.html build/
	cp -uv package.json build/
	cp -uv favicon.ico build/
	cp -uv data/icons/icon-128.png build/
	cp -uv src/boot.js build/src/
	cp -uv src/game.js build/src/
	cp -uv src/main.js build/src/
	cp -uv src/mainmenu.js build/src/
	cp -uv src/preload.js build/src/
	cp -uv src/help.js build/src/
	cp -uv src/inventory.js build/src/
	cp -uv src/settings.js build/src/
	cp -uv src/friends.js build/src/
	cp -uv lib/phaser.min.js build/lib/phaser.js
	cp -uv lib/phaser.map build/lib/phaser.map
	cp -ruv data/music build/data/music
	cp -ruv data/sounds build/data/sounds
	cp -ruv data/ui build/data/ui
	cp -uv data/*png build/data
	cp -uv data/world.json build/data
	
	echo -e "\nBuild complete!"
	exit 1
fi

# Check if NW.js file has already been downloaded and download if need
NWJS=0
FILENAME="null"
BUILDTYPE="Release"

# Release version
if [ -f nwjs-v* ]; then
	NWJS=1
	FILENAME=$(ls nwjs-v*)
fi

# Developer version
if [ -f nwjs-sdk-v* ]; then
	NWJS=2
	FILENAME=$(ls nwjs-sdk*)
	BUILDTYPE="Development"
fi 

if [ $NWJS == 0 ]; then
	echo
	echo "Which system are you building for?"
	echo "=================================="
	echo "1. Windows 64 Bit"
	echo "2. Windows 32 Bit"
	echo "3. Linux 64 Bit"
	echo "4. Linux 32 Bit"
	echo "=================================="

	read -p "Enter a number (1-4): " VER

	if [[ -n ${VER//[0-9]/} ]] || [[ $VER > 4 ]] || [[ $VER < 1 ]]; then
		echo -e "Error: Invalid user input.\nPlease only select 1, 2, 3, or 4 and press ENTER."
		exit 1
	fi

	echo -e "\nOption" $VER "selected. Downloading now..."

	if [[ $VER == 1 ]]
	then
		wget -q --show-progress --progress=bar:force:noscroll "https://dl.nwjs.io/v0.58.0/nwjs-v0.58.0-win-x64.zip"
	elif [[ $VER == 2 ]]
	then
		wget -q --show-progress --progress=bar:force:noscroll "https://dl.nwjs.io/v0.58.0/nwjs-v0.58.0-win-ia32.zip"
	elif [[ $VER == 3 ]]
	then
		wget -q --show-progress --progress=bar:force:noscroll "https://dl.nwjs.io/v0.58.0/nwjs-v0.58.0-linux-x64.tar.gz"
	elif [[ $VER == 4 ]]
	then
		wget -q --show-progress --progress=bar:force:noscroll "https://dl.nwjs.io/v0.58.0/nwjs-v0.58.0-linux-ia32.tar.gz"
	fi	
	
	NWJS=1
	FILENAME=$(ls nwjs-v*)
else 
	echo "Previously downloaded NW.js file found."
fi 

# Extract the NW.js file
echo -e "\nExtracting" $FILENAME "now..."

if [[ $FILENAME == *"linux"* ]]
then
	# Linux
	tar -xvzf $FILENAME
fi

if [[ $FILENAME == *"zip"* ]] 
then
	# Windows
	unzip -o $FILENAME
fi

echo -e "\nNW.js extraction complete..."

# Rename downloaded file so we can use wildcards to rename the extracted directory
mv $FILENAME nw-download.tmp

# Clean up old build directory
if [[ -d build ]]
then 
	echo -e "\nDeleting old build directory...\n"
	rm -Rf build;
fi 

# Rename build directory
if [ $NWJS == 1 ]; then
	mv nwjs-v* build
fi 
if [ $NWJS == 2 ]; then
	mv nwjs-sdk-v* build
fi 

# Set the download file name back to normal
mv nw-download.tmp $FILENAME

echo -e "Copying game files...\n"

# Make directories
mkdir build/src
mkdir build/data

if [[ -d build/lib ]]
then 
	echo -e "build/lib already exits..."
else
	mkdir build/lib
fi

# Rename executable file
if [[ $FILENAME != *"zip"* ]]
then
	# Linux 
	mv build/nw build/RocketTux
else 
	# Windows
	mv build/nw.exe build/RocketTux.exe
fi

# Copy only the files needed to run the game, the readme, and the license
cp -v README.md build/
cp -v LICENSE build/
cp -v window.html build/
cp -v package.json build/
cp -v favicon.ico build/
cp -v data/icons/icon-128.png build/
cp -v lib/phaser.min.js build/lib/phaser.js
cp -v lib/phaser.map build/lib/phaser.map
cp -rv data/music build/data/music
cp -rv data/sounds build/data/sounds
cp -rv data/ui build/data/ui
cp -v data/*png build/data
cp -v data/world.json build/data

# Minify the game files
if ! command -v java &> /dev/null
then
	echo -e "Java not installed. Unable to minify JavaScript."
	cp -v src/boot.js build/src/
	cp -v src/game.js build/src/
	cp -v src/main.js build/src/
	cp -v src/mainmenu.js build/src/
	cp -v src/preload.js build/src/
	cp -v src/help.js build/src/
	cp -v src/inventory.js build/src/
	cp -v src/settings.js build/src/
	cp -v src/friends.js build/src/

else
	echo -e "Minify JavaScript with YUICompressor..."
	java -jar lib/yuicompressor-2.4.8.jar src/boot.js -o build/src/boot.js
	java -jar lib/yuicompressor-2.4.8.jar src/game.js -o build/src/game.js
	java -jar lib/yuicompressor-2.4.8.jar src/main.js -o build/src/main.js
	java -jar lib/yuicompressor-2.4.8.jar src/mainmenu.js -o build/src/mainmenu.js
	java -jar lib/yuicompressor-2.4.8.jar src/preload.js -o build/src/preload.js
	java -jar lib/yuicompressor-2.4.8.jar src/help.js -o build/src/help.js
	java -jar lib/yuicompressor-2.4.8.jar src/inventory.js -o build/src/inventory.js
	java -jar lib/yuicompressor-2.4.8.jar src/settings.js -o build/src/settings.js
	java -jar lib/yuicompressor-2.4.8.jar src/friends.js -o build/src/friends.js
fi

echo "=================================="
echo -e $BUILDTYPE "Build Complete!\n\nAll files required to play the game are in the build directory."
