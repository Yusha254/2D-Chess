import { Server } from "socket.io";

export function relayChat(
  io: Server,
  roomId: string,
  senderId: string,
  message: string
) {
  io.to(roomId).emit("chatMessage", {
    sender: senderId,
    message,
    timestamp: Date.now(),
  });
}
