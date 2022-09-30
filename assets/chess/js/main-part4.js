"use strict"
console.log("hi");
let game, board;
let checkmate_eval = 99999;
let iterationCount = 0;
let timeAllowed = 5; //seconds
let deadline, deadline_reached = false;

let config = {
  position: 'start',
  // position: {
  //   e7: 'wP',
  //   d8: 'bN',
  //   e4: 'wK',
  //   d1: 'bK'
  // },
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
  board = Chessboard('board',config);
  // game = new Chess(board.fen() + ' w - - 0 1');
  game = new Chess();
  game.eval = 0; //initialize board evaluation

  $('#resetBoard').on('click', function(){
    board.start(false); //false means instant snapback
    game.reset();
    game.eval = 0;
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
  game.eval = modifyEval(move, game.eval);
  removeRedSquares();
  updateStatus();

  // make best legal move for black
  if (!game.game_over()) {
    setTimeout(makeMinMaxMove, 250);
  }
}

function makeMinMaxMove(){
  //first check opening book, if opening book, make that move
  if (openingbook[game.fen()]) {
    // if there is more than one option, randomly picks from them
    let move = game.move(openingbook[game.fen()][Math.floor(Math.random() * openingbook[game.fen()].length)]);
    game.eval = modifyEval(move, game.eval);
    console.log('Position Eval After: ' + game.eval);
    board.position(game.fen())
    removeRedSquares();
    updateStatus();
    return
  }

  //otherwise, begin iterative deepening
  let maximizing_player = (game.turn() == 'w');
  let startTime = new Date().getTime()
  deadline_reached = false;
  deadline = startTime + timeAllowed * 1000; //set time deadline

  //iterative deepening with aspiration window
  let best_depth = 1;
  let moves = game.moves();
  let output_move = moves[Math.floor(Math.random()*moves.length)]
  let alpha = -Infinity;
  let beta = +Infinity;
  while(true){

    iterationCount = 0;

    //find best move for given position
    let [bestMove, bestEval] = minimax(game, best_depth, alpha, beta, maximizing_player);

    if (deadline_reached) {
      break
    } else {
      let elapsed_time = new Date().getTime() - startTime;
      if ((bestEval <= alpha) || (bestEval >= beta)) {
        console.log('Failed at depth ' + best_depth + ' in ' + elapsed_time/1000 + ' seconds. Nodes analyzed: ' + iterationCount);
        console.log('Redoing Depth');
        alpha = -Infinity;
        beta = +Infinity;
        continue;
      }

      console.log('Reached depth ' + best_depth + ' in ' + elapsed_time/1000 + ' seconds. Nodes analyzed: ' + iterationCount);

      // adjust alpha and beta for next iteration
      // alpha = bestEval - 200;
      // beta = bestEval + 200;
      output_move = bestMove;
      best_depth++;
    }
  }
  let move = game.move(output_move);
  game.eval = modifyEval(move, game.eval);
  board.position(game.fen())
  removeRedSquares();
  updateStatus();
}

function minimax(position, depth, alpha, beta, maximizing_player){
  iterationCount++;

  // if timelimit reached, stop
  if (time_left() < 5) {
    deadline_reached = true;
    return [null, null];
  }

  // if terminal state (game over) or max depth (depth == 0)
  if (position.in_checkmate() || position.in_draw() || depth == 0){
    return [null, evaluatePosition(position)];
  }

  // move ordering
  let possibleMoves = position.moves();
  let moveScores = scoreMoves(possibleMoves);
  let bestMove;
  let baseEval = position.eval;
  if (maximizing_player) {
    // find move with best possible score
    let maxEval = -Infinity;
    for (let i = 0; i < possibleMoves.length; i++) {

      [possibleMoves, moveScores] = moveSorter(i, possibleMoves, moveScores)

      // do move, see how eval changes with move
      let move = position.move(possibleMoves[i]);
      position.eval = modifyEval(move, position.eval);

      // continue down minimax algorithm
      let [childBestMove, childEval] = minimax(position, depth - 1, alpha, beta, false)

      // keep track of max eval found so far
      if (childEval > maxEval) {
        maxEval = childEval;
        bestMove = possibleMoves[i]
      }

      //undo move, reset eval
      position.undo()
      position.eval = baseEval;

      // alpha beta pruning
      alpha = Math.max(alpha, childEval)
      if (beta <= alpha) {
        break;
      }

      if (deadline_reached){
        return [null, null];
      }
    }
    return [bestMove, maxEval];

  } else {
    // find move with worst possible score (for maximizer)
    let minEval = +Infinity;
    for (let i = 0; i < possibleMoves.length; i++) {

      [possibleMoves, moveScores] = moveSorter(i, possibleMoves, moveScores)

      // reset eval, see how eval changes with move
      let move = position.move(possibleMoves[i]);
      position.eval = modifyEval(move, position.eval);

      // continue down minimax algorithm
      let [childBestMove, childEval] = minimax(position, depth - 1, alpha, beta, true)

      // keep track of min eval found so far
      if (childEval < minEval) {
        minEval = childEval;
        bestMove = possibleMoves[i]
      }

      // undo move, undo eval change
      position.undo()
      position.eval = baseEval;

      // alpha beta pruning
      beta = Math.min(beta, childEval)
      if (beta <= alpha) {
        break;
      }

      if (deadline_reached){
        return [null, null];
      }
    }
    return [bestMove, minEval];
  }

}

function time_left(){
  return deadline - new Date().getTime();
}

function testMinimax(depth){
  let maximizing_player = (game.turn() == 'w')
  iterationCount = 0;
  let startTime = new Date().getTime()
  let [bestMove, bestEval] = minimax(game, depth, -Infinity, +Infinity, maximizing_player);
  let time = (new Date().getTime() - startTime)/1000
  console.log('Time to complete ' + iterationCount + ' iterations: ' + time + 's');
}

function speedTest(){
  let startTime = new Date().getTime();
  let iteration = 0;
  while (new Date().getTime() - startTime < 10000) {
    iteration++;
    let possibleMoves = game.moves();
  }
  console.log(iteration + ' iterations in 10 seconds.');
  return iteration;

  // function recursive(depth){
  //   iteration++;
  //
  //   if (new Date().getTime() - startTime > 10000) {
  //     return null;
  //   }
  //
  //   if (depth == 0) {
  //     return null;
  //   }
  //
  //   let moves = game.moves()
  //   for (var i = 0; i < moves.length; i++) {
  //     recursive(depth - 1);
  //
  //     if (new Date().getTime() - startTime > 10000) {
  //       break;
  //     }
  //   }
  // }
}
