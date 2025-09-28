import { GameInfoProps } from '../types/chess';
import { Clock, Crown, Flag, HandMetal } from 'lucide-react';

export function GameInfo({ gameState, onResign, onOfferDraw, onNewGame }: GameInfoProps) {
  // Safe getter for game status
  const getGameStatus = () => {
    if (!gameState) return "Loading game...";

    if (gameState.isCheckmate) {
      return `Checkmate! ${gameState.winner === 'white' ? 'White' : 'Black'} wins!`;
    }
    if (gameState.isStalemate) return 'Stalemate! Draw.';
    if (gameState.isDraw) return 'Draw!';
    if (gameState.isCheck) {
      return `${gameState.currentPlayer === 'white' ? 'White' : 'Black'} is in check!`;
    }
    return `${gameState.currentPlayer === 'white' ? 'White' : 'Black'} to move`;
  };

  // Safe getter for move history
  const getMoveHistory = () => {
    const moves: string[] = [];
    if (!gameState?.moves?.length) return moves;

    for (let i = 0; i < gameState.moves.length; i += 2) {
      const whiteMove = gameState.moves[i];
      const blackMove = gameState.moves[i + 1];
      const moveNumber = Math.floor(i / 2) + 1;

      let moveText = `${moveNumber}. ${whiteMove?.notation ?? ""}`;
      if (blackMove) moveText += ` ${blackMove.notation ?? ""}`;
      moves.push(moveText);
    }

    return moves;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Game Status */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-gray-800">Game Status</h2>
        </div>
        <p
          className={`text-sm font-medium ${
            gameState?.isCheck ? 'text-red-600' :
            gameState?.gameOver ? 'text-blue-600' : 'text-gray-700'
          }`}
        >
          {getGameStatus()}
        </p>
      </div>

      {/* Game Info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Game Info</h3>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Move: {gameState?.fullMoveNumber ?? 0}</p>
          <p>Half-move clock: {gameState?.halfMoveClock ?? 0}</p>
          <p>Captured pieces: {gameState?.capturedPieces?.length ?? 0}</p>
        </div>
      </div>

      {/* Move History */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Move History</h3>
        <div className="max-h-40 overflow-y-auto bg-gray-50 rounded p-2">
          {getMoveHistory().length > 0 ? (
            <div className="text-xs font-mono text-gray-700 space-y-1">
              {getMoveHistory().map((move, index) => (
                <div key={index}>{move}</div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No moves yet</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {!gameState?.gameOver && (
          <>
            <button
              onClick={onResign}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Flag className="w-4 h-4" />
              Resign
            </button>
            <button
              onClick={onOfferDraw}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HandMetal className="w-4 h-4" />
              Offer Draw
            </button>
          </>
        )}
        <button
          onClick={onNewGame}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Crown className="w-4 h-4" />
          New Game
        </button>
      </div>
    </div>
  );
}
