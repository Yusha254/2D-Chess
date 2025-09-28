// src/index.ts
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { createGame, getGame, joinGame, makeMove, getState } from "./gameManager";
import { relayChat } from "./chatManager";
import { JoinGamePayload, MakeMovePayload, ChatPayload, PlayerColor } from "./interface/index";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket: Socket) => {
  console.log("New client connected:", socket.id);

  /** JOIN GAME */
  socket.on("joinGame", ({ roomId }: JoinGamePayload) => {
    const game = getGame(roomId) || createGame(roomId);

    const color: PlayerColor | null = joinGame(roomId, socket.id);

    socket.join(roomId);

    if (!color) {
      // Spectator
      socket.emit("roomFull", { message: "Room is full, you are a spectator." });
    } else {
      socket.emit("colorAssigned", { color });
      console.log(`Player ${socket.id} joined room ${roomId} as ${color}`);
    }

    // Broadcast latest state to everyone in room
    io.to(roomId).emit("gameUpdate", getState(roomId));
  });

  /** PLAYER MOVE */
  socket.on("makeMove", ({ roomId, move }: MakeMovePayload) => {
    const result = makeMove(roomId, move, socket.id);
    if (result.valid) io.to(roomId).emit("gameUpdate", result.state);
    else socket.emit("invalidMove", { reason: result.reason });
  });

  /** CHAT */
  socket.on("sendChat", ({ roomId, message }: ChatPayload) => {
    relayChat(io, roomId, socket.id, message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(4000, () => console.log("Server running on http://localhost:4000"));
