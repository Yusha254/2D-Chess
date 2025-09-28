import { ChessPieceProps } from '../types/chess';

export function ChessPiece({ piece, skin, size = 48, className = '' }: ChessPieceProps) {
  const pieceKey = `${piece.color}-${piece.type}`;
  const symbol = skin.pieces[pieceKey] || '?';

  return (
    <div
      className={`flex items-center justify-center text-center select-none cursor-pointer ${className}`}
      style={{ fontSize: `${size * 0.8}px`, lineHeight: '1' }}
    >
      {symbol}
    </div>
  );
}