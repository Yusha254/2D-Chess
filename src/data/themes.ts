import { BoardTheme, PieceSkin } from '../types/chess';

export const boardThemes: BoardTheme[] = [
  {
    name: 'Classic',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    highlight: '#ffff99',
    validMove: '#90ee90',
    check: '#ff6b6b',
    selected: '#7cb342'
  },
  {
    name: 'Wood',
    lightSquare: '#deb887',
    darkSquare: '#8b4513',
    highlight: '#ffd700',
    validMove: '#98fb98',
    check: '#ff4500',
    selected: '#228b22'
  },
  {
    name: 'Marble',
    lightSquare: '#f5f5dc',
    darkSquare: '#696969',
    highlight: '#ffb347',
    validMove: '#87ceeb',
    check: '#dc143c',
    selected: '#4169e1'
  },
  {
    name: 'Neon',
    lightSquare: '#2a2a2a',
    darkSquare: '#1a1a1a',
    highlight: '#00ffff',
    validMove: '#00ff00',
    check: '#ff0080',
    selected: '#ff6600'
  }
];

export const pieceSkins: PieceSkin[] = [
  {
    name: 'Traditional',
    pieces: {
      'white-king': '♔',
      'white-queen': '♕',
      'white-rook': '♖',
      'white-bishop': '♗',
      'white-knight': '♘',
      'white-pawn': '♙',
      'black-king': '♚',
      'black-queen': '♛',
      'black-rook': '♜',
      'black-bishop': '♝',
      'black-knight': '♞',
      'black-pawn': '♟'
    }
  },
  {
    name: 'Modern',
    pieces: {
      'white-king': '🤴🏻',
      'white-queen': '👸🏻',
      'white-rook': '🏰',
      'white-bishop': '⛪',
      'white-knight': '🐎',
      'white-pawn': '👤',
      'black-king': '🤴🏿',
      'black-queen': '👸🏿',
      'black-rook': '🏯',
      'black-bishop': '🕌',
      'black-knight': '🦓',
      'black-pawn': '👥'
    }
  }
];

export const pieceValues: Record<string, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0
};