---
title: JavaScript Chess AI (Part 4)
excerpt: Engine improvements with piece square table evaluation, iterative deepening and aspiration windows.
published: false
---

<link rel="stylesheet" href="../assets/chess/css/styles.css">
<link rel="stylesheet" href="../assets/chess/css/chessboard-1.0.0.css">
<script src="../assets/chess/js/jquery-3.4.1.js" charset="utf-8"></script>
<script src="../assets/chess/js/chess.js" charset="utf-8"></script>
<script src="../assets/chess/js/chessboard-1.0.0.js" charset="utf-8"></script>
<script src="../assets/chess/js/helperFunctions.js" charset="utf-8"></script>
<script src="../assets/chess/js/boardFunctions.js" charset="utf-8"></script>
<script src="../assets/chess/js/evaluation.js" charset="utf-8"></script>
<script src="../assets/chess/js/moveOrdering.js" charset="utf-8"></script>
<script src="../assets/chess/js/openingbook.js" charset="utf-8"></script>
<script src="../assets/chess/js/main-part4.js" charset="utf-8"></script>

Welcome to Part 4 of creating a Chess AI! In this last and final post, we will improve our Chess AI's evaluation with the use of Piece Square Tables and improve its search algorithm with the use of iterative deepening. As we'll see, our AI's bottleneck is currently its ability to generate moves quickly (chess.js being quite inefficient), and thus it is unfortunately unable to realistically look beyond 3-5 moves into the future. Perhaps in the future I'll fully design a custom board engine (with bitboard move generation), but for now we'll leave it here and move on to Deep RL applications.

- <a href="/simple-chess-ai-part1"><b>Part 1:</b> Chess Game with Javascript and HTML</a>
- <a href="/simple-chess-ai-part2"><b>Part 2:</b> A Simple Computer Opponent</a>
- <a href="/simple-chess-ai-part3"><b>Part 3:</b> Minimax with Alpha-Beta Pruning</a>

<hr>

##### Acknowledgements

*For our last acknowledgements page, I'd like to give a huge shout out to the <a href="https://rustic-chess.org/" target="_blank">Rustic Chess blog</a>, which was incredibly helpful in the design and implementation of both evaluation functions and iterative deepening. And, if it hasn't been made obvious yet, the <a href="https://www.chessprogramming.org/Main_Page" target="_blank">chess programming wiki</a> is an amazing resource that I learned so much from while designing this iteration of the chess AI.*

<hr>

<h2 style="color: MidnightBlue">Evaluation</h2>



<div class="centerer">
  <h4>Improved Chess AI</h4>
  <div id="board" style="width: 400px"></div>
  <label id="chessStatus" class="chessStatus"></label>
  <button id="resetBoard" class="chessReset">Reset</button>
</div>
