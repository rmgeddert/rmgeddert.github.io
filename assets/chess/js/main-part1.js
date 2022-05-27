"use strict"

let game1, game2, game3, board1, board2, board3;
let whiteSquareGrey = '#a9a9a9';
let blackSquareGrey = '#696969';

let config1 = {
  position: 'start',
  showNotation: true,
  draggable: true,
  dropOffBoard: 'snapback',
  snapbackSpeed: 200,
  snapSpeed: 50
}

let config2 = {
  position: 'start',
  showNotation: true,
  draggable: true,
  dropOffBoard: 'snapback',
  snapbackSpeed: 200,
  snapSpeed: 50,
  onDrop: onDrop1,
  onSnapEnd: onSnapEnd
}

let config3 = {
  position: 'start',
  showNotation: true,
  draggable: true,
  dropOffBoard: 'snapback',
  snapbackSpeed: 200,
  snapSpeed: 50,
  onDrop: onDrop2,
  onSnapEnd: onSnapEnd,
  onDragStart: onDragStart,
  onMouseoverSquare: onMouseoverSquare,
  onMouseoutSquare: onMouseoutSquare
}

$(document).ready(function(){
  game1 = new Chess();
  game2 = new Chess();
  game3 = new Chess();
  board1 = Chessboard('board1',config1);
  board2 = Chessboard('board2',config2);
  board3 = Chessboard('board3',config3);

  $('#resetBoard1').on('click', function(){
    board1.start(false); //false means instant snapback
  })

  $('#resetBoard2').on('click', function(){
    board2.start(false); //false means instant snapback
    game2.reset();
  })

  $('#resetBoard3').on('click', function(){
    board3.start(false); //false means instant snapback
    game3.reset();
    $("#chessStatus").html('')
    removeRedSquares()
  })
})

function onDrop1(source, target){
  let move = game2.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  if (move == null) return 'snapback'
}

function onDrop2(source, target){
  removeGreySquares()

  let move = game3.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  if (move == null) return 'snapback'

  removeRedSquares();
  updateStatus();
}

function onSnapEnd() {
  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  board2.position(game2.fen())
}

function onDragStart(source, piece){
  // do not pick up pieces if the game is over
  if (game3.game_over()) return false

  // only pick up pieces for the side to move
  if ((game3.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game3.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function updateStatus(){
  let prevColor = (game3.turn() === 'w') ? "Black" : "White";

  if (game3.in_check()){
    let kingPosition = getKeyByValue(board3.position(), game3.turn() + 'K')
    redSquare(kingPosition);
  }

  if (game3.in_checkmate()){
    $("#chessStatus").html("Checkmate! " + prevColor + " wins.")
  }

  if (game3.in_stalemate()) {
    $("#chessStatus").html("Draw by stalemate.")
  }

  if (game3.in_threefold_repetition()){
    $("#chessStatus").html("Draw by threefold repetition.")
  }

  if (game3.insufficient_material()){
    $("#chessStatus").html("Draw by insufficient material.")
  }
}

function greySquare(square) {
  let $square = $('#board3 .square-' + square)

  let background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function removeGreySquares(){
  $('#board3 .square-55d63').css('background', '')
}

function onMouseoverSquare(square, piece){
  removeGreySquares()

  // get list of possible moves for this square
  let moves = game3.moves({
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

function redSquare(square){
  let $square = $('#board3 .square-' + square)

  $square.addClass('highlight-red-check')
}

function removeRedSquares(){
  $('#board3 .square-55d63').removeClass('highlight-red-check')
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
