/*
	Purpose: Decide what locations to request
	Given: game and board are initialized
	
	endGame				- called when gameOver is reached
	loadGame			- intializes the game and board
	makeMove	 		- requests (x,y) records the result in board, and returns the obj
	isHit				- requests (x,y) and returns true if it is a hit
	exploreNeighbors	- checks all four directions, and attempts to sink a ship.
	startGame			- starts the process, and iterates through cells.
	
*/

var game;
var ships;
var board;
var moves = 0;

// Stop execution, and display a message
function endGame(){	
	writeToConsole("Total moves = " + moves + " out of " + (game.board_size.width)*(game.board_size.height));
	throw new Error('This is not an error.');
}

// Load the game, and create the board.
function loadGame(){
	game = getJSON("http://navy.hulu.com/create?user=rhassan@andrew.cmu.edu");
	board = [];
	
	// Display game information
	writeToConsole("GAME ID = " + game.game_id);
	writeToConsole("SHIPS = [" + game.ship_sizes + "]");
	writeToConsole("BOARD = (" + game.board_size.width + ", " + game.board_size.height + ")");
	
	// Intialize board to default values
	for(var w=0; w<game.board_size.width; w++){
		board[w] = [];
		for(var h=0; h<game.board_size.height; h++){
			board[w][h]=0;		// signifies uninspected
		}
	}
	
	ships = game.ship_sizes;
	
	raiseSuccess("Game intialized");
}

function makeMove(x,y){
	//writeToConsole("Requesting (" + x +"," + y+")");
	
	// Basic checks
	if (game==null){		raiseError("Game not initialized"); return null;}
	if (board==null){		raiseError("Board not initialized"); return null;}
	if (x<0 || x>=game.board_size.width || y<0 || y>=game.board_size.height){
		//raiseError("Coordinates out of bounds");
		return;
	}
	if (board[x][y]!=0){ 
		//raiseError("Returning redundant object (" + x + "," + y + ")");
		return board[x][y];
	}
	
	// Make request
	var hitRequest = getJSON("http://navy.hulu.com/move?game_id=" + game.game_id + "&x=" + x + "&y=" + y);
	board[x][y] = hitRequest;
	moves++;
	
	// Process request
	if(hitRequest.hit){
		document.getElementById(y+'_'+x).setAttribute('class','hit');
		//document.getElementById(y+'_'+x).innerHTML = moves;
	}
	
	if (hitRequest.sunk != -1){
		writeToConsole("Sunk boat of size " + hitRequest.sunk);
		
		// Remove the sunken ship from our ship_sizes array
			var index = 0;
			var found = false;
			while (found==false && index< ships.length){
				if(ships[index]==hitRequest.sunk){
					found = true;
					index--;
				}
				index++;
			}
			if (found==true){
				ships[index] = 0;
			}
			//writeToConsole("Remaining ships = " + ships);
	}
	if (hitRequest.gameover == true){
		raiseSuccess("GAME OVER!");
		endGame();
	}
	
	return board[x][y];	
}


// Check if (x,y) is a hit.
function isHit(x,y){
	var move = makeMove(x,y);
	if (move!=null){
		if (move.hit){
			document.getElementById(y+'_'+x).setAttribute('class','hit');
			//document.getElementById(y+'_'+x).innerHTML = moves;
		}else{
			document.getElementById(y+'_'+x).setAttribute('class','miss');
			//document.getElementById(y+'_'+x).innerHTML = moves;
		}
		return move.hit;
	}
	return false;
}

/*
	Given that a particular cell is a hit,
	try to find all blocks of the ship.
*/
function exploreNeighbors(x,y){
	function labelEmpty(x,y){
		if (x>=0 && x<game.board_size.width && y>=0 && y<game.board_size.height){
			document.getElementById(y+'_'+x).setAttribute('class','avoid');
			board[x][y] = null;		// Indicate that cell should never be examined
		}
	}
	function pursueShip(x,y, xp, yp){
		
		ships.sort();
		var maxSize = ships[ships.length -1];
		var length = 0;
		
		while (length<=maxSize && isHit(x + xp*length, y + yp*length)){
			// Label cells on either side as empty
			labelEmpty(x + xp*length + yp,y + yp*length + xp);
			labelEmpty(x + xp*length - yp,y + yp*length - xp);
			
			length++;
		}
		
		length = 1;
		xp = -xp;
		yp = -yp;
		while (length<=maxSize && isHit(x + xp*length, y + yp*length)){
			// Label cells on either side as empty
			labelEmpty(x + xp*length + yp,y + yp*length + xp);
			labelEmpty(x + xp*length - yp,y + yp*length - xp);
			
			length++;
		}
	}
	
	// Pick a direction
	if (isHit(x+1,y)){
		labelEmpty(x,y+1);
		labelEmpty(x,y-1);
		pursueShip(x,y,1,0); 
	}
	else if (isHit(x-1,y)){
		labelEmpty(x,y+1);
		labelEmpty(x,y-1);
		pursueShip(x,y,-1,0);
	}
	else if (isHit(x,y+1)){
		labelEmpty(x+1,y);
		labelEmpty(x-1,y);
		pursueShip(x,y,0,1);
	}
	else if (isHit(x,y-1)){
		labelEmpty(x+1,y);
		labelEmpty(x-1,y);
		pursueShip(x,y,0,-1);
	}
}



/*
	Purpose: Starts searching through the grid.
	
	Starts by trying to find the largest ship
	by skipping to every n-th blocks.
	
*/
function startGame(){
	var j = 5;		//	value by which to skip.  
	while (j>0){
		var max = 0;
		for(var m =0; m<ships.length; m++){
			if (ships[m]>max){ max = ships[m];}
		}
		if (j>max){	j = max; }
		writeToConsole(ships);
		writeToConsole("Trying spacing by " + j);
		for (var i=0; i<=j; i++){
			for(var x=0; x< Math.floor(game.board_size.width/j); x++){
				for(var y=0; y< Math.floor(game.board_size.height/j); y++){
		 			if (isHit(j*x + i,j*y + i)){
						exploreNeighbors(j*x + i,j*y + i);
					}
				}
			}
		}
		j--;
		
	}
	
	raiseError('Unable to confirm Game Over');
	endGame()
	
}