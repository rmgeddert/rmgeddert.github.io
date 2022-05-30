"use strict"

class ChessGame {
  constructor(boardID, action = 'random', labelID  = null, resetID = null, cfg = null){
    console.log('constructing');

    this.test = 'testing'
    this.config = {
      position: (!cfg) ? 'start' : (('position' in cfg) ? cfg.position : 'start'),
      showNotation: (!cfg) ? true : (('showNotation' in cfg) ? cfg.showNotation : true),
      draggable: (!cfg) ? true : (('draggable' in cfg) ? cfg.draggable : true),
      dropOffboard: (!cfg) ? 'snapback' : (('dropOffboard' in cfg) ? cfg.dropOffboard : 'snapback'),
      snapbackSpeed: (!cfg) ? 200 : (('snapbackSpeed' in cfg) ? cfg.snapbackSpeed : 200),
      snapSpeed: (!cfg) ? 50 : (('snapSpeed' in cfg) ? cfg.snapSpeed : 50),
      onDrop: this.onDrop,
      onSnapEnd: this.onSnapEnd,
      onDragStart: this.onDragStart,
      onMouseoverSquare: this.mouseOver,
      onMouseoutSquare: this.mouseOut
    }

    this.boardID = boardID;

    this.board = Chessboard(boardID,this.config);

    this.game = new Chess();
    this.whiteSquareGrey = '#a9a9a9';
    this.blackSquareGrey = '#696969';
    this.statusLabel = labelID;
    if (action == 'random') {
      this.mover = this.makeRandomMove
    } else if (action == 'bestAction') {
      this.mover = this.makeBestMove
    } else {
      this.mover = this.makeRandomMove
    }
    this.pieceValues = {
      p: 10,
      n: 30,
      b: 30,
      r: 50,
      q: 90,
      k: 900
    }

    if (resetID) {
      $('#'+resetID).on('click', function(){
        this.board.start(false); //false means instant snapback
        this.game.reset();
        if (this.statusLabel) {
          $('#'+this.statusLabel).html('')
        }
        this.removeRedSquares();
      })
    }


  }

  onDrop(source, target){
    removeGreySquares(this.boardID);

    let move = this.game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    if (move == null) return 'snapback'

    this.removeRedSquares();
    this.updateStatus();

    // make random legal move for black
    window.setTimeout(this.mover, 250)
  }

  onSnapEnd(){
    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    this.board.position(this.game.fen())
  }

  onDragStart(source, piece){
    // do not pick up pieces if the game is over
    if (this.game.game_over()) return false

    // only pick up pieces for the side to move
    if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }

  updateStatus(){
    let prevColor = (this.game.turn() === 'w') ? "Black" : "White";

    if (this.game.in_check()){
      let kingPosition = getKeyByValue1(this.board.position(), this.game.turn() + 'K')
      this.redSquare(kingPosition);
    }

    if (this.game.in_checkmate()){
      $('#'+this.statusLabel).html("Checkmate! " + prevColor + " wins.")
    }

    if (this.game.in_stalemate()) {
      $('#'+this.statusLabel).html("Draw by stalemate.")
    }

    if (this.game.in_threefold_repetition()){
      $('#'+this.statusLabel).html("Draw by threefold repetition.")
    }

    if (this.game.insufficient_material()){
      $('#'+this.statusLabel).html("Draw by insufficient material.")
    }
  }

  redSquare(square){
    let $square = $('#' + this.boardID + ' .square-' + square)

    $square.addClass('highlight-red-check')
  }

  removeRedSquares(){
    $('#' + this.boardID + ' .square-55d63').removeClass('highlight-red-check')
  }

  greySquare(square){
    let $square = $('#' + this.boardID + ' .square-' + square)

    let background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
      background = blackSquareGrey
    }

    $square.css('background', background)
  }

  mouseOver(square, piece){
    removeGreySquares(this.boardID);

    // get list of possible moves for this square
    let moves = this.game.moves({
      square: square,
      verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    this.greySquare(square)

    // highlight the possible squares for this piece
    for (let i = 0; i < moves.length; i++) {
      this.greySquare(moves[i].to)
    }
  }

  mouseOut(square, piece){
    removeGreySquares(this.boardID);
  }

  makeRandomMove(){
    let possibleMoves = this.game.moves()

    // game1 over
    if (possibleMoves.length === 0) return

    let randomIdx = Math.floor(Math.random() * possibleMoves.length)
    this.game.move(possibleMoves[randomIdx])
    this.board.position(this.game.fen())
    this.removeRedSquares();
    this.updateStatus();
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  evaluateBoard(board){
    let evaluation = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        evaluation += this.getPieceValue(board[i][j])
      }
    }
    return evaluation;
  }

  getPieceValue(piece){
    if (piece == null) {
      return 0;
    }

    if (piece.color == 'w') {
      return this.pieceValues[piece.type];
    } else {
      return -this.pieceValues[piece.type];
    }
  }

  getBestMove(){
    let possibleMoves = this.game.moves()

    // initialize best eval and move for current player
    let bestMove = null;
    let bestEval;
    if (this.game.turn() == 'w') {
      bestEval = -9999
    } else {
      bestEval = 9999
    }

    // find move with best evalation for current player
    for (let i = 0; i < possibleMoves.length; i++) {
      let newMove = possibleMoves[i]
      this.game.move(newMove);
      let newMoveEval = this.evaluateBoard(this.game.board());
      this.game.undo()

      if (this.game.turn() == 'w' && newMoveEval > bestEval) {
        bestMove = newMove
        bestEval = newMoveEval
      } else if (this.game.turn() == 'b' && newMoveEval < bestEval) {
        bestMove = newMove
        bestEval = newMoveEval
      }
    }

    return bestMove;
  }

  makeBestMove(){
    let bestMove = this.getBestMove()

    if (bestMove == null) return

    this.game.move(bestMove);
    this.board.position(this.game.fen())
    this.removeRedSquares();
    this.updateStatus();
  }
}

function removeGreySquares(boardID){
  $('#' + boardID + ' .square-55d63').css('background', '')
}
