$( document ).ready(function() {

  var gameBoard = [];
  var USER_TOKEN = '<img style="display: none" class="gameToken" src="images/sweet.png" height="50px" width="50px">';
  var BOT_TOKEN = '<img style="display: none" class="gameToken" src="images/tech.png" height="50px" width="50px">';
  const USER = "X";
  const BOT = "O";

  //-----------------------------------------------Initial Setup-----------------------------------------------------------------------------------------
  $(".gameWinner").fadeIn();

  for(var space = 0; space < $(".free").length; space++) {//Initial board setup
    gameBoard[space] = space;
  }

  //-----------------------------------------------Processes User Clicks---------------------------------------------------------------------------------
  $(".characterPickButton").click(function() {
    if ($(this).hasClass("techIcon")) {
      USER_TOKEN = '<img style="display: none" class="gameToken" src="images/tech.png" height="50px" width="50px">';
      BOT_TOKEN = '<img style="display: none" class="gameToken" src="images/sweet.png" height="50px" width="50px">';
      $(".userReset").attr("src","images/tech.png");
      $(".botReset").attr("src","images/sweet.png");
    }
  });

  $(".spot").click(function() {
    if (!winningBoardOrientation(gameBoard, USER) && !winningBoardOrientation(gameBoard, BOT)) {
      var spotIndex = $(".spot").index(this);
      userSelectedSpot(spotIndex);
    }
  });

  $(".resetButton").click(function() {
    if ($(this).hasClass("userReset")) {
      resetGameBoard(USER);
    } else {
      resetGameBoard(BOT);
    }
  });

  $("body").click(function(userClick) {
    if (!$(userClick.target).is(".spot")) {
      if ($(".gameWinner").is(":visible")) {
        resetGameBoard(USER);
      }
      $(".gameWinner").fadeOut();
      $(".gameWinner").empty();
    }
  });

//-------------------------------------------------------Bot Turn --------------------------------------------------------------------------------------
  //Bot places marker using Minimax algorithm
  function botTurn() {
    var spotIndex = minimax(gameBoard, BOT);
    botSelectedSpot(spotIndex.index);
  }

  function minimax(newBoard, player){
    var availableSpots = getEmptyIndexies(newBoard);
    if (winningBoardOrientation(newBoard, USER) || winningBoardOrientation(newBoard, BOT) || availableSpots.length == 0) {
      return scoreForCurrentWinConditions(newBoard, player);
    }
    var potentialMoves = [];
    // Populate moves array with potential moves and scores for each move
    minimaxAvailableSpaces(newBoard, potentialMoves, player);
    return chooseBestMove(player, potentialMoves);
  }


  //-------------------------------------------Helper Functions----------------------------------------------------------------------------------------//

  function userSelectedSpot(spotIndex) {
    var spotIsAvailable = isSpotAvailable(spotIndex);
    if(spotIsAvailable) {
      claimSpotAndCheckForWinner(USER, spotIndex);
      window.setTimeout(botTurn,300);
    }
  }

  function botSelectedSpot(spotIndex) {
    if (getEmptyIndexies(gameBoard).length > 0) {
      claimSpotAndCheckForWinner(BOT, spotIndex);
    }
  }

  function isSpotAvailable(spot) {
    return gameBoard[spot] != USER && gameBoard[spot] != BOT;
  }

  function claimSpotAndCheckForWinner(player, spotNum) {
    gameBoard[spotNum] = player;
    if (player == USER) {
      $(".spot").eq(spotNum).append(USER_TOKEN);
    } else {
      $(".spot").eq(spotNum).append(BOT_TOKEN);
    }
    $(".gameToken").fadeIn();
    checkForWinner(player);
  }

  function checkForWinner(player) {
    if (winningBoardOrientation(gameBoard, player)) {
      displayWinner(player)
    } else if (getEmptyIndexies(gameBoard).length == 0) {
      displayWinner("TIE");
    }
  }

  function getEmptyIndexies(board){
    return  board.filter(s => s != USER && s != BOT);
  }

  function scoreForCurrentWinConditions(newBoard, player) {
    if (winningBoardOrientation(newBoard, USER)){ return {score:-10}; }
  	else if (winningBoardOrientation(newBoard, BOT)){ return {score:10}; }
    else if (getEmptyIndexies(newBoard).length === 0){ return {score:0}; }
  }

  function minimaxAvailableSpaces(newBoard, moves, player) {
    var availableSpots = getEmptyIndexies(newBoard);
    for (var i = 0; i < availableSpots.length; i++){
      //create an object for each and store the index of that spot that was stored as a number in the object's index key
      var move = {};
    	move.index = newBoard[availableSpots[i]];
      // set the empty spot to the current player
      newBoard[availableSpots[i]] = player;
      //if collect the score resulted from calling minimax on the opponent of the current player
      if (player == BOT){
        var result = minimax(newBoard, USER);
        move.score = result.score;
      }
      else{
        var result = minimax(newBoard, BOT);
        move.score = result.score;
      }
      moves.push(move);
      //reset the spot to empty
      newBoard[availableSpots[i]] = move.index;
    }
  }

  function chooseBestMove(player, moves) {
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
    return moves[bestMove];
  }

  // winning combinations using the board indexies for instace the first win could be 3 xes in a row
  function winningBoardOrientation(board, player){
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

  function resetGameBoard (player) {
    for(var space = 0; space < $(".free").length; space++) {
      gameBoard[space] = space;
    }
    $(".gameToken").remove();
    if (player === BOT) {
      botTurn();
    }
  }

  function displayWinner(player) {
    if (player == BOT) {
      $(".gameWinner").append("<h1>Bot</h1><h1>Wins!</h1><h2>Try Again</h2>")
    } else if (player == USER) {
      $(".gameWinner").append("<h1>USER</h1><h1>Wins!</h1>")
    } else {
      $(".gameWinner").append("<h1>Tie!</h1><h1>Try Again</h1>")
    }

    $(".gameWinner").fadeIn();
  }

})
