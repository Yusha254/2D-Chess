import { useState, useCallback } from "react";
import { Position, PieceType, BoardTheme, PieceSkin } from "../types/chess";
import { boardThemes, pieceSkins } from "../data/themes";
import { useSocket } from "./useSocket";
import { getPossibleMoves } from "../utils/chessLogic"; // already imported

export function useChessGame(roomId: string) {
  const { gameState, sendMove, assignedColor } = useSocket(roomId);

  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);  // NEW
  const [promotionPending, setPromotionPending] = useState<{
    from: Position;
    to: Position;
    piece: any;
  } | null>(null);

  const [boardTheme, setBoardTheme] = useState<BoardTheme>(boardThemes[0]);
  const [pieceSkin, setPieceSkin] = useState<PieceSkin>(pieceSkins[0]);

  const playerColor =
    assignedColor === "white"
      ? "white"
      : assignedColor === "black"
      ? "black"
      : null;

  /** Convert row/col to algebraic chess notation */
  const toAlgebraic = (pos: Position) => {
    const files = ["a","b","c","d","e","f","g","h"];
    return files[pos.col] + (8 - pos.row);
  };

  /** Handle a square click */
  const handleSquareClick = useCallback(
    (position: Position) => {
      if (!gameState || !playerColor || gameState.gameOver) return;
      if (gameState.currentPlayer !== playerColor) return;

      const piece = gameState.board[position.row][position.col];

      if (selectedSquare) {
        const from = toAlgebraic(selectedSquare);
        const to = toAlgebraic(position);

        // If clicked square is a valid move → send it
        if (validMoves.some((m) => m.row === position.row && m.col === position.col)) {
          sendMove({
            from,
            to,
            promotion: promotionPending?.piece?.charAt(0), // e.g. "q"
          });

          // ✅ Only clear after a valid move
          setSelectedSquare(null);
          setValidMoves([]);
          setPromotionPending(null);
        } else {
          // ✅ If clicking your own piece, change selection instead of clearing
          if (piece && piece.color === playerColor) {
            setSelectedSquare(position);
            const moves = getPossibleMoves(
              gameState.board,
              position,
              gameState.enPassantTarget
            );
            setValidMoves(moves);
          } else {
            // Otherwise just deselect
            setSelectedSquare(null);
            setValidMoves([]);
            setPromotionPending(null);
          }
        }
        } else {
          // First click → select if it's your piece
          if (piece && piece.color === playerColor) {
            setSelectedSquare(position);

            // Compute possible moves for highlighting
            const moves = getPossibleMoves(
              gameState.board,
              position,
              gameState.enPassantTarget
            );
            setValidMoves(moves);
          }
        }
    },
    [gameState, selectedSquare, playerColor, sendMove, promotionPending, validMoves]
  );


  /** Handle promotion */
  const handlePromotion = useCallback(
    (pieceType: PieceType) => {
      if (!promotionPending) return;

      const from = toAlgebraic(promotionPending.from);
      const to = toAlgebraic(promotionPending.to);

      sendMove({
        from,
        to,
        promotion: pieceType.charAt(0), // q/r/b/n
      });

      setPromotionPending(null);
      setValidMoves([]); // clear highlights
    },
    [promotionPending, sendMove]
  );

  /** Cancel promotion */
  const cancelPromotion = useCallback(() => {
    setPromotionPending(null);
    setSelectedSquare(null);
    setValidMoves([]);
  }, []);

  return {
    gameState,
    selectedSquare,
    validMoves,           // <-- return it
    promotionPending,
    boardTheme,
    pieceSkin,
    setBoardTheme,
    setPieceSkin,
    handleSquareClick,
    handlePromotion,
    cancelPromotion,
    assignedColor,
  };
}
