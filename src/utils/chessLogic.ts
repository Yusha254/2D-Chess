import { BoardState, Position, Move, PieceColor } from '../types/chess';

export const initialBoard: BoardState = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' }
  ],
  [
    { type: 'pawn', color: 'black' },
    { type: 'pawn', color: 'black' },
    { type: 'pawn', color: 'black' },
    { type: 'pawn', color: 'black' },
    { type: 'pawn', color: 'black' },
    { type: 'pawn', color: 'black' },
    { type: 'pawn', color: 'black' },
    { type: 'pawn', color: 'black' }
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: 'pawn', color: 'white' },
    { type: 'pawn', color: 'white' },
    { type: 'pawn', color: 'white' },
    { type: 'pawn', color: 'white' },
    { type: 'pawn', color: 'white' },
    { type: 'pawn', color: 'white' },
    { type: 'pawn', color: 'white' },
    { type: 'pawn', color: 'white' }
  ],
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' }
  ]
];

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
}

export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * NEW: Raw move generator (ignores king safety)
 */
function getRawMoves(
  board: BoardState,
  position: Position,
  enPassantTarget: Position | null
): Position[] {
  const piece = board[position.row][position.col];
  if (!piece) return [];

  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, position, piece.color, enPassantTarget);
    case 'rook':
      return getRookMoves(board, position, piece.color);
    case 'bishop':
      return getBishopMoves(board, position, piece.color);
    case 'queen':
      return getQueenMoves(board, position, piece.color);
    case 'king':
      return getKingMovesRaw(board, position, piece.color);
    case 'knight':
      return getKnightMoves(board, position, piece.color);
    default:
      return [];
  }
}

/**
 * Public: Possible moves (filters out moves that leave king in check)
 */
export function getPossibleMoves(
  board: BoardState,
  position: Position,
  enPassantTarget: Position | null
): Position[] {
  const piece = board[position.row][position.col];
  if (!piece) return [];

  const rawMoves = getRawMoves(board, position, enPassantTarget);

  return rawMoves.filter(to => {
    const move: Move = {
      from: position,
      to,
      piece,
      capturedPiece: board[to.row][to.col] || undefined,
      notation: ''
    };
    const tempBoard = makeMove(board, move);
    return !isInCheck(tempBoard, piece.color);
  });
}

/* ---------------- Piece movement generators ---------------- */

function getPawnMoves(board: BoardState, pos: Position, color: PieceColor, enPassantTarget: Position | null): Position[] {
  const moves: Position[] = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;

  const oneSquareAhead = { row: pos.row + direction, col: pos.col };
  if (isValidPosition(oneSquareAhead) && !board[oneSquareAhead.row][oneSquareAhead.col]) {
    moves.push(oneSquareAhead);

    if (pos.row === startRow) {
      const twoSquaresAhead = { row: pos.row + direction * 2, col: pos.col };
      if (isValidPosition(twoSquaresAhead) && !board[twoSquaresAhead.row][twoSquaresAhead.col]) {
        moves.push(twoSquaresAhead);
      }
    }
  }

  const capturePositions = [
    { row: pos.row + direction, col: pos.col - 1 },
    { row: pos.row + direction, col: pos.col + 1 }
  ];

  capturePositions.forEach(capturePos => {
    if (isValidPosition(capturePos)) {
      const targetPiece = board[capturePos.row][capturePos.col];
      if (targetPiece && targetPiece.color !== color) {
        moves.push(capturePos);
      } else if (enPassantTarget && positionsEqual(capturePos, enPassantTarget)) {
        moves.push(capturePos);
      }
    }
  });

  return moves;
}

function getRookMoves(board: BoardState, pos: Position, color: PieceColor): Position[] {
  const moves: Position[] = [];
  const directions = [
    { row: 0, col: 1 },
    { row: 0, col: -1 },
    { row: 1, col: 0 },
    { row: -1, col: 0 }
  ];

  directions.forEach(dir => {
    for (let i = 1; i < 8; i++) {
      const newPos = { row: pos.row + dir.row * i, col: pos.col + dir.col * i };
      if (!isValidPosition(newPos)) break;

      const piece = board[newPos.row][newPos.col];
      if (piece) {
        if (piece.color !== color) moves.push(newPos);
        break;
      }
      moves.push(newPos);
    }
  });

  return moves;
}

function getBishopMoves(board: BoardState, pos: Position, color: PieceColor): Position[] {
  const moves: Position[] = [];
  const directions = [
    { row: 1, col: 1 },
    { row: 1, col: -1 },
    { row: -1, col: 1 },
    { row: -1, col: -1 }
  ];

  directions.forEach(dir => {
    for (let i = 1; i < 8; i++) {
      const newPos = { row: pos.row + dir.row * i, col: pos.col + dir.col * i };
      if (!isValidPosition(newPos)) break;

      const piece = board[newPos.row][newPos.col];
      if (piece) {
        if (piece.color !== color) moves.push(newPos);
        break;
      }
      moves.push(newPos);
    }
  });

  return moves;
}

function getQueenMoves(board: BoardState, pos: Position, color: PieceColor): Position[] {
  return [...getRookMoves(board, pos, color), ...getBishopMoves(board, pos, color)];
}

/**
 * Raw king moves (no safety filtering here)
 */
