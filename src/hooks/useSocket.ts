// useSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { convertChessJsBoard } from "../utils/convertChessBoard";
import { GameState } from "../types/chess";

export function useSocket(roomId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [assignedColor, setAssignedColor] = useState<"white" | "black" | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  useEffect(() => {
    // Create a new socket for this instance
    const s = io("http://localhost:4000", { reconnectionAttempts: 5 });
    setSocket(s);

    // Connect / disconnect events
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    s.on("connect", handleConnect);
    s.on("disconnect", handleDisconnect);

    // Join game after connecting
    if (s.connected) s.emit("joinGame", { roomId });
    else s.once("connect", () => s.emit("joinGame", { roomId }));

    // Color assignment
    const handleColorAssigned = ({ color }: { color: "white" | "black" }) => {
      setAssignedColor(color);
      console.log("Assigned color:", color, "Socket ID:", s.id);
    };
    s.on("colorAssigned", handleColorAssigned);

    // Game updates
    const handleGameUpdate = (state: any) => {
      const board = convertChessJsBoard(state.board);
      setGameState({ ...state, board, currentPlayer: state.turn === "w" ? "white" : "black" });
    };
    s.on("gameUpdate", handleGameUpdate);

    // Invalid move
    const handleInvalidMove = (err: any) => console.warn("Invalid move:", err);
    s.on("invalidMove", handleInvalidMove);

    // Chat messages
    const handleChatMessage = (msg: any) => setChatMessages(prev => [...prev, msg]);
    s.on("chatMessage", handleChatMessage);

    // Cleanup on unmount
    return () => {
      s.off("connect", handleConnect);
      s.off("disconnect", handleDisconnect);
      s.off("colorAssigned", handleColorAssigned);
      s.off("gameUpdate", handleGameUpdate);
      s.off("invalidMove", handleInvalidMove);
      s.off("chatMessage", handleChatMessage);
      s.disconnect();
    };
  }, [roomId]);

  const sendMove = (move: any) => socket?.emit("makeMove", { roomId, move });
  const sendChat = (message: string) => socket?.emit("sendChat", { roomId, message });

  return { connected, assignedColor, gameState, chatMessages, sendMove, sendChat };
}
