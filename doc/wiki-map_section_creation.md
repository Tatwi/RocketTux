## Map Section Creation

The levels in RocketTux are created by stitching together several random 40x23 tilemap sections from one of the eight level themes. There aren't any rules programmed to say which pieces must go beside the other, allowing each level to be a totally random selection of tilemap sections (26 to choose from for each theme). As a result, the only rules you the human being need to adhere to when creating level sections are:

1. The left and right side of each tilemap section must have:  
	- The same ground height.  
	- Not block the player from spawning in the first column of the map section.  
	
2. Primarily the tiles that are visually intended to be used for a given theme.  

The tilemap sections themselves are simply an array of numerical values that correspond to the 32x32 pixel squares on the data/world.png image. In Phaser, the first "tile" is 0 and they count left to right, top to bottom from there. Here is an example of a tilemap section array,  

```js:
a:[
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,',
	'0,0,0,0,0,0,0,0,1268,1269,1270,1271,1272,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,',
	'0,0,0,0,0,0,0,0,1332,3341,3342,3343,1336,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,1396,1397,1398,1399,1400,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3330,3331,3331,3329,3331,3331,3332,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,3330,3331,3329,3331,3332,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,3330,3331,3329,3331,3332,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,299,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,3579,0,0,0,0,0,299,0,0,634,635,636,0,0,0,0,0,0,299,0,0,0,3579,0,0,0,299,0,0,0,0,0,0,0,0,0,',
	'0,0,0,0,3643,0,0,0,0,0,299,0,0,698,699,700,0,0,0,0,0,0,299,0,0,0,3643,0,0,0,299,0,0,0,0,0,0,0,0,0,',
	'3704,3704,3704,3704,3707,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3707,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,3704,',
	'3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,3768,'
],
```  

As you could well imagine, it would be a bloody nightmare to make levels by starting with an array full of zeros and then manually typing the numbers for every tile. That said, there's no reason, save one's sanity, why doing this wouldn't work! Thankfully though the tilemap concept is very common and many folks have created tools that make it easy to do this number typing in the background while the user visually paints with the tiles. For RocketTux, I have been using the open source [Tiled Editor](https://www.mapeditor.org/) by horbjørn Lindeijer (and many other contributors).  

The great part about Tiled is that it works very well RocketTux, even though the only feature of it that I need/use is the painting of tiles. The bad part is that Tiled starts its tile reference at 1, where as I mentioned, Phaser starts its tile reference at 0. In a practical sense, it's not a big deal, because the tiles paint the same, but it does mean that I had to create a tool to convert the values saved by Tiled to values that are usable by Phaser.  

I should mention that there is a plug in for Phaser that can directly read the Tiled file format, but I didn't use it because it was inefficient and ineffective for creating the randomized levels. Due to the fact that all I used were the tile arrays themselves, it made way more sense to put all of the arrays for the map sections together in the src/preload.js file, where they can be loaded into RAM once and used repeatedly for the duration of the program (rather than loaded from the disk/server over and over from many separate files). After all, computers these days have more than enough RAM to store the data.  

The conversion tool is doc/tiled_value_converter.html and it's very simple to use; Copy, paste, click button, copy, paste, rename NAME, done.  


### Creating a Map Section
1. Open Tiled. If this is the first time you're using tiled, you will need to point it to the "tile set" file data/tilemap_sections/tilemap.tsx so that knows what tiles to paint with.  

2. Create a new tilemap with following values:  
- Orientation: Orthogonal  
- Tile layer format: CSV  
- Tile render order: Right Down  
- Map Size: Width 40 tiles, Height 23 tiles  
- Tile Size: Width 32px, Height 32px  

And save it in the data/tilemap_sections/ directory with an appropriate name. Really, you can save it where ever you'd like, as the file isn't used by the game at all, but data/tilemap_sections/ is where the RocketTux tilemap sections are saved (because it allows for easy editing/fixing!).  

3. Start painting tiles!
- Select tiles to paint with in the Tilesets window on the right and left click to pain them on map in the left window (using the default stamp tool).  
- You can select multiple tiles in the Tilesets window by holding/dragging left mouse over an area or by holding the CLT key on the keyboard and clicking any number of tiles.  
- If you want to draw shapes that have parts from all over the tilemap, such as the palm tree, it is easier to pain the parts separately on the level and then hold right mouse to select/copy the finished object, which you can then stamp elsewhere on the level. Another example: I did the clouds by left click dragging over the cloud in the Tilesets window, stamping that onto the level, then going down to the lower left of the tile set and left mouse drag selecting the three center cloud tiles and painting them into the center of the cloud.  
- NOTE: The lower portion of the tilemap, from the red CS-> square (tile 3072) over, are treated as solid in the game. There are execptions for several, such as clouds and thin platforms, that are treated as solid only on their top surface, thereby allowing the player to pass through them from below.  

 
### Using a Map Section in the Game

After creating the map section, you will need to open it in your favorite text editor (I used Geany to make the game) and copy only the comma separated numbers that we'll use for the game. I always clicked to the left of the first number and then drag selected down to the line below, to the left of the data tag. Do not select any of XML tags, etc.  

Next, open doc/tiled_value_converter.html in your web browser, paste the values into the Input Values: text box, and then press the For RocketTux button. Select/copy all the output text. (Press F5 to refresh later if you want to do another conversion).  

Next, open the src/preload.js file and scroll way down to the worldObjects function and locate the theme you'd like to add the section to. Scroll to the bottom of that section, make sure there is a comma after the last entry, enter a new line, paste your new level section data, change NAME to something appropriate, and fix the tab spacing.  

If you're fixing an existing section it's easier (and less error prone) to just delete the one in src/preload.js and then paste your replacement back in the same spot (and rename NAME to match the original).  

And that's really all there is to it! This the process I followed when making all 208 map sections and as far as work flows go, I actually really liked this one for it simplicity and speed.  

- R. Bassett Jr. (Tatwi)  