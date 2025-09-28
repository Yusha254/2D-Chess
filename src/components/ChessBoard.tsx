import { ChessBoardProps } from '../types/chess';
import { ChessPiece } from './ChessPiece';

export function ChessBoard({
  board,
  theme,
  skin,
  selectedSquare,
  validMoves,
  isCheck,
  currentPlayer,
  onSquareClick, 
  flipped = false 
}: ChessBoardProps) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const getSquareColor = (row: number, col: number): string => {
    const isLight = (row + col) % 2 === 0;

    const piece = board[row][col];

    // King in check
    if (piece && piece.type === 'king' && piece.color === currentPlayer && isCheck) {
      return theme.check;
    }

    // Selected square
    if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
      return theme.selected;
    }

    // Valid moves
    if (validMoves.some(move => move.row === row && move.col === col)) {
      return theme.validMove;
    }

    return isLight ? theme.lightSquare : theme.darkSquare;
  };

  const renderSquare = (row: number, col: number) => {
    // ⚡ Only flip rows for black player
    const actualRow = flipped ? 7 - row : row;
    const actualCol = col;

    const piece = board[actualRow][actualCol];
    const backgroundColor = getSquareColor(actualRow, actualCol);
    const isValidMove = validMoves.some(move => move.row === actualRow && move.col === actualCol);

    return (
      <div
        key={`${actualRow}-${actualCol}`}
        className="relative aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 hover:brightness-110"
        style={{ backgroundColor }}
        onClick={() => onSquareClick({ row: actualRow, col: actualCol })}
      >
        {piece && (
          <ChessPiece
            piece={piece}
            skin={skin}
            size={56}
            className="z-10"
          />
        )}

        {isValidMove && !piece && (
          <div
            className="absolute w-4 h-4 rounded-full opacity-60"
            style={{ backgroundColor: theme.validMove }}
          />
        )}
        {isValidMove && piece && (
          <div
            className="absolute inset-0 border-4 rounded-lg opacity-60"
            style={{ borderColor: theme.validMove }}
          />
        )}

        {/* Coordinates */}
        {actualCol === 0 && (
          <div
            className="absolute top-1 left-1 text-xs font-bold opacity-70"
            style={{ color: (actualRow + actualCol) % 2 === 0 ? theme.darkSquare : theme.lightSquare }}
          >
            {ranks[actualRow]}
          </div>
        )}
        {actualRow === 7 && (
          <div
            className="absolute bottom-1 right-1 text-xs font-bold opacity-70"
            style={{ color: (actualRow + actualCol) % 2 === 0 ? theme.darkSquare : theme.lightSquare }}
          >
            {files[actualCol]}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-8 gap-0 border-2 border-gray-800 shadow-2xl">
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => renderSquare(row, col))
        )}
      </div>
    </div>
  );
}
