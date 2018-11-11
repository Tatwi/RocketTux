#!/bin/bash
# This script will create an executable release using NW.js for
# Windows or Linux. When using on Windows in Git Bash, wget.exe 
# must be added to C:\Program Files\Git\mingw64\
# 
# Note that you can reuse a NW.js zip file that you have already
# downloaded by putting it in the root directory of the project
# and running this script.
#
# MacOS is not supported, as I no way to test it. However, it 
# should work using http://dl.nwjs.io/v0.34.2/nwjs-v0.34.2-osx-x64.zip

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
	cp -uv lib/phaser.min.js build/lib/phaser.js
	cp -uv lib/slick-ui.min.js build/lib/
	cp -ruv data/music build/data/music
	cp -ruv data/sounds build/data/sounds
	cp -ruv data/ui build/data/ui
	cp -uv data/*png build/data
	cp -uv data/world.json build/data
	
	echo -e "\nBuild complete!"
	exit 1
fi

# Check if NW.js file has already been downloaded and download if need
if [ ! -f nwjs-v* ]; then
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
		wget -q --show-progress --progress=bar:force:noscroll "http://dl.nwjs.io/v0.34.2/nwjs-v0.34.2-win-x64.zip"
	elif [[ $VER == 2 ]]
	then
		wget -q --show-progress --progress=bar:force:noscroll "http://dl.nwjs.io/v0.34.2/nwjs-v0.34.2-win-ia32.zip"
	elif [[ $VER == 3 ]]
	then
		wget -q --show-progress --progress=bar:force:noscroll "http://dl.nwjs.io/v0.34.2/nwjs-v0.34.2-linux-x64.tar.gz"
	elif [[ $VER == 4 ]]
	then
		wget -q --show-progress --progress=bar:force:noscroll "http://dl.nwjs.io/v0.34.2/nwjs-v0.34.2-linux-ia32.tar.gz"
	fi	
else 
	echo "Previously downloaded NW.js file found."
fi 

# Extract the NW.js file
FILENAME=$(ls nwjs-v*)
echo -e "\nExtracting" $FILENAME "now..."

if [[ $FILENAME != *"zip"* ]]
then
	# Linux
	tar -xvzf $FILENAME
else 
	# Windows
	unzip -o $FILENAME
fi

echo -e "\nExtraction complete..."

# Rename downloaded file so we can use wildcards to rename the extracted directory
mv $FILENAME nw-download.tmp

# Clean up old build directory
if [[ -d build ]]
then 
	echo -e "\nDeleting old build directory...\n"
	rm -Rf build;
fi 

# Rename build directory
mv nwjs-v* build

# Set the download file name back to normal
mv nw-download.tmp $FILENAME

echo -e "Moving files...\n"

# Make directories
if [[ $FILENAME != *"zip"* ]]
then
	# Linux
	mkdir build/src
	mkdir build/data
	
	# Rename exe
	mv build/nw build/RocketTux
else 
	mkdir build/src
	mkdir build/lib
	mkdir build/data
	
	# Rename exe
	mv build/nw.exe build/RocketTux.exe
fi

# Copy only the files needed to run the game, the readme, and the license
cp README.md build/
cp LICENSE build/
cp window.html build/
cp package.json build/
cp favicon.ico build/
cp data/icons/icon-128.png build/
cp src/boot.js build/src/
cp src/game.js build/src/
cp src/main.js build/src/
cp src/mainmenu.js build/src/
cp src/preload.js build/src/
# Use mini versions of libraries
cp lib/phaser.min.js build/lib/phaser.js
cp lib/slick-ui.min.js build/lib/
cp -r data/music build/data/music
cp -r data/sounds build/data/sounds
cp -r data/ui build/data/ui
cp data/*png build/data
cp data/world.json build/data

echo "=================================="
echo -e "Build Complete!\n\nAll files required to play the game are in the build directory."
