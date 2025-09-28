import { ChessBoard } from './components/ChessBoard';
import { GameInfo } from './components/GameInfo';
import { ThemeSelector } from './components/ThemeSelector';
import { PromotionModal } from './components/PromotionModal';
import { useChessGame } from './hooks/useChessGame';
import { GameState } from './types/chess';

function App() {
  const {
    gameState,
    selectedSquare,
    promotionPending,
    boardTheme,
    pieceSkin,
    validMoves,
    setBoardTheme,
    setPieceSkin,
    handleSquareClick,
    handlePromotion,
    assignedColor,
    cancelPromotion,
  } = useChessGame("room1");

  // Wait for game state from backend
  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading game...
      </div>
    );
  }

  // Safety: ensure required properties exist
  const safeGameState: GameState = {
    ...gameState,
    isCheck: gameState.isCheck ?? false,
    currentPlayer: gameState.currentPlayer ?? 'white',
    moves: gameState.moves ?? [],
    capturedPieces: gameState.capturedPieces ?? [],
    enPassantTarget: gameState.enPassantTarget ?? null,
    halfMoveClock: gameState?.halfMoveClock ?? 0,
    fullMoveNumber: gameState?.fullMoveNumber ?? 1,
    isCheckmate: gameState?.isCheckmate ?? false,
    isStalemate: gameState?.isStalemate ?? false,
    isDraw: gameState?.isDraw ?? false,
    gameOver: gameState?.gameOver ?? false,
    winner: gameState?.winner,
  };

  /** Resign → backend will handle it */
  const handleResign = () => {
    console.log("Resign requested (send to backend)");
  };

  /** Offer draw → backend will handle it */
  const handleOfferDraw = () => {
    console.log("Draw offer requested (send to backend)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Chess Master</h1>
          <p className="text-slate-300">Awesome 2D Chess...</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Chess Board */}
          <div className="flex-shrink-0">
            <ChessBoard
              board={safeGameState.board}
              theme={boardTheme}
              skin={pieceSkin}
              selectedSquare={selectedSquare}
              validMoves={validMoves} // optional: backend-driven
              isCheck={safeGameState.isCheck}
              currentPlayer={safeGameState.currentPlayer}
              onSquareClick={handleSquareClick}
              flipped={assignedColor === 'black'}
            />
          </div>

          {/* Side Panel */}
          <div className="flex flex-col gap-6 w-full lg:w-80">
            <GameInfo
              gameState={safeGameState}
              onResign={handleResign}
              onOfferDraw={handleOfferDraw}
              onNewGame={() => { /* handled by backend */ }}
            />

            <ThemeSelector
              selectedTheme={boardTheme}
              selectedSkin={pieceSkin}
              onThemeChange={setBoardTheme}
              onSkinChange={setPieceSkin}
            />
          </div>
        </div>
      </div>

      {/* Promotion Modal */}
      {promotionPending && (
        <PromotionModal
          color={promotionPending.piece.color}
          skin={pieceSkin}
          onSelect={handlePromotion}
          onCancel={cancelPromotion}
        />
      )}
    </div>
  );
}

export default App;
