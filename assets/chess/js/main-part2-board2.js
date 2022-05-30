"use strict"

let game2, board2;
let whiteSquareGrey2 = '#a9a9a9';
let blackSquareGrey2 = '#696969';

let pieceValues = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 900
}

let config2 = {
  position: 'start',
  showNotation: true,
  draggable: true,
  dropOffBoard: 'snapback',
  snapbackSpeed: 200,
  snapSpeed: 50,
  onDrop: onDrop2,
  onSnapEnd: onSnapEnd2,
  onDragStart: onDragStart2,
  onMouseoverSquare: onMouseoverSquare2,
  onMouseoutSquare: onMouseoutSquare2
}

$(document).ready(function(){
  game2 = new Chess();
  board2 = Chessboard('board2',config2);

  $('#resetBoard2').on('click', function(){
    board2.start(false); //false means instant snapback
    game2.reset();
    $("#chessStatus2").html('')
    removeRedSquares2();
  })
})

function onDrop2(source, target){
  removeGreySquares2();

  let move = game2.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  if (move == null) return 'snapback'

  removeRedSquares2();
  updateStatus2();

  // make best legal move for black
  window.setTimeout(makeBestMove2, 250)
}

function onSnapEnd2() {
  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  board2.position(game2.fen())
}


function onDragStart2(source, piece){
  // do not pick up pieces if the game is over
  if (game2.game_over()) return false

  // only pick up pieces for the side to move
  if ((game2.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game2.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function updateStatus2(){
  let prevColor = (game2.turn() === 'w') ? "Black" : "White";

  if (game2.in_check()){
    let kingPosition = getKeyByValue2(board2.position(), game2.turn() + 'K')
    redSquare2(kingPosition);
  }

  if (game2.in_checkmate()){
    $("#chessStatus2").html("Checkmate! " + prevColor + " wins.")
  }

  if (game2.in_stalemate()) {
    $("#chessStatus2").html("Draw by stalemate.")
  }

  if (game2.in_threefold_repetition()){
    $("#chessStatus2").html("Draw by threefold repetition.")
  }

  if (game2.insufficient_material()){
    $("#chessStatus2").html("Draw by insufficient material.")
  }
}

function redSquare2(square){
  let $square = $('#board2 .square-' + square)

  $square.addClass('highlight-red-check')
}

function removeRedSquares2(){
  $('#board2 .square-55d63').removeClass('highlight-red-check')
}

function greySquare2(square){
  let $square = $('#board2 .square-' + square)

  let background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function removeGreySquares2(){
  $('#board2 .square-55d63').css('background', '')
}

function onMouseoverSquare2(square, piece){
  removeGreySquares2()

  // get list of possible moves for this square
  let moves = game2.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare2(square)

  // highlight the possible squares for this piece
  for (let i = 0; i < moves.length; i++) {
    greySquare2(moves[i].to)
  }
}

function onMouseoutSquare2(square, piece){
  removeGreySquares2()
}

function getKeyByValue2(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function evaluateBoard2(board){
  let evaluation = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      evaluation += getPieceValue2(board[i][j])
    }
  }
  return evaluation;
}

function getPieceValue2(piece){
  if (piece == null) {
    return 0;
  }

  if (piece.color == 'w') {
    return pieceValues[piece.type];
  } else {
    return -pieceValues[piece.type];
  }
}

function getBestMove2(){
  let possibleMoves = game2.moves()
  if (possibleMoves.length === 0) return

  // initialize best eval and move for current player
  let bestMoves = [];
  let worstPossibleEval;
  if (game2.turn() == 'w') {
    worstPossibleEval = -9999
  } else {
    worstPossibleEval = 9999
  }
  let bestEval = worstPossibleEval;

  // find move with best evalation for current player
  for (let i = 0; i < possibleMoves.length; i++) {
    let newMove = possibleMoves[i];
    let newMoveEval;

    // get evaluation of game after making move
    game2.move(newMove);
    if (game2.in_checkmate()) {
      newMoveEval = -worstPossibleEval //maximize score
    } else if (game2.in_draw()){
      newMoveEval = 0;
    } else {
      newMoveEval = evaluateBoard2(game2.board());
    }
    game2.undo()

    // if same score, add to list of options
    if (newMoveEval == bestEval) {
      bestMoves.push(newMove)
    }

    // if greater (or less) than bestEval, replace bestMoves
    if (game2.turn() == 'w' && newMoveEval > bestEval) {
      bestMoves = [newMove]
      bestEval = newMoveEval
    } else if (game2.turn() == 'b' && newMoveEval < bestEval) {
      bestMoves = [newMove]
      bestEval = newMoveEval
    }
  }

  // finally, return random choice from among bestMoves
  console.log(bestMoves);
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function makeBestMove2(){
  let bestMove = getBestMove2()

  if (bestMove == null) return

  game2.move(bestMove);
  board2.position(game2.fen())
  removeRedSquares2();
  updateStatus2();
}
