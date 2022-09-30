let whiteSquareGrey = '#a9a9a9';
let blackSquareGrey = '#696969';

function onMouseoutSquare(square, piece){
  removeGreySquares()
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