function getKingMovesRaw(board: BoardState, pos: Position, color: PieceColor): Position[] {
  const moves: Position[] = [];
  const directions = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 },                        { row: 0, col: 1 },
    { row: 1, col: -1 },  { row: 1, col: 0 },  { row: 1, col: 1 }
  ];

  directions.forEach(dir => {
    const newPos = { row: pos.row + dir.row, col: pos.col + dir.col };
    if (isValidPosition(newPos)) {
      const target = board[newPos.row][newPos.col];
      if (!target || target.color !== color) {
        moves.push(newPos);
      }
    }
  });

  return moves;
}

function getKnightMoves(board: BoardState, pos: Position, color: PieceColor): Position[] {
  const moves: Position[] = [];
  const knightMoves = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 },  { row: 1, col: 2 },
    { row: 2, col: -1 },  { row: 2, col: 1 }
  ];

  knightMoves.forEach(move => {
    const newPos = { row: pos.row + move.row, col: pos.col + move.col };
    if (isValidPosition(newPos)) {
      const piece = board[newPos.row][newPos.col];
      if (!piece || piece.color !== color) moves.push(newPos);
    }
  });

  return moves;
}

/* ---------------- Game state checks ---------------- */

export function isInCheck(board: BoardState, kingColor: PieceColor): boolean {
  let kingPos: Position | null = null;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === kingColor) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== kingColor) {
        const moves = getRawMoves(board, { row, col }, null);
        if (moves.some(move => positionsEqual(move, kingPos!))) return true;
      }
    }
  }

  return false;
}

/* ---------------- Other helpers (castling, moves, notation) ---------------- */

export function canCastle(
  board: BoardState,
  kingColor: PieceColor,
  side: 'kingside' | 'queenside'
): boolean {
  const row = kingColor === 'white' ? 7 : 0;
  const king = board[row][4];

  if (!king || king.type !== 'king' || king.hasMoved) return false;
  if (isInCheck(board, kingColor)) return false;

  const rookCol = side === 'kingside' ? 7 : 0;
  const rook = board[row][rookCol];
  if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;

  const colsBetween = side === 'kingside' ? [5, 6] : [1, 2, 3];
  for (const col of colsBetween) {
    if (board[row][col]) return false;
  }

  const kingPath = side === 'kingside' ? [5, 6] : [3, 2];
  for (const col of kingPath) {
    const tempBoard = board.map(r => [...r]);
    tempBoard[row][4] = null;
    tempBoard[row][col] = king;
    if (isInCheck(tempBoard, kingColor)) return false;
  }

  return true;
}

export function makeMove(board: BoardState, move: Move): BoardState {
  const newBoard = board.map(row => [...row]);
  const piece = { ...move.piece };

  if (move.isCastling) {
    const row = move.from.row;
    const isKingside = move.to.col > move.from.col;
    const rookFromCol = isKingside ? 7 : 0;
    const rookToCol = isKingside ? 5 : 3;

    newBoard[row][move.to.col] = { ...piece, hasMoved: true };
    newBoard[row][move.from.col] = null;

    newBoard[row][rookToCol] = { ...newBoard[row][rookFromCol]!, hasMoved: true };
    newBoard[row][rookFromCol] = null;
  } else if (move.isEnPassant) {
    newBoard[move.from.row][move.to.col] = null;
    newBoard[move.to.row][move.to.col] = { ...piece, hasMoved: true };
    newBoard[move.from.row][move.from.col] = null;
  } else if (move.isPromotion && move.promotionPiece) {
    newBoard[move.to.row][move.to.col] = {
      type: move.promotionPiece,
      color: piece.color,
      hasMoved: true
    };
    newBoard[move.from.row][move.from.col] = null;
  } else {
    newBoard[move.to.row][move.to.col] = { ...piece, hasMoved: true };
    newBoard[move.from.row][move.from.col] = null;
  }

  return newBoard;
}

export function getAllLegalMoves(board: BoardState, color: PieceColor): Move[] {
  const moves: Move[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const from = { row, col };
        const possiblePositions = getPossibleMoves(board, from, null);

        possiblePositions.forEach(to => {
          const move: Move = {
            from,
            to,
            piece,
            capturedPiece: board[to.row][to.col] || undefined,
            notation: ''
          };
          const tempBoard = makeMove(board, move);
          if (!isInCheck(tempBoard, color)) moves.push(move);
        });
      }
    }
  }

  return moves;
}

export function isCheckmate(board: BoardState, color: PieceColor): boolean {
  return isInCheck(board, color) && getAllLegalMoves(board, color).length === 0;
}

export function isStalemate(board: BoardState, color: PieceColor): boolean {
  return !isInCheck(board, color) && getAllLegalMoves(board, color).length === 0;
}

export function getMoveNotation(board: BoardState, move: Move): string {
  const piece = move.piece;
  const isCapture = move.capturedPiece || move.isEnPassant;

  if (move.isCastling) {
    return move.to.col > move.from.col ? 'O-O' : 'O-O-O';
  }

  let notation = '';
  if (piece.type !== 'pawn') notation += piece.type.charAt(0).toUpperCase();
  if (piece.type === 'pawn' && isCapture) notation += String.fromCharCode(97 + move.from.col);
  if (isCapture) notation += 'x';
  notation += String.fromCharCode(97 + move.to.col) + (8 - move.to.row);
  if (move.isPromotion && move.promotionPiece) {
    notation += '=' + move.promotionPiece.charAt(0).toUpperCase();
  }

  return notation;
}
