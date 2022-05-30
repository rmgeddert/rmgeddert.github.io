---
title: Simple Chess AI (Part 2)
---

<link rel="stylesheet" href="../assets/chess/css/styles.css">
<link rel="stylesheet" href="../assets/chess/css/chessboard-1.0.0.css">
<script src="../assets/chess/js/jquery-3.4.1.js" charset="utf-8"></script>
<script src="../assets/chess/js/chess.js" charset="utf-8"></script>
<script src="../assets/chess/js/chessboard-1.0.0.js" charset="utf-8"></script>
<!-- <script src="../assets/chess/js/chessgame.js" charset="utf-8"></script> -->
<script src="../assets/chess/js/main-part2-board1.js" charset="utf-8"></script>
<script src="../assets/chess/js/main-part2-board2.js" charset="utf-8"></script>

Welcome to part 2 of creating a Chess AI! If you haven't read Part 1 yet (creating a working chess game with JavaScript and HTML), you can do so [here](/simple-chess-ai-part1/). If you are just interested in the chess AI aspect, feel free to start reading here.

<hr>

##### Acknowledgements

*I'd again like to shout out some resources that were particularly helpful and inspiring in making this post. In particular, freeCodeCamp's <a href="https://www.freecodecamp.org/news/simple-chess-ai-step-by-step-1d55a9266977/" target="_blank">step-by-step guide to building a chess AI</a> by Lauri Hartikka was extremely helpful, as was the <a href="https://www.chessprogramming.org/Main_Page" target="_blank">chess programming wiki</a>, an incredible resource of advanced chess algorithms and implementations, although the more advanced features described there will only appear in the next blog post.*

<hr>

<h2 style="color: MidnightBlue">A Random Chess Agent</h2>

To start, lets create a random chess agent. We'll create a new function to our `main.js` file (see [part 1](/simple-chess-ai-part1/) if you need a refresher) called `makeRandomMove`. This function gets all possible legal moves for a given position (via `game.moves()`), then randomly chooses one via `Math.random()`. Once the move is executed, we update the board, remove the red border indicating check if necessary, and finally check whether the game is over via updateStatus. For simplicity's sake, we'll assume that the human player (us) is always white. We'll call `makeRandomMove` after every legal `onDrop` event, after a brief delay.

```javascript
function makeRandomMove(){
  let possibleMoves = game.moves();

  // game over
  if (possibleMoves.length === 0) return

  let randomIdx = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIdx]);
  board.position(game.fen());
  removeRedSquares();
  updateStatus();
}

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

  // make random legal move for black
  window.setTimeout(makeRandomMove, 250);
}
```

And that's it! You can play against the random "AI" below.

<div class="centerer">
  <div id="board1" style="width: 400px"></div>
  <label id="chessStatus1" class="chessStatus"></label>
  <button id="resetBoard1" class="chessReset">Reset</button>
</div>

<br>
<h2 style="color: MidnightBlue">An Agent with Basic Evaluation</h2>

Let's see how we can improve on this design. One obvious way is to choose the move that maximizes the "evaluation" of the subsequent position. How we choose to evaluate a given position will say a lot in terms of which move we choose. We will get into evaluations a lot later, but for now, let's choose the simplest possible evaluation heuristic, by simply counting up the value of the pieces. We will use the following point values:

<div class="centerer">
  <img src="/assets/chess/img/chess_values.png">
  <label style="font-style: italic">From freeCodeCamp's <a href="https://www.freecodecamp.org/news/simple-chess-ai-step-by-step-1d55a9266977/" target="_blank">tutorial</a></label>
</div>

Since chess is a zero sum game, we will calculate the difference in scores between black and white, with negative scores favoring black and positive scores favoring white. The black player will thus choose the move the has the  lowest score (i.e. most black points relative to white points), and white would choose the move with the highest score. To do this, we'll start by writing a simple evaluation function that calculates the score of a given position.

```javascript
let pieceValues = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 900
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
```

Next, we'll write a function `getBestMove`, that loops through all possible moves, evaluates the resulting positions, and then chooses the one that maximizes that score (if white) or minimizes it (if black). A move is always chosen if it results in checkmate, and a position's evaluation is set to 0 if it is a draw. If multiple moves have the same value, then a choice randomly made between them.

```javascript
function getBestMove(){
  let possibleMoves = game.moves()

  if (possibleMoves.length === 0) return

  // initialize best eval and move for current player
  let bestMoves = [];
  let worstPossibleEval;
  if (game.turn() == 'w') {
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
    game.move(newMove);
    if (game.in_checkmate()) {
      newMoveEval = -worstPossibleEval //maximize score
    } else if (game.in_draw()){
      newMoveEval = 0;
    } else {
      newMoveEval = evaluateBoard(game.board());
    }
    game.undo()

    // if same score, add to list of options
    if (newMoveEval == bestEval) {
      bestMoves.push(newMove)
    }

    // if greater (or less) than bestEval, replace bestMoves
    if (game.turn() == 'w' && newMoveEval > bestEval) {
      bestMoves = [newMove]
      bestEval = newMoveEval
    } else if (game.turn() == 'b' && newMoveEval < bestEval) {
      bestMoves = [newMove]
      bestEval = newMoveEval
    }
  }

  // finally, return random choice from among bestMoves
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}
```

Finally, we'll write a function `makeBestMove` to replace `makeRandomMove` in `onDrop`.

```javascript
function makeBestMove(){
  let bestMove = getBestMove()

  if (bestMove == null) return

  game.move(bestMove);
  board.position(game.fen())
  removeRedSquares();
  updateStatus();
}
```

And again that's all we need! You can play the agent below. This agent is still terrible, but at least it will capture pieces when it is able to, and even capture the higher value of two pieces if given the choice. But it has absolutely no strategy otherwise. That is all for this blog post, but in the next one, we will explore using the minimax algorithm with alpha-beta pruning to think more deeply about what a good move is, and also consider some improvements to our admittedly terrible evaluation function.

<div class="centerer">
  <div id="board2" style="width: 400px"></div>
  <label id="chessStatus2" class="chessStatus"></label>
  <button id="resetBoard2" class="chessReset">Reset</button>
</div>
