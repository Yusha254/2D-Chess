export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface ChessBoardProps {
  board: BoardState;
  theme: BoardTheme;
  skin: PieceSkin;
  selectedSquare: Position | null;
  validMoves: Position[];
  isCheck: boolean;
  currentPlayer: string;
  onSquareClick: (position: Position) => void;
  flipped?: boolean;
}

export interface ChessPieceProps {
  piece: ChessPiece;
  skin: PieceSkin;
  size?: number;
  className?: string;
}

export interface GameInfoProps {
  gameState: GameState;
  onResign: () => void;
  onOfferDraw: () => void;
  onNewGame: () => void;
}

export interface PromotionModalProps {
  color: PieceColor;
  skin: PieceSkin;
  onSelect: (piece: PieceType) => void;
  onCancel: () => void;
}

export interface ThemeSelectorProps {
  selectedTheme: BoardTheme;
  selectedSkin: PieceSkin;
  onThemeChange: (theme: BoardTheme) => void;
  onSkinChange: (skin: PieceSkin) => void;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  isEnPassant?: boolean;
  isCastling?: boolean;
  isPromotion?: boolean;
  promotionPiece?: PieceType;
  notation?: string;
}

export type BoardState = (ChessPiece | null)[][];

export interface GameState {
  board: BoardState;
  currentPlayer: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  gameOver: boolean;
  winner?: PieceColor | 'draw';
  moves: Move[];
  capturedPieces: ChessPiece[];
  enPassantTarget: Position | null;
  halfMoveClock: number;
  fullMoveNumber: number;
}

export interface BoardTheme {
  name: string;
  lightSquare: string;
  darkSquare: string;
  highlight: string;
  validMove: string;
  check: string;
  selected: string;
}

export interface PieceSkin {
  name: string;
  pieces: Record<string, string>;
}