$( document ).ready(function() {

  var gameBoard = [];
  var origBoard = ["O",1 ,"X","X",4 ,"X", 6 ,"O","O"];
  var winner = false;
  var bestMoveFunctionCount = 0;
  const USER_TOKEN = '<img class="gameToken" src="images/sweet.png" height="50px" width="50px">';
  const BOT_TOKEN = '<img class="gameToken" src="images/tech.png" height="50px" width="50px">';
  const USER = "X";
  const BOT = "O";

  for(var space = 0; space < $(".free").length; space++) {
    gameBoard[space] = space;
  }

  //Processes User Clicks
  $(".spot").click(function() {
    if (!winningBoardOrientation(USER) && !winningBoardOrientation(BOT)) {
      var spotIndex = $(".spot").index(this);
      userSelectedSpot(spotIndex);
    }
  });

  //Bot randomly places marker
  function botTurn() {
    var spotIndex = minimax(gameBoard, BOT);
    console.log(gameBoard);
    botSelectedSpot(spotIndex.index);
    //var items = shuffle($(".free")).slice(0, 1);
    //$(items).css("background-color", "yellow");
    //$(items).removeClass(".free");
    //console.log()
  }

  //-------------------------------------------Helper Functions----------------------------------------------------------------------------------------//

  function userSelectedSpot(spotIndex) {
    var spotIsAvailable = isSpotAvailable(spotIndex);
    if(spotIsAvailable) {
      claimSpotAndCheckForWinner(USER, spotIndex);
      window.setTimeout(botTurn,1000);
    }
  }

  function botSelectedSpot(spotIndex) {
    var spotIsAvailable = isSpotAvailable(spotIndex);
    if(spotIsAvailable) {
      claimSpotAndCheckForWinner(BOT, spotIndex);
    }
  }

  function isSpotAvailable(spot) {
    return gameBoard[spot] != USER && gameBoard[spot] != BOT;
  }

  function claimSpotAndCheckForWinner(player, spotNum) {
    gameBoard[spotNum] = player;
    if (player == USER) {
      $(".spot").eq(spotNum).html(USER_TOKEN);
    } else {
      $(".spot").eq(spotNum).html(BOT_TOKEN);
    }
    checkForWinner(player);
  }

  function checkForWinner(player) {
    if (winningBoardOrientation(player)) {
      alert(player + " Wins!");
    }
  }

  function winningBoardOrientation(player) {
    return (
        (gameBoard[0] == player && gameBoard[1] == player && gameBoard[2] == player) ||
        (gameBoard[3] == player && gameBoard[4] == player && gameBoard[5] == player) ||
        (gameBoard[6] == player && gameBoard[7] == player && gameBoard[8] == player) ||
        (gameBoard[0] == player && gameBoard[3] == player && gameBoard[6] == player) ||
        (gameBoard[1] == player && gameBoard[4] == player && gameBoard[7] == player) ||
        (gameBoard[2] == player && gameBoard[5] == player && gameBoard[8] == player) ||
        (gameBoard[0] == player && gameBoard[4] == player && gameBoard[8] == player) ||
        (gameBoard[2] == player && gameBoard[4] == player && gameBoard[6] == player)
      );
  }

  // the main minimax function
  function minimax(newBoard, player){

    //available spots
    var availSpots = emptyIndexies(newBoard);

    // checks for the terminal states such as win, lose, and tie and returning a value accordingly
    if (winning(newBoard, USER)){
       return {score:-10};
    }
  	else if (winning(newBoard, BOT)){
      return {score:10};
  	}
    else if (availSpots.length === 0){
    	return {score:0};
    }

  // an array to collect all the objects
    var moves = [];

    // loop through available spots
    for (var i = 0; i < availSpots.length; i++){
      //create an object for each and store the index of that spot that was stored as a number in the object's index key
      var move = {};
    	move.index = newBoard[availSpots[i]];

      // set the empty spot to the current player
      newBoard[availSpots[i]] = player;

      //if collect the score resulted from calling minimax on the opponent of the current player
      if (player == BOT){
        var result = minimax(newBoard, USER);
        move.score = result.score;
      }
      else{
        var result = minimax(newBoard, BOT);
        move.score = result.score;
      }

      //reset the spot to empty
      newBoard[availSpots[i]] = move.index;

      // push the object to the array
      moves.push(move);
    }

  // if it is the computer's turn loop over the moves and choose the move with the highest score
    var bestMove;
    if(player === BOT){
      var bestScore = -10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }else{

  // else loop over the moves and choose the move with the lowest score
      var bestScore = 10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

  // return the chosen move (object) from the array to the higher depth
    return moves[bestMove];
  }

  // returns the available spots on the board
  function emptyIndexies(board){
    return  board.filter(s => s != "X" && s != "O");
  }

  // winning combinations using the board indexies for instace the first win could be 3 xes in a row
  function winning(board, player){
   if (
          (board[0] == player && board[1] == player && board[2] == player) ||
          (board[3] == player && board[4] == player && board[5] == player) ||
          (board[6] == player && board[7] == player && board[8] == player) ||
          (board[0] == player && board[3] == player && board[6] == player) ||
          (board[1] == player && board[4] == player && board[7] == player) ||
          (board[2] == player && board[5] == player && board[8] == player) ||
          (board[0] == player && board[4] == player && board[8] == player) ||
          (board[2] == player && board[4] == player && board[6] == player)
          ) {
          return true;
      } else {
          return false;
      }
  }

})
