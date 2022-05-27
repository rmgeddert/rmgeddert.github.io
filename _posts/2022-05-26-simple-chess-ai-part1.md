---
title: Simple Chess AI (Part 1)
---

<link rel="stylesheet" href="../assets/chess/css/styles.css">
<link rel="stylesheet" href="../assets/chess/css/chessboard-1.0.0.css">
<script src="../assets/chess/js/jquery-3.4.1.js" charset="utf-8"></script>
<script src="../assets/chess/js/chess.js" charset="utf-8"></script>
<script src="../assets/chess/js/chessboard-1.0.0.js" charset="utf-8"></script>
<script src="../assets/chess/js/main-part1.js" charset="utf-8"></script>

My first exposure to deep reinforcement learning (a particular fascination of mine) was when Google DeepMind's AlphaZero systematically dismantled StockFish in a 100 game match back in 2017. As an avid chess enthusiast myself, I frequented chess.com's forums somewhat frequently, and to say that AlphaZero took the chess world by storm would be an understatement.

Now, years later, it is my goal to create my own deep RL chess agent in the style of AlphaZero, albeit to the extent possible on just my Mac. First, however, I think it would be prudent to create a more traditional chess engine, both as a means of learning about chess algorithms but also a means of comparison later. This blog series will do just that. Let's jump right in!

<hr>

##### Acknowledgements

*This first blog post was inspired by and massively informed by a few amazing online resources. Zhang Zeyu's <a href="https://javascript.plainenglish.io/build-a-simple-chess-ai-in-javascript-22b350abb31" target="_blank">simple chess AI</a> was a huge inspiration, and none of this would be possible without the brilliant <a href="https://github.com/jhlywa/chess.js/blob/master/README.md" target="_blank">chess.js</a> and <a href="https://chessboardjs.com/" target="_blank">chessboard.js</a> packages.*

<hr>

<h2 style="color: MidnightBlue">An HTML Chess Board</h2>

First thing's first, we need a chess board! We will be writing this using HTML and JavaScript for the most seemless integration into the backend code for this website.

We'll start with a simple html document, linking the `chessboard.css` and `chessboard.js` files found on <a href="https://chessboardjs.com/" target="_blank">chessboard.js</a>, and the `chess.js` file found on <a href="https://github.com/jhlywa/chess.js/blob/master/README.md" target="_blank">chess.js</a>. We'll include `jquery.js` for good measure, and we'll write our actual engine/game code in `main.js`. We'll add a reset button as well.

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="../assets/chess/css/chessboard-1.0.0.css">
    <script src="../assets/chess/js/jquery-3.4.1.js" charset="utf-8"></script>
    <script src="../assets/chess/js/chess.js" charset="utf-8"></script>
    <script src="../assets/chess/js/chessboard-1.0.0.js" charset="utf-8"></script>
    <script src="../assets/chess/js/main.js" charset="utf-8"></script>
  </head>
  <body>
    <div id="chessboard" style="width: 400px"></div>
    <button id="resetButton">Reset</button>
  </body>
</html>
```

Next, a quick trip to the chessboard.js <a href="https://chessboardjs.com/examples#1000" target="_blank">documentation</a> (*Basic Usage* and *Config*) gives us the necessary code to get a simple chess board working.

#### main.js
```javascript
let board;

let config = {
  position: 'start',
  showNotation: true,
  draggable: true,
  dropOffBoard: 'snapback',
  snapbackSpeed: 200,
  snapSpeed: 50
}

$(document).ready(function(){
  board = Chessboard('chessboard',config);

  $('#resetButton').on('click', function(){
    board.start(false); //false means instant snapback
  })
})
```

Very briefly, config takes a variety of arguments, including the initial position (we'll just use `'start'` to initialize to the starting position), whether the board should include the alphanumeric notation (A-H, 1-8) whether the pieces are draggable, what happens when pieces are dragged off of the board (they can also be removed instead of snapping back), and the speed with which they snap back.

And that's it! Below we have our working chess board. Chess pieces can be moved, captured, even magically teleported across the board. Not quite the working chess game we are going for, but as far as a working chessboard it is excellent.

<div class="centerer">
  <div id="board1" style="width: 400px"></div>
  <button id="resetBoard1" class="chessReset">Reset</button>
</div>

<br>
<h2 style="color: MidnightBlue">A Working JavaScript Chess Game</h2>

Next, let's add the rules and requirements to make this a working chess game, with checks, checkmates, turns, en passant, etc. We won't be doing this from scratch, but rather relying on some more `chessboard.js` methods along with
the super helpful `chess.js` package referenced above.

To start, we'll add a few lines to our config, namely a function that gets called every time a piece is dropped into a new square, via `onDrop`, and a function that gets called after the dropping gets resolved, via `onSnapEnd`.

```javascript
let board, game;

let config = {
  ...
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}

$(document).ready(function(){
  game = new Chess();
  board = Chessboard('chessboard',config);

  $('#resetButton').on('click', function(){
    board.start(false); //false means instant snapback
    game.reset();
  })
})

function onDrop(source, target){
  let move = game.move({
    from: source,
    to: target,
    promotion: 'q' // always promote to a queen for example simplicity
  })

  if (move == null) return 'snapback'
}

