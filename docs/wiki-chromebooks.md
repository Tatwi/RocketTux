### Playing on a Chromebook
I originally created RocketTux as a Chrome App, because I thought it would be neat to use a Chromebook to create games for Chromebooks. Turns out that for me, this proved to be cumbersome and annoying, given that I had a perfectly good desktop computer to use. However, the game is still designed to run well on the low-end Chromebooks, such as the ones found in elementry schools. This document explains the various ways I know how to get the game to work on Chromebooks.  

#### Web Server for Chrome Extension
RocketTux is an HTML5 game, which means you can't just download it and open the window.html file to run it. Rather, it needs to be "hosted" from a web server of some kind and the easiest way to do that is by adding an extention to Chrome that can host a folder on your Chromebook as a "website". Technically, this website can be accessed by any other computer on the local network, but that's not important for our purposes - we just want to run the game.  

Here are the steps:  

1. Open More Tools > Extensions
2. Enable Developer Mode using the switch (you may need permission from your admin).
3. Open the Extentions Main Menu (left) and Open Chrome Web Store (bottom)
4. Select Apps radial button and search "Web Server For Chrome". The correct app is by chromebeat.com. Install the app.
5. Go back to Extensions, find the web server and enable it with the switch.
6. Open the file manager and create a new folder in your Downloads called www
7. Open the App Launcher and click the Web Server app
8. In the Web Server app window, click the CHOOSE FOLDER button, browse to the www folder and click the open button.
9. Click the Web Server URL link http://127.0.0.1:8887 to open the browser where the www folder is being hosted.
10. Download RocketTux as a zip file from this GitHub respository, open it, and copy the RocketTux-master folder to your www folder.
11. Go back to the broswer tab that is at http://127.0.0.1:8887 and refresh the page so it shows the new RocketTux-master folder.
12. Click on rockettux-current and then click on window.html to launch the game. 
13. Click the star to create a bookmark to the game. 
14. To update the game, simply download a the current version, deleted the www/RocketTux-master folder, and copy/paste the latest version to your www folder.  

#### Host it on a Different Computer
Have a look at [my documentation](wiki-using_a_websever.md) for hosting the game using a web server on Linux or Windows. You can also poke around the Internet for help. The game doesn't need anything special to function, just an HTTP server.

#### As a Chrome App  
Due to the insane and unreliable manner in which Google has forced the saving/loading of user data, I decided to convert RocketTux into a plain web app. Normal HTML5 data saving/loading is simple to use, reliable, and "makes sense". As such, running RocketTux as a Chrome App is not supported. Perhaps you can figure out how to make it work properly! :)
 
