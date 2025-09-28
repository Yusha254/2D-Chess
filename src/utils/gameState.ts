import { BoardState, GameState, Move, PieceColor, Position } from '../types/chess';
import { isInCheck, getPossibleMoves, makeMove } from './chessLogic';

export function isCheckmate(board: BoardState, color: PieceColor): boolean {
  if (!isInCheck(board, color)) return false;
  
  // Check if any move can get the king out of check
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getPossibleMoves(board, { row, col }, null);
        for (const move of moves) {
          const testMove: Move = {
            from: { row, col },
            to: move,
            piece,
            notation: ''
          };
          const testBoard = makeMove(board, testMove);
          if (!isInCheck(testBoard, color)) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
}

export function isStalemate(board: BoardState, color: PieceColor): boolean {
  if (isInCheck(board, color)) return false;
  
  // Check if player has any legal moves
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getPossibleMoves(board, { row, col }, null);
        for (const move of moves) {
          const testMove: Move = {
            from: { row, col },
            to: move,
            piece,
            notation: ''
          };
          const testBoard = makeMove(board, testMove);
          if (!isInCheck(testBoard, color)) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
}

export function isInsufficientMaterial(board: BoardState): boolean {
  const pieces: { color: PieceColor; type: string }[] = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type !== 'king') {
        pieces.push({ color: piece.color, type: piece.type });
      }
    }
  }
  
  // King vs King
  if (pieces.length === 0) return true;
  
  // King + Bishop/Knight vs King
  if (pieces.length === 1 && (pieces[0].type === 'bishop' || pieces[0].type === 'knight')) {
    return true;
  }
  
  // King + Bishop vs King + Bishop (same color squares)
  if (pieces.length === 2 && 
      pieces.every(p => p.type === 'bishop') && 
      pieces[0].color !== pieces[1].color) {
    return true;
  }
  
  return false;
}

export function hasThreefoldRepetition(moves: Move[]): boolean {
  const positions = new Map<string, number>();
  
  // Simplified position hash (would need more sophisticated implementation)
  moves.forEach(move => {
    const hash = `${move.from.row}-${move.from.col}-${move.to.row}-${move.to.col}`;
    positions.set(hash, (positions.get(hash) || 0) + 1);
  });
  
  return Array.from(positions.values()).some(count => count >= 3);
}

export function updateGameState(
  currentState: GameState,
  newMove?: Move
): GameState {
  let newBoard = currentState.board;
  let newMoves = currentState.moves;
  let newHalfMoveClock = currentState.halfMoveClock;
  let newFullMoveNumber = currentState.fullMoveNumber;
  
  if (newMove) {
    newBoard = makeMove(currentState.board, newMove);
    newMoves = [...currentState.moves, newMove];
    
    // Update clocks
    if (newMove.piece.type === 'pawn' || newMove.capturedPiece) {
      newHalfMoveClock = 0;
    } else {
      newHalfMoveClock++;
    }
    
    if (currentState.currentPlayer === 'black') {
      newFullMoveNumber++;
    }
  }
  
  const nextPlayer: PieceColor = currentState.currentPlayer === 'white' ? 'black' : 'white';
  const inCheck = isInCheck(newBoard, nextPlayer);
  const inCheckmate = isCheckmate(newBoard, nextPlayer);
  const inStalemate = isStalemate(newBoard, nextPlayer);
  const insufficientMaterial = isInsufficientMaterial(newBoard);
  const fiftyMoveRule = newHalfMoveClock >= 100; // 50 moves per side
  const threefoldRepetition = hasThreefoldRepetition(newMoves);
  
  const isDraw = inStalemate || insufficientMaterial || fiftyMoveRule || threefoldRepetition;
  const gameOver = inCheckmate || isDraw;
  
  let winner: PieceColor | 'draw' | undefined;
  if (inCheckmate) {
    winner = currentState.currentPlayer; // Current player wins
  } else if (isDraw) {
    winner = 'draw';
  }
  
  return {
    ...currentState,
    board: newBoard,
    currentPlayer: nextPlayer,
    moves: newMoves,
    isCheck: inCheck,
    isCheckmate: inCheckmate,
    isStalemate: inStalemate,
    isDraw,
    gameOver,
    winner,
    halfMoveClock: newHalfMoveClock,
    fullMoveNumber: newFullMoveNumber,
    enPassantTarget: getEnPassantTarget(newMove)
  };
}

function getEnPassantTarget(move?: Move): Position | null {
  if (!move || move.piece.type !== 'pawn') return null;
  
  const rowDiff = Math.abs(move.to.row - move.from.row);
  if (rowDiff === 2) {
    return {
      row: (move.from.row + move.to.row) / 2,
      col: move.from.col
    };
  }
  
  return null;
}