"use strict"
let chessgame1, chessgame2;
$(document).ready(function(){
  chessgame1 = new ChessGame('board1','random','chessStatus1','resetboard1');
  chessgame2 = new ChessGame('board2','bestAction', 'chessStatus2','resetboard2');
})
