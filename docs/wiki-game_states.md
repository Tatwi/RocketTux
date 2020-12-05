## Game States

Phaser CE allows for games to be built in parts that are separate from each other, so that the user can be guided from one activity to another while the programmer is better able to organize the code for those activities. These activities are called "States" and only one state is active at any given time. In RocketTux, the states are organized as follows.  


### Program Flow

main.js (not a state)  
 ||  
 \/  
boot.js  
 ||  
 \/  
preload.js  
 ||  
 \/  
mainmenu.js  
 /\ /\ /\ /\ /\  
 || || || || ||  
 \/ \/ \/ \/ \/  
game.js, friends.js, help.js, inventory.js, settings.js  


### main.js
This is the configuration for Phaser CE, where all of the states are defined. It launches the Boot state.  


### Boot State

This state basically has one purpose, to load the assets used to display the loading bar. Though it also is home to a work-around for the no-sound-until-clicked issue that Google caused in Chrome at one point. The game doesn't really _need_ this state, but it's nice to have as it gives the player some feedback on what's happening during the loading process.  


### Preload State

Probably the most important state of them all, the Preload state is responsible for...

- Displaying the splash screen / loading bar.
- Defining and loading the graphic and sound assets into RAM.
- Loading the tilemap and other common arrays/data into RAM.
- Loading saved game data from "Local Storage" (web browser cache).
- Launching the rest of the game.


### Main Menu State

This menu is the main hub of the game where the player will leave and return to when taking part in activities. This state allows the player to...

- See the coins they have in their wallet.
- See their active powerup.
- Unlock levels.
- Change the level difficulty.
- Play levels.
- Access the Friends, Help, Inventory, and Settings states.


### Friends State

Here the player can assign up to four Cubimals, each of which grants them some type of bonus or enhancement. They are also able to help their friends by giving them back the items Nolok stole from them, one the items have been found. Both friends and Cubimals are discovered by passing over the green exclamation boxes that can be found in some levels.  


### Inventory State

As the player travels through the levels, they will collect items from blue and orange question mark boxes. These items automatically end up here in their inventory. Using the mouse, the player is able to manage their inventory, either selling or donating what they don't need. Inventory items are stored in "Local Storage" as individual variable names, such as RocketTux-invItem29, and are related to the name and description tables found in the preload.js file.  


###  Help and Settings States

These states are pretty straight forward, offering the player to choose some customizations and providing them with some insights on how to play the game.