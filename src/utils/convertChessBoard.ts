// utils/convertChessBoard.ts
import { ChessPiece, BoardState, PieceColor, PieceType } from "../types/chess";

const pieceTypeMap: Record<string, PieceType> = {
  p: "pawn",
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king",
};

const colorMap: Record<string, PieceColor> = {
  w: "white",
  b: "black",
};

export function convertChessJsBoard(chessBoard: any[][]): BoardState {
  return chessBoard
    .slice()
    .map(row =>
      row.map(square => {
        if (!square) return null;
        return {
          type: pieceTypeMap[square.type],
          color: colorMap[square.color],
          hasMoved: false,
        } as ChessPiece;
      })
    );
}