function onSnapEnd () {
  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  board.position(game.fen())
}
```
**onDrop**: The inputs for the onDrop method are the start square, end square, the involved piece, and some other attributes (see <a href="https://chessboardjs.com/examples#4004" target="_none">example</a>). For our purposes we just need the source and target squares. We call the chess.js `.move` method with these two squares as inputs, and this function checks whether the piece currently in the source location (within memory) is legally allowed to move to the target square. `.move` returns the move object if legal, and null otherwise. So, if move is null we snap the piece back to its original location.

**onSnapEnd**: In the case of castling, en passant, and promotion, the board needs to be updated beyond the piece that was moved. For example, in the case of castling, the rook needs to also be moved even though only the King is dragged by the player. `onSnapEnd` occurs once a piece is moved successfully (`onDrop` has confirmed it as a legal move). Here, we simply update the board as it is in memory after the move (via `game.fen()`), since `game.move()` will handle things like moving the rook for us.

And with that, we are 95% of the way there. Below is a working version of our chess game as is. Just based on the `.move` method checking for legal moves, we can now play an entire game, with checks, checkmates, and promotions (although just queening for now). Check it out!

<div class="centerer">
  <div id="board2" style="width: 400px"></div>
  <button id="resetBoard2" class="chessReset">Reset</button>
</div>

> The classic two-move checkmate: 1. f3 e5 2. g4 Qh4

<h2 style="color: MidnightBlue">QOL Improvements and Customization</h2>

In the last section of this first blog post, we'll implement a few quality of life improvements to our game. Right now, it is still possible to drag pieces even if it isn't that color's turn, and the pieces are still draggable even after checkmate.

First, let's only enable picking up pieces if it is that color's turn to move, and if the game is not over (from <a href="https://chessboardjs.com/examples#5000" target="_none">example</a>).

```javascript
config = {
  ...
  onDragStart: onDragStart
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
```

Next, we'd like to announce to the player that the game is over upon checkmate, stalemate, or other draws (by threefold repetition, 50-move rule, etc). For this, we'll keep track of the games status after every single move, by calling a function `updateStatus()` during `onDrop` events (after checking if the move is legal). The announcement will be put into an html `label` we'll create for just such a purpose.

```html
<body>
  <div id="chessboard" style="width: 400px"></div>
  <label id="chessStatus" class="chessStatus"></label>
  <button id="resetButton">Reset</button>
</body>
```

For the javascript code, we can rely on a bunch of built-in `chess.js` methods, like `game.in_checkmate()` and `game.in_threefold_repetition()`.

```javascript
function onDrop(source, target){
  let move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  if (move == null) return 'snapback'

  updateStatus();
}

function updateStatus(){
  let prevColor = (game.turn() === 'w') ? "Black" : "White";

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
```

Since `updateStatus` runs after `game.move()` has occurred in the `onDrop` function, `game.turn()` no longer returns the player who made the move, but rather the other player. Thus, to figure out who won via checkmate, we need to reverse the output, designating `prevColor` as Black is `game.turn()` is 'w' and vice versa.

Next, it would be nice to visualize which moves are legal for a given selected piece. Based on this great chessboard.js <a href="https://chessboardjs.com/examples#5003" target="_none">demonstration</a>, we can add the `onMouseoverSquare` and `onMouseoutSquare` methods to the config and configure them to highlight squares as we'd like.

First, we'll define two kinds of grey squares (for light and dark squares respectively), and define a function `greySquare` that sets the color of a given square.

```javascript
let whiteSquareGrey = '#a9a9a9';
let blackSquareGrey = '#696969';

function greySquare(square) {
  let $square = $('#chessboard .square-' + square)

  let background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}
```

Next, we'll call `greySquare` whenever we hover over a particular square (via `onMouseoverSquare`), and also remove the grey coloring via `removeGreySquares` when we stop hovering over a particular square (via `onMouseoutSquare`). We'll also call `removeGreySquares` when we finish making a legal move (via `onDrop`).

```javascript
config = {
  ...
  onMouseoverSquare: onMouseoverSquare,
  onMouseoutSquare: onMouseoutSquare
}

function removeGreySquares(){
  $('#chessboard .square-55d63').css('background', '')
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

function onDrop(source, target){
  removeGreySquares()

  ...
}
```

Last but not least, we will also add a red frame to any King that is under check, by adding on to our checkStatus function. We'll start by defining new functions `redSquare` and `removeRedSquares` (just like we did with the grey squares), and we'll call `redSquare` while we check the status after legal moves, using `game.in_check`. We'll also use a helper function `getKeyByValue` to let us access the square that the enemy king is on from `board.positions()`. Finally, we'll `removeRedSquares()` after we make a move (in `onDrop`) and during a reset.

```javascript
function redSquare(square){
  let $square = $('#board .square-' + square)

  $square.addClass('highlight-red-check')
}

function removeRedSquares(){
  $('#board .square-55d63').removeClass('highlight-red-check')
}

function updateStatus(){
  ...

  if (game.in_check()){
    let kingPosition = getKeyByValue(board.position(), game.turn() + 'K')
    redSquare(kingPosition);
  }
}

function onDrop(source, target){
  ...

  if (move == null) return 'snapback'

  removeRedSquares();
  updateStatus();
}
```

Our css just looks like this:

```css
.highlight-red-check{
  box-shadow: inset 0 0 3px 3px red;
}
```

And with that, we are finished! Below you can find the finished working chess game, with all the bells and whistles. That marks the end of this first blog post. Tune in next time to see an implementation of our first basic computer AIs to play against.

<div class="centerer">
  <div id="board3" style="width: 400px"></div>
  <label id="chessStatus" class="chessStatus"></label>
  <button id="resetBoard3" class="chessReset">Reset</button>
</div>

Cheers!
