// Most Valuable Victim, Least Valuable Attacker sorting object
// indexed by victim first, then by attacker
let attacker_idx = {
  'K': 0,
  'Q': 1,
  'R': 2,
  'B': 3,
  'N': 4,
  'P': 5
}

let mvv_lva = {
  'Q': [50, 51, 52, 53, 54, 55], //victim Q, attacker K, Q, R, B, N, P
  'R': [40, 41, 42, 43, 44, 45], //victim R, attacker K, Q, R, B, N, P
  'B': [30, 31, 32, 33, 34, 35], //victim B, attacker K, Q, R, B, N, P
  'N': [20, 21, 22, 23, 24, 25], //victim N, attacker K, Q, R, B, N, P
  'P': [10, 11, 12, 13, 14, 15]  //victim P, attacker K, Q, R, B, N, P
}

function moveSorter(i, moves, scores){
  // find next max priority item
  let maxPriority = 0, maxPriorityIdx = i;
  if (i < moves.length) {
    // loop through future possible moves
    for (let j = i + 1; j < moves.length; j++) {
      if (scores[j] > maxPriority) {
        // update max priority
        maxPriority = scores[j];
        maxPriorityIdx = j;
      }
    }
  }

  // swap current next move with highest priority move
  let temp = [moves[i], scores[i]];
  moves[i] = moves[maxPriorityIdx];
  scores[i] = scores[maxPriorityIdx];
  moves[maxPriorityIdx] = temp[0];
  scores[maxPriorityIdx] = temp[1];

  return [moves, scores];
}

function scoreMoves(moves){
  let moveScores = new Array(moves.length)
  for (var i = 0; i < moves.length; i++) {
    let move = moves[i];
    if (move.indexOf('#') != -1) {
      moveScores[i] = 99; //checkmate is max priority
    } else if (move.indexOf('x') != -1) {
      let splitMove = move.split('x')
      let attacker = splitMove[0]
      if (attacker == attacker.toLowerCase()) {
        attacker = 'P';
      }

      let victim;
      try {
        victim = game.get(splitMove[1][0] + splitMove[1][1]).type.toUpperCase()
      } catch (e) {
        // only hapens in the case of en passant, there won't be a current piece at the target square
        victim = 'P';
      }

      // use mvv_lva sorting for priority
      moveScores[i] = mvv_lva[victim][attacker_idx[attacker]];
    } else if (move.indexOf('+') != -1) {
      // checks are slightly less than any mvv_lva move since no capture
      moveScores[i] = 9;
    } else  {
      moveScores[i] = 0;
    }
  }
  return moveScores;
}
