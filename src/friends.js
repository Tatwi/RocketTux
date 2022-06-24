var RocketTux = RocketTux || {};
 
RocketTux.Friends = function(){};
 
RocketTux.Friends.prototype = {
	init: function(){
		// console.log("Friends state loaded");
	},
	preload: function() {
		
	},
	create: function() {
		music = this.game.add.audio("friends");
    music.loop = true;
    music.volume = 0.5;
    music.play();
    
    // Background image
		this.bgImage = this.game.add.sprite(0, 0, 'skies-special');
		this.bgImage.animations.add('stand', [1], 1, true);
		this.bgImage.scale.setTo(1.25, 0.71); //wide, tall
		this.bgImage.width = this.game.width;
		this.bgImage.play('stand');
		this.bgImage.fixedToCamera = true;
		
		//Sounds
		this.sndFail = this.game.add.audio('collide');
			
		// Load menu tilemaps and draw game device
		this.makeMenu();
		
		this.style = { 
			font: "11px Verdana", 
			fill: "#ffffff", align: "left"
		};
		this.escText = this.game.add.text(4, 2, "Press ESC to exit", this.style);
		
		this.titleStyle = { 
			font: "24px Verdana", 
			fill: "#" + RocketTux.scrnTextColor, 
			boundsAlignH: "left", boundsAlignV: "top"
		};
			
		this.descStyle = { 
			font: "18px Verdana", 
			fill: "#" + RocketTux.scrnTextColor, 
			boundsAlignH: "left", boundsAlignV: "top"
		};
		
		// Default pages
		this.fPage = 0;
		this.cPage = 0;
		
		// Buttons
		this.btFL = this.game.add.button(102, 606, 'ui-map', this.pageFL, this, 'glow-recsml-over', 'glow-recsml-out', 'glow-recsml-down');
		this.btFR = this.game.add.button(422, 606, 'ui-map', this.pageFR, this, 'glow-recsml-over', 'glow-recsml-out', 'glow-recsml-down');
		this.btH = this.game.add.button(255, 609, 'ui-map', this.helpF, this, 'glow-cir-over', 'glow-cir-out', 'glow-cir-down');
		
		this.btDpadUp = this.game.add.button(841, 575, 'ui-map', this.cMoveU, this, 'glow-sqr-over', 'glow-sqr-out', 'glow-sqr-down');
		this.btDpadDown = this.game.add.button(841, 634, 'ui-map', this.cMoveD, this, 'glow-sqr-over', 'glow-sqr-out', 'glow-sqr-down');
		this.btDpadLeft = this.game.add.button(809, 603, 'ui-map', this.cMoveL, this, 'glow-sqr-over', 'glow-sqr-out', 'glow-sqr-down');
		this.btDpadRight = this.game.add.button(873, 603, 'ui-map', this.cMoveR, this, 'glow-sqr-over', 'glow-sqr-out', 'glow-sqr-down');	
		this.btS = this.game.add.button(1055, 577, 'ui-map', this.cSet, this, 'glow-cir-over', 'glow-cir-out', 'glow-cir-down');
				
		// Screen lines
		var scrLines = this.game.add.graphics();
		scrLines.beginFill("0x" + RocketTux.scrnTextColor, 0.6);
		// Friends screen
		scrLines.drawRect(68, 140, 472, 4);
		scrLines.drawRect(68, 388, 472, 4);
		// Cubimals screen
		scrLines.drawRect(740, 115, 472, 4);
		scrLines.drawRect(740, 214, 472, 4);
		scrLines.drawRect(740, 314, 472, 4);
		scrLines.drawRect(740, 414, 472, 4);
		
		// Friend text
		this.fTitle = this.game.add.text(118, 100, "", this.titleStyle);		
		this.fDesc = this.game.add.text(218, 160, "", this.descStyle);	
		this.fMissing = this.game.add.text(108, 406, "Missing Items:", this.descStyle);
		
		// Friend item icons
		this.fIcons = this.game.add.group();
		var tmpIcon;
		var mvR = 0;
		var mvD = 0;
		this.fCheck = this.game.add.group();
		var tempCheck;
		
		for (i = 0; i < 10; i++){
			tmpIcon = this.fIcons.create(104 + mvR*90, 440 + mvD, 'atlas');
			tmpIcon.frameName = 'icon-' + RocketTux.frndItems[this.fPage][i];
			tmpIcon.fixedToCamera = true;
			
			// Check mark if player has the item
			tempCheck = this.fCheck.create(112 + mvR*90, 480 + mvD, 'ui-map');
			tempCheck.frameName = 'check-selected';
			tempCheck.fixedToCamera = true;
			tempCheck.tint = '0x1EDC00';
			tempCheck.scale.setTo(0.50, 0.50);
			tempCheck.visible = false;
			
			mvR++;
			
			if (mvR == 5){
				mvR = 0;
				mvD = 68;
			}
		}
		
		// Friend Image
		this.fImage = this.game.add.sprite(100, 200, 'atlas');
		
		// Friend completion
		this.completeCheck = [];

		// Active Cumbimals
		this.cActive = [-1,-1,-1];
		
		// Cubimal images
		this.cImage = [];
		this.cImage[0] = this.game.add.sprite(760, 130, 'atlas');
		this.cImage[1] = this.game.add.sprite(760, 230, 'atlas');
		this.cImage[2] = this.game.add.sprite(760, 330, 'atlas');
		
		// Cubimal text
		this.cTitle = this.game.add.text(920, 80, "Cubimals", this.titleStyle);
		this.cDesc = [];
		this.cDesc[0] = this.game.add.text(844, 130, "", this.descStyle)
		this.cDesc[1] = this.game.add.text(844, 230, "", this.descStyle)
		this.cDesc[2] = this.game.add.text(844, 330, "", this.descStyle)
		this.cCost = this.game.add.text(760, 436, "    Press Up/Down for Edit Mode", this.titleStyle);
		this.cCoins = this.game.add.text(1080, 438, "8888", this.titleStyle);
		this.cCoins.visible = false;
		
		// Cubimal cost icons
		this.cIcons = this.game.add.group();
		this.cCheck = this.game.add.group();
		for (i = 0; i < 4; i++){
			tmpIcon = this.cIcons.create(838 + (i*48), 436, 'atlas');	
			
			tempCheck = this.cCheck.create(846 + (i*48), 478, 'ui-map');
			tempCheck.frameName = 'check-selected';
			tempCheck.fixedToCamera = true;
			tempCheck.tint = '0x1EDC00';
			tempCheck.scale.setTo(0.50, 0.50);
			tempCheck.visible = false;
		}
		this.cIcons.visible = false;
		this.coinIcon = this.game.add.sprite(1040, 436, 'atlas');
		this.coinIcon.frameName = 'ui-coin';
		this.coinIcon.visible = false;
		this.coinIconCheck = this.game.add.sprite(1048, 474, 'ui-map');
		this.coinIconCheck.frameName = 'check-selected';
		this.coinIconCheck.fixedToCamera = true;
		this.coinIconCheck.tint = '0x1EDC00';
		this.coinIconCheck.scale.setTo(0.50, 0.50);
		this.coinIconCheck.visible = false;
		
		// Highlight rectangle
		this.highlight;
		this.highlight = this.game.add.graphics();
		this.highlight.beginFill("0x" + RocketTux.scrnTextColor, 0.2);
		this.highlight.drawRect(740, 115, 472, 104);
		this.highlight.visible = false;
		
		// Cubimal edit mod selection, for paging through them
		this.cSelectedRow = 0;
		this.cEditMode = false;
		this.cPage = [0,0,0]; // Edit mode row0 cubimal#, row1 cubimal#, row2 cubimal#
				
		// Show first friend and cubimal pages
		this.showF();
		this.showC();
	}, 
	update: function() {
		if (this.game.input.keyboard.downDuration(Phaser.Keyboard.ESC, 1)){
			this.game.state.start('MainMenu', true, false);
		}
	},
	pageFL: function() {
		this.fPage--;
		
		if (this.fPage < 0){
			this.fPage = 17;
		}
		
		this.showF();
	},
	pageFR: function() {
		this.fPage++;
		
		if (this.fPage > 17){
			this.fPage = 0;
		}
		
		this.showF();
	},
	helpF: function() {
		// Check if already completed
		this.completeCheck = localStorage.getItem('RocketTux-fComplete').split(',');
		if (this.completeCheck[this.fPage] != 0){
			return;
		}
		
		// Check if they have all the items
		for (i = 0; i < 10; i++){	
			if (parseInt(localStorage.getItem('RocketTux-invItem' + RocketTux.frndItems[this.fPage][i])) < 1){
				this.sndFail.play();
				return;
			}
		}
		
		// Set as complete
		this.completeCheck[this.fPage] = 1;
		localStorage.setItem('RocketTux-fComplete', this.completeCheck.join(','));
		
		// Show as complete
		for (i = 0; i < 10; i++){	
			this.fIcons.getChildAt(i).visible = false;
			this.fCheck.getChildAt(i).visible = false;
			this.fMissing.text = 'You successfully return their items!';
		}
		
		// Remove items
		for (i = 0; i < 10; i++){	
			localStorage.setItem('RocketTux-invItem' + RocketTux.frndItems[this.fPage][i], parseInt(localStorage.getItem('RocketTux-invItem' + RocketTux.frndItems[this.fPage][i])) - 1)
		}
		
		// Grant reward
		localStorage.setItem('RocketTux-myKarma', parseInt(localStorage.getItem('RocketTux-myKarma')) + 1000);
	},
	cMoveU: function() {
		this.highlight.visible = true;
		this.cSelectedRow--;
		
		if (this.cSelectedRow < 0){
			this.cSelectedRow = 0;
		}
		
		if (this.highlight.y > 0){
			this.highlight.y -= 100;
		}
		
		this.cPager();
	},
	cMoveD: function() {
		this.highlight.visible = true;
		this.cSelectedRow++;
		
		if (this.cSelectedRow > 2){
			this.cSelectedRow = 2;
		}
		
		if (this.highlight.y < 200){
			this.highlight.y += 100;
		}
		
		this.cPager();
	},
	cMoveL: function() {
		if (this.cEditMode == false){
			return;
		}
		
		this.cPage[this.cSelectedRow]--;
		
		if (this.cPage[this.cSelectedRow] < 0){
			this.cPage[this.cSelectedRow] = 44;
		}
		
		this.cPager();
	},
	cMoveR: function() {
		if (this.cEditMode == false){
			return;
		}
		
		this.cPage[this.cSelectedRow]++;
		
		if (this.cPage[this.cSelectedRow] > 44){
			this.cPage[this.cSelectedRow] = 0;
		}
		
		this.cPager();
	},
	cPager: function() {
		// Enter Edit Mode
		if (this.cEditMode == false){
			this.cEditMode = true;
			this.cCost.text = 'Cost:';
			this.cCoins.visible = true;
			this.coinIcon.visible = true;
			
			for (i = 0; i < 3; i++){
				if (this.cPage[i] < 0){
					this.cPage[i] = 0;
					this.cImage[i].scale.setTo(1.0, 1.0);
				}
			}
			
			for (i = 0; i < 4; i++){
				this.cIcons.visible = true;
			}
		}
		
		// Show cost for highlighted Cubimal
		for (i = 0; i < 4; i++){
			this.cIcons.getChildAt(i).frameName =  'icon-' + RocketTux.cubCost[this.cPage[this.cSelectedRow]][i + 1];
				
			// Show check mark
			if (parseInt(localStorage.getItem('RocketTux-invItem' + RocketTux.cubCost[this.cPage[this.cSelectedRow]][i + 1])) > 0){
				this.cCheck.getChildAt(i).visible = true;
			} else {
				this.cCheck.getChildAt(i).visible = false;
			}
		}
		this.cCoins.text = RocketTux.cubCost[this.cPage[this.cSelectedRow]][0];
		// Show check mark
		if (parseInt(localStorage.getItem('RocketTux-myWallet')) >= parseInt(this.cCoins.text)){
			this.coinIconCheck.visible = true;
		} else {
			this.coinIconCheck.visible = false;
		}
		
		var alreadyActive = '';
		for (i = 0; i < 3; i++){
			if (this.cActive[i] == this.cPage[this.cSelectedRow]){
				alreadyActive = '\n** Already Active in slot '+ (i+1) + ' **'; // User facing slot # 1,2,3
			}
		}
		
		// Update icon and description
		this.cImage[this.cSelectedRow].frameName = 'cub-' + this.cPage[this.cSelectedRow];		
		this.cDesc[this.cSelectedRow].text = RocketTux.cubNames[this.cPage[this.cSelectedRow]] + '\n' + RocketTux.cubDesc[this.cPage[this.cSelectedRow]] + alreadyActive;
	},
	cSet: function() {
		if (this.cEditMode == false){
			return;
		}
		
		// Check if already active
		for (i = 0; i < 3; i++){
			if (this.cActive[i] == this.cPage[this.cSelectedRow]){
				console.log('Already Active'); // TODO: Replace with tooltip/message
				return;
			}
		}
		
		// Check if they have enough coins
		if (parseInt(localStorage.getItem('RocketTux-myWallet')) < RocketTux.cubCost[this.cPage[this.cSelectedRow]][0]){
			console.log('Insufficient Funds'); // TODO: Replace with tooltip/message
			return;
		}
				
		// Check if they have all the items
		var missingItems = '';
		var fail = false;
		for (i = 0; i < 4; i++){	
			if (parseInt(localStorage.getItem('RocketTux-invItem' + RocketTux.cubCost[this.cPage[this.cSelectedRow]][i + 1])) < 1){
				fail = true;
				missingItems += '\n' + RocketTux.lootNames[RocketTux.cubCost[this.cPage[this.cSelectedRow]][i + 1]];
			}
		}
		
		if (fail == true){
			console.log('Missing Items: ' + missingItems); // TODO: Replace with tooltip/message
			this.sndFail.play();
			return;
		}
		
		// Remove items
		for (i = 0; i < 4; i++){	
			localStorage.setItem('RocketTux-invItem' + RocketTux.cubCost[this.cPage[this.cSelectedRow]][i + 1], parseInt(localStorage.getItem('RocketTux-invItem' + RocketTux.cubCost[this.cPage[this.cSelectedRow]][i + 1])) - 1)
		}
		
		// Set and save
		this.cActive[this.cSelectedRow] = this.cPage[this.cSelectedRow];
		localStorage.setItem('RocketTux-cubimals', this.cActive.join(','));
		
		console.log('Cubimal set in slot ' + (this.cSelectedRow + 1) + ' to ' + RocketTux.cubNames[this.cActive[this.cSelectedRow]]); // TODO: Replace with tooltip/message
	},
	showF: function() {
		this.fTitle.text = RocketTux.frndName[this.fPage];
		this.fDesc.text = RocketTux.frndDesc[this.fPage];
		this.fImage.frameName = 'frnd-' + this.fPage;
		
		// Completion check
		this.completeCheck = localStorage.getItem('RocketTux-fComplete').split(',');
	
		if (this.completeCheck[this.fPage] != 0){
			for (i = 0; i < 10; i++){	
				this.fIcons.getChildAt(i).visible = false;
				this.fCheck.getChildAt(i).visible = false;
				this.fMissing.text = 'You successfully return their items!';
			}
			
			return;
		}
		
		this.fMissing.text = 'Missing Items:';
		
		// Show items
		for (i = 0; i < 10; i++){	
			this.fIcons.getChildAt(i).frameName =  'icon-' + RocketTux.frndItems[this.fPage][i];
			this.fIcons.getChildAt(i).visible = true;
			
			// Show check mark
			if (parseInt(localStorage.getItem('RocketTux-invItem' + RocketTux.frndItems[this.fPage][i])) > 0){
				this.fCheck.getChildAt(i).visible = true;
			} else {
				this.fCheck.getChildAt(i).visible = false;
			}
		}
	},
	showC: function() {
		// Active icons
		var cubTmp = localStorage.getItem('RocketTux-cubimals').split(',');
		for (i = 0; i < 3; i++){
			this.cActive[i] = parseInt(cubTmp[i]);
			this.cPage[i] = this.cActive[i];
		}
		
		for (i = 0; i < 3; i++){	
			if (this.cActive[i] == -1){
				this.cImage[i].frameName = 'blk-empty';
				this.cImage[i].scale.setTo(2.0, 2.0);
				this.cDesc[i].text = '\nNo Cubimal selected';
			} else {
				this.cImage[i].frameName = 'cub-' + this.cActive[i];
				this.cImage[i].scale.setTo(1.0, 1.0);
				this.cDesc[i].text = RocketTux.cubNames[this.cActive[i]] + '\n' + RocketTux.cubDesc[this.cActive[i]];
			}
		}
	},
	shutdown: function(){
		music.destroy();
		//console.log("Friends state exited");
	},
	makeMenu: function (){
	// Tilemap data
	this.layers = {
		// Background texture that can be colorized
		bg:[
				'0,150,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,152,0,0,0,0,150,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,152,0,',
				'0,166,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,168,0,0,0,0,166,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,168,0,',
				'0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
				'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,',
				'0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,',
				'0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,',
				'0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,',
				'0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,',
				'0,118,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,120,0,0,0,0,118,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,120,0,',
				'0,134,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,136,0,0,0,0,134,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,136,0,'
			],
		// Foreground parts (frame, buttons, etc)
		fg:[
				'0,77,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,79,0,0,0,0,77,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,79,0,',
				'0,93,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,95,0,0,0,0,93,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,95,0,',
				'0,92,70,71,71,71,71,71,71,71,71,71,71,71,71,71,72,76,0,0,0,0,92,70,71,71,71,71,71,71,71,71,71,71,71,71,71,72,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
				'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,87,86,86,86,86,86,86,86,86,86,86,86,86,86,88,76,0,',
				'0,92,87,86,86,86,86,86,86,86,86,86,86,86,86,86,88,76,0,0,0,0,92,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,',
				'0,92,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,0,0,0,92,0,0,169,170,171,172,0,0,0,0,6,7,8,0,0,76,0,',
				'0,92,0,11,45,15,0,0,6,7,8,0,0,11,44,15,0,76,0,0,0,0,92,0,0,185,186,187,188,0,0,0,0,22,9,24,0,0,76,0,',
				'0,92,0,27,28,31,0,0,22,10,24,0,0,27,28,31,0,76,0,0,0,0,92,0,0,201,202,203,204,0,0,0,0,38,39,40,0,0,76,0,',
				'0,73,0,0,0,0,0,0,38,39,40,0,0,0,0,0,0,75,0,0,0,0,73,0,0,217,218,219,220,0,0,0,0,0,0,0,0,0,75,0,',
				'0,89,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,91,0,0,0,0,89,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,91,0,'
			],
	};
	
	// Background texture
	var data = '';
	var tmpRow = "";
	
	for (i = 0; i < 23; i++){
		tmpRow = this.layers.bg[i].toString();
		data += tmpRow.slice(0, -1) + "\n";
	}
	
	this.game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
	this.menuMapBG = this.game.add.tilemap('dynamicMap', 32, 32);
	this.menuMapBG.addTilesetImage('menu-map', 'menu-map', 32, 32);
	this.menuBG = this.menuMapBG.createLayer(0);
	this.menuBG.resizeWorld();
	this.menuBG.tint = RocketTux.mainMenuColor;
	
	// Foreground items
	data = '';
	tmpRow = "";
	
	for (i = 0; i < 23; i++){
		tmpRow = this.layers.fg[i].toString();
		data += tmpRow.slice(0, -1) + "\n";
	}
	
	this.game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
	this.menuMapFG = this.game.add.tilemap('dynamicMap', 32, 32);
	this.menuMapFG.addTilesetImage('menu-map', 'menu-map', 32, 32);
	this.menuFG = this.menuMapFG.createLayer(0);
	this.menuFG.resizeWorld();
  },
};
