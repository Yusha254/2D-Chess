import { Chess } from "chess.js";
import { Game, SocketId, ChessMove, MoveResult, GameState } from "./interface/index";

const games: Record<string, Game> = {};

/** Create or return existing game */
export function createGame(roomId: string): Game {
  if (!games[roomId]) {
    games[roomId] = {
      chess: new Chess(),
      players: {},
    };
  }
  return games[roomId];
}

/** Get game by roomId */
export function getGame(roomId: string): Game | null {
  return games[roomId] || null;
}

/** Join game and return assigned color */
export function joinGame(roomId: string, socketId: SocketId): "white" | "black" | null {
  const game = createGame(roomId);

  if (!game.players.white) {
    game.players.white = socketId;
    return "white";
  } else if (!game.players.black) {
    game.players.black = socketId;
    return "black";
  } else {
    return null; // spectator
  }
}

/** Make a move if valid for the player */
export function makeMove(roomId: string, move: ChessMove, socketId: SocketId): MoveResult {
  const game = games[roomId];
  if (!game) return { valid: false, reason: "Game not found" };

  const turn = game.chess.turn(); // 'w' or 'b'
  const expectedSocket = turn === "w" ? game.players.white : game.players.black;

  if (expectedSocket !== socketId) {
    return { valid: false, reason: "Not your turn" };
  }

  try {
    const result = game.chess.move(move); // returns null if invalid
    if (!result) return { valid: false, reason: "Invalid move" };
    return { valid: true, state: getState(roomId) };
  } catch (err: any) {
    return { valid: false, reason: err.message };
  }
}

/** Get current game state */
export function getState(roomId: string): GameState {
  const game = games[roomId];
  if (!game) throw new Error("Game not found");

  const chess = game.chess;

  return {
    fen: chess.fen(),
    pgn: chess.pgn(),
    turn: chess.turn(),
    gameOver: chess.isGameOver(),
    checkmate: chess.isCheckmate(),
    draw: chess.isDraw(),
    inCheck: chess.inCheck(),
    board: chess.board(),
    
  };
}
