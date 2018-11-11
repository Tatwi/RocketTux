### Building and Exe using NW.js  
Thanks to the awesome folks at Node.js and NW.js, packaging RocketTux with a copy of the open source Chromium browser is super easy. It even works for Linux, Windows, and MacOS in pretty much the same way, though I don't have a Mac, so I haven't tried it.  

To greatly simplify the process, I created a bash script that can be run on Linux with a standard Bash shell or on Windows using Git Bash. Read the script to see the steps that it goes through. Here are the instructions:  

#### Linux
1. Download RocketTux, either using git or as a zip file.
2. cd into RocketTux directory and type  
  
  sh make-build.sh  
  
3. Choose your platform and the correct NW.js will be downloaded.
4. Wait for the files to be combobulated.
5. cd into the build directory and type  
  
  chmod -x RocketTux  
 
6. Run the game by typing ./RocketTux
7. Future builds will reuse the NW.js file you already downloaded. To build for a different platform, simply rename the NW.js download with a minus sign as the first character. You can also use the -q or --quick switch to only update the RocketTux specific files that have changed.
  
You may encounter issues with outdated WS.js dependancies, depending on your Linux distro, but they can usually be fixed by simply running the update function of your package manager. Either way, the console output will tell you what is out of date.

#### Windows
1. Download and install [Git Bash](https://gitforwindows.org/).
2. Download [wget.exe](https://eternallybored.org/misc/wget/) and put it in C:\Program Files\Git\mingw64\
3. Open Windows Explorer, left click on My Documents, right click and choose Git Bash Here.
4. Download RocketTux with Git by typing  
  
  git clone https://github.com/Tatwi/RocketTux.git
  
5. cd into the rockettux directory and type  
  
  sh make-build.sh 
  
6. Choose your platform and the correct NW.js will be downloaded.
7. Wait for the files to be combobulated.
8. In Windows Explorer open the My Documents\RocketTux\build and double click on RocketTux.exe to play the game.
9. Future builds will reuse the NW.js file you already downloaded. To build for a different platform, simply rename the NW.js download with a minus sign as the first character. You can also use the -q or --quick switch to only update the RocketTux specific files that have changed.
