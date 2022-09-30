let board_eval = 0;

function modifyEval(move, oldEval){
  let color = move.color;
  let piece = move.piece.toUpperCase();
  let fromCol = move.from[0];
  let fromRow = move.from[1];
  let toCol = move.to[0];
  let toRow = move.to[1];

  let newEval = oldEval;

  if (color == 'w') {
    // change board eval for white piece moved
    newEval -= pst[piece][8 - fromRow][pst_idx[fromCol]];
    newEval += pst[piece][8 - toRow][pst_idx[toCol]];

    //change eval based on captured piece
    if (move.flags.indexOf('c') != -1){
      newEval += pieceValues[move.captured[1]];
    }
  } else {
    // change board eval for white piece moved
    newEval -= -pst[piece].slice().reverse()[8 - fromRow][pst_idx[fromCol]];
    newEval += -pst[piece].slice().reverse()[8 - toRow][pst_idx[toCol]];

    //change eval based on captured piece
    if (move.flags.indexOf('c') != -1){
      newEval -= pieceValues[move.captured[1]];
    }
  }

  return newEval;
}

let pieceValues = {
  'P': 200,
  'N': 620,
  'B': 640,
  'R': 950,
  'Q': 1800,
  'K': 10000
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
    return pieceValues[piece.type.toUpperCase()];
  } else {
    return -pieceValues[piece.type.toUpperCase()];
  }
}

function evaluatePosition(position){
  if (position.in_checkmate()){
    return (position.turn() == 'w') ? -checkmate_eval : checkmate_eval;
  } else if (position.in_draw()){
    return 0;
  } else {
    return position.eval;
  }
}

// Piece square tables for chess engine

let pst_idx = {
  'a': 0,
  'b': 1,
  'c': 2,
  'd': 3,
  'e': 4,
  'f': 5,
  'g': 6,
  'h': 7
}

let pst = {
    'P':[
            [   0,   0,   0,   0,   0,   0,   0,   0],
            [  60,  60,  70,  80,  80,  70,  60,  60],
            [  40,  40,  40,  60,  60,  40,  40,  40],
            [  20,  20,  30,  50,  50,  20,  20,  20],
            [  10,  10,  20,  30,  40,  10,   5,   5],
            [  15,  10,  10,  20,  20, -10,  10,  15],
            [   5,   5,   5, -40, -40,   5,   5,   5],
            [   0,   0,   0,   0,   0,   0,   0,   0]
        ],
    'N': [
            [ -40, -20, -20, -20, -20, -20, -20, -40],
            [ -20,  -5,  -5,  -5,  -5,  -5,  -5, -20],
            [ -20,  10,  25,  25,  25,  25,  10, -20],
            [ -20,  10,  15,  15,  15,  15,  10, -20],
            [ -20,  10,  15,  15,  15,  15,  10, -20],
            [ -20,  10,  25,  25,  25,  25,  10, -20],
            [ -20,  -5,  10,  -5,  10,  -5,  -5, -20],
            [ -40, -40, -30, -30, -30, -30, -40, -40],
        ],
    'B': [
            [ -20,   0,   0,   0,   0,   0,   0, -20],
            [ -15,   0,   0,   0,   0,   0,   0, -15],
            [ -10,   0,   0,   5,   5,   0,   0, -10],
            [ -10,  10,  10,  30,  30,  10,  10, -10],
            [   5,   5,  10,  25,  25,  10,   5,   5],
            [   5,   5,   5,  10,  10,   5,   5,   5],
            [ -10,   5,   5,  10,  10,   5,   5, -10],
            [ -30, -30, -30, -30, -30, -30, -30, -30],
        ],
    'R': [
            [   0,   0,   0,   0,   0,   0,   0,   0],
            [  15,  15,  15,  20,  20,  15,  15,  15],
            [   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,   0,   0,   0,   0,   0,   0],
            [   5,   5,   5,   5,   5,   5,   5,   5],
            [   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,  20,  20,  20,  10,   0, -10],
        ],
    'Q': [
            [ -50, -30, -30, -30, -30, -30, -30, -50],
            [ -20, -20, -20, -20, -20, -20, -20, -20],
            [ -10, -10,  -5,  -5,  -5,  -5,  -5, -10],
            [ -10,  -5,  -5,  -5,  -5,  -5,  -5, -10],
            [ -10,  -5,  -5,  -5,  -5,  -5,  -5, -10],
            [ -10,  -5,  -5,  -5,  -5,  -5,  -5, -10],
            [ -20, -10,  -5,  -5,  -5,  -5, -10, -20],
            [ -30, -20,  -5,   0,   0,  -5, -20, -30]
        ],
    'K': [
            [   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,   0,  20,  20,   0,   0,   0],
            [   0,   0,   0,  20,  20,   0,   0,   0],
            [   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,   0, -10, -10,   0,   0,   0],
            [   0,  10,  20, -30, -30,   0,  30,   5]
        ]
};
