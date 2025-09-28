# ♟️ Real-Time Chess Game

A full-stack real-time chess application built with React + TypeScript on the frontend and Node.js + Socket.IO on the backend.
It supports multiplayer games, move validation, check/checkmate detection, and highlights all possible moves for a selected piece.

## 🚀 Features

1. Real-time multiplayer using WebSockets

2. Full chess rules:

   - Legal move validation

   - Check, checkmate, stalemate detection

   - En passant, castling, promotion

3. Interactive UI:

   - Highlights selected pieces and possible moves

   - Displays captured pieces and current turn

4. Configurable board themes and piece skins.

## ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Yusha254/2D-Chess.git
   ```

2. Install Dependencies:

   Frontend:

   ```bash
   npm i
   ```

   Backend:

   ```bash
   cd chess-backend
   npm i
   ```

3. Run the project:

   Start frontend:

   ```bash
   npm run dev
   ```

   Start backend:

   ```bash
   cd chess-backend
   npm run start
   ```

   The frontend will run on [http://localhost:5173/](http://localhost:5173/) and connect to the backend WebSocket server at [http://localhost:4000](http://localhost:4000).

## 🖼️ Application Layout

- ChessBoard - Main interactive board where players make moves.
- GameInfo - Shows turn, check/checkmate status, resign/draw options.
- ChessPiece - The different game pieces.
- Move Highlighting - Selected Piece + all legal moves shown.

## 🎯 What the Application Does

This project lets two players play a complete chess game in real time.

- The frontend handles UI rendering and move highlighting.

- The backend ensures rules are followed, validates moves, and broadcasts game state to both players.

It’s a foundation for extending into tournaments, user accounts, or AI opponents.
