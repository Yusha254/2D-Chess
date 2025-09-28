import { Chess, Piece } from "chess.js";

export type PlayerColor = "white" | "black";

export type SocketId = string;

export interface JoinGamePayload { 
    roomId: string 
}

export interface MakeMovePayload { 
    roomId: string; 
    move: any 
}

export interface ChatPayload { 
    roomId: string; 
    message: string 
}

export interface Game {
  chess: Chess;
  players: { white?: SocketId; black?: SocketId };
}

export interface ChessMove {
  from: string;
  to: string;
  promotion?: string; // 'q' | 'r' | 'b' | 'n'
}

export interface MoveResult {
  valid: boolean;
  reason?: string;
  state?: GameState;
}

export interface GameState {
  fen: string;
  pgn: string;
  turn: "w" | "b";
  gameOver: boolean;
  checkmate: boolean;
  draw: boolean;
  inCheck: boolean;
  board: (Piece | null)[][];
  
}