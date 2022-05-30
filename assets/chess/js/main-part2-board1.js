"use strict"

let game1, board1;
let whiteSquareGrey = '#a9a9a9';
let blackSquareGrey = '#696969';

let config1 = {
  position: 'start',
  showNotation: true,
  draggable: true,
  dropOffboard1: 'snapback',
  snapbackSpeed: 200,
  snapSpeed: 50,
  onDrop: onDrop1,
  onSnapEnd: onSnapEnd1,
  onDragStart: onDragStart1,
  onMouseoverSquare: onMouseoverSquare1,
  onMouseoutSquare: onMouseoutSquare1
}

$(document).ready(function(){
  game1 = new Chess();
  board1 = Chessboard('board1',config1);

  $('#resetboard1').on('click', function(){
    board1.start(false); //false means instant snapback
    game1.reset();
    $("#chessStatus1").html('')
    removeRedSquares1();
  })
})

function onDrop1(source, target){
  removeGreySquares1();

  let move = game1.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  if (move == null) return 'snapback'

  removeRedSquares1();
  updateStatus1();

  // make random legal move for black
  window.setTimeout(makeRandomMove1, 250)
}

function onSnapEnd1() {
  // update the board1 position after the piece snap
  // for castling, en passant, pawn promotion
  board1.position(game1.fen())
}


function onDragStart1(source, piece){
  // do not pick up pieces if the game1 is over
  if (game1.game_over()) return false

  // only pick up pieces for the side to move
  if ((game1.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game1.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function updateStatus1(){
  let prevColor = (game1.turn() === 'w') ? "Black" : "White";

  if (game1.in_check()){
    let kingPosition = getKeyByValue1(board1.position(), game1.turn() + 'K')
    redSquare1(kingPosition);
  }

  if (game1.in_checkmate()){
    $("#chessStatus1").html("Checkmate! " + prevColor + " wins.")
  }

  if (game1.in_stalemate()) {
    $("#chessStatus1").html("Draw by stalemate.")
  }

  if (game1.in_threefold_repetition()){
    $("#chessStatus1").html("Draw by threefold repetition.")
  }

  if (game1.insufficient_material()){
    $("#chessStatus1").html("Draw by insufficient material.")
  }
}

function redSquare1(square){
  let $square = $('#board1 .square-' + square)

  $square.addClass('highlight-red-check')
}

function removeRedSquares1(){
  $('#board1 .square-55d63').removeClass('highlight-red-check')
}

function greySquare1(square){
  let $square = $('#board1 .square-' + square)

  let background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function removeGreySquares1(){
  $('#board1 .square-55d63').css('background', '')
}

function onMouseoverSquare1(square, piece){
  removeGreySquares1()

  // get list of possible moves for this square
  let moves = game1.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare1(square)

  // highlight the possible squares for this piece
  for (let i = 0; i < moves.length; i++) {
    greySquare1(moves[i].to)
  }
}

function onMouseoutSquare1(square, piece){
  removeGreySquares1()
}

function makeRandomMove1(){
  let possibleMoves = game1.moves()

  // game over
  if (possibleMoves.length === 0) return

  let randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game1.move(possibleMoves[randomIdx])
  board1.position(game1.fen())
  removeRedSquares1();
  updateStatus1();
}

function getKeyByValue1(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
