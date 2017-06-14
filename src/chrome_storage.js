/* Browser data storage and retrival for RocketTux as a Google Chrome "Packaged App"
 * R. Bassett Jr. (www.tpot.ca) June, 2017
 * Original logic learned from Miso Soup on stackoverflow.com
 * https://stackoverflow.com/questions/15594044/saving-data-in-text-file-using-chrome-packaged-app-extension
 * 
 * saveStorage(key, value) 
 * - Saves a key/value pair into the Chrome data storage area.
 * - Can be called from anywhere in the game.
 * 
 * chrome.storage.onChanged.addListener(function(changes, namespace) 
 * - Listens for changes to values in the data storage area and updates any game 
 *   variables that have been altered.
 * 
 * I absolutely loathe this kind of programming, it's convoluted and stupid 
 * all in the name of the most boring non-subject imaginable, "computer 
 * security"... Who cares, I just want to program a single player game without 
 * having to use some kid's spaghetti code concepts that he thinks are "real 
 * cool!" *cough* SystemD *cough*. Ya know? The HTML5 default of 
 * localStorage.setItem() makes sense, but we can't use it in a Chrome 
 * "Packaged App", so... we get this mess instead. Yay...
 * 
 * Example: Show the Coins value on the main menu.
 * 1. When the game loads, rtStorage['myCoins'] will be undefined, so in the 
 * mainmenu.js set it to 0 using saveStorage() and book callback event to 
 * show the value after the listerner below has had a chance to run.
 * 2. In the listener function, any time rtStorage['myCoins'] == 0, then
 * we know the program just loaded and we want to actually set 
 * rtStorage['myCoins'] back to the value that was previously stored in the 
 * Chrome storage area for it.
 * 3. Insert a shit load of if this, if that fuckery and...
 * 4. The event we booked has triggered and the text is added to the screen!
 * 
 * Convoluted as hell, eh? I hate it, but it's what I have to work with... 
 * 
 * - R. Bassett Jr. (Tatwi)
 * 
 * Ps. I really hate it.
 */

// Using global space, as nested space won't work
var storage = chrome.storage.sync; // sync, because local doesn't work
var rtStorage = {}; // Object that holds our data

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for(key in changes) {
    var storageChange = changes[key];

    console.log('Storage key "%s" in namespace "%s" changed. Old value was: %s, new value is: %s', key, namespace, storageChange.oldValue, storageChange.newValue);
    
    // Update game variables as they change
    if (key == 'myCoins'){
        if (storageChange.newValue == 0){
            // Init the value in rtStorage for this game session
            rtStorage.myCoins = storageChange.oldValue;
        } else{
            rtStorage.myCoins = storageChange.newValue;
        }
        
        console.log('myCoins value updated to: ' + rtStorage.myCoins);
    }
  }
});

function saveStorage(key, value) {
  rtStorage[key] = value;
  storage.set(rtStorage, function() {});
  console.log('Global saveStorage complete for %s with value %s', key, value);
}
