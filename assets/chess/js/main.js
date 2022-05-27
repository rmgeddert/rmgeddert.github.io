"use strict"

let game, board;
let config = {
  position: 'start',//{d6: 'bK'},//'start',
  showNotation: true,
  draggable: true,
  dropOffBoard: 'snapback',
  snapbackSpeed: 200,
  snapSpeed: 50,
  d6: 'bK'
}
$(document).ready(function(){
  game = new Chess();
  board = Chessboard('chessboard',config);
})
