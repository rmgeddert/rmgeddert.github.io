"use strict"

let game, board;
let whiteSquareGrey = '#a9a9a9';
let blackSquareGrey = '#696969';
let checkmate_eval = 99999;

let pieceValues = {
  p: 100,
  n: 330,
  b: 350,
  r: 510,
  q: 900,
  k: 9000
}

let config = {
  position: 'start',
  showNotation: true,
  draggable: true,
  dropOffBoard: 'snapback',
  snapbackSpeed: 200,
  snapSpeed: 25,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onDragStart: onDragStart,
  onMouseoverSquare: onMouseoverSquare,
  onMouseoutSquare: onMouseoutSquare
}

$(document).ready(function(){
  game = new Chess();
  board = Chessboard('board',config);

  $('#resetBoard').on('click', function(){
    board.start(false); //false means instant snapback
    game.reset();
    $("#chessStatus").html('')
    removeRedSquares();
  })
})

function onDrop(source, target){
  removeGreySquares();

  let move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  if (move == null) return 'snapback'

  removeRedSquares();
  updateStatus();

  // make best legal move for black
  setTimeout(makeMinMaxMove, 250);
}

function onSnapEnd() {
  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  board.position(game.fen())

}

function onDragStart(source, piece){
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function updateStatus(){
  let prevColor = (game.turn() === 'w') ? "Black" : "White";

  if (game.in_check()){
    let kingPosition = getKeyByValue(board.position(), game.turn() + 'K')
    redSquare(kingPosition);
  }

  if (game.in_checkmate()){
    $("#chessStatus").html("Checkmate! " + prevColor + " wins.")
  }

  if (game.in_stalemate()) {
    $("#chessStatus").html("Draw by stalemate.")
  }

  if (game.in_threefold_repetition()){
    $("#chessStatus").html("Draw by threefold repetition.")
  }

  if (game.insufficient_material()){
    $("#chessStatus").html("Draw by insufficient material.")
  }
}

function redSquare(square){
  let $square = $('#board .square-' + square)

  $square.addClass('highlight-red-check')
}

function removeRedSquares(){
  $('#board .square-55d63').removeClass('highlight-red-check')
}

function greySquare(square){
  let $square = $('#board .square-' + square)

  let background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function removeGreySquares(){
  $('#board .square-55d63').css('background', '')
}

function onMouseoverSquare(square, piece){
  removeGreySquares()

  // get list of possible moves for this square
  let moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (let i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare(square, piece){
  removeGreySquares()
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function evaluateBoard(board){
  let evaluation = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      evaluation += getPieceValue(board[i][j])
    }
  }
  return evaluation;
}

function evaluatePosition(position){
  if (position.in_checkmate()){
    return (position.turn() == 'w') ? -checkmate_eval : checkmate_eval;
  } else if (position.in_draw()){
    return 0;
  } else {
    return evaluateBoard(position.board());
  }
}

function getPieceValue(piece){
  if (piece == null) {
    return 0;
  }

  if (piece.color == 'w') {
    return pieceValues[piece.type];
  } else {
    return -pieceValues[piece.type];
  }
}

function makeMinMaxMove(){
  let maximizing_player = (game.turn() == 'w')
  let [bestMove, bestEval] = minimax(game, 3, -Infinity, +Infinity, maximizing_player);
  game.move(bestMove);
  board.position(game.fen())
  removeRedSquares();
  updateStatus();
}

function minimax(position, depth, alpha, beta, maximizing_player){
  // if terminal state (game over) or max depth (depth == 0)
  if (position.in_checkmate() || position.in_draw() || depth == 0){
    return [null, evaluatePosition(position)];
  }

  let bestMove;
  if (maximizing_player) {
    // find move with best possible score
    let maxEval = -Infinity;
    let possibleMoves = position.moves();
    for (let i = 0; i < possibleMoves.length; i++) {

      position.move(possibleMoves[i])
      let [childBestMove, childEval] = minimax(position, depth - 1, alpha, beta, false)
      if (childEval > maxEval) {
        maxEval = childEval;
        bestMove = possibleMoves[i]
      }
      position.undo()

      // alpha beta pruning
      alpha = Math.max(alpha, childEval)
      if (beta <= alpha) {
        break;
      }
    }
    return [bestMove, maxEval];

  } else {
    // find move with worst possible score (for maximizer)
    let minEval = +Infinity;
    let possibleMoves = shuffle(position.moves());
    for (let i = 0; i < possibleMoves.length; i++) {

      position.move(possibleMoves[i])
      let [childBestMove, childEval] = minimax(position, depth - 1, alpha, beta, true)
      if (childEval < minEval) {
        minEval = childEval;
        bestMove = possibleMoves[i]
      }
      position.undo()

      // alpha beta pruning
      beta = Math.min(beta, childEval)
      if (beta <= alpha) {
        break;
      }
    }
    return [bestMove, minEval];
  }

}

// Fisher-Yates shuffle
function shuffle(array){
  for(let j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
  return array;
}
