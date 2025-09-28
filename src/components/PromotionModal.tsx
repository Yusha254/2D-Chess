import { PromotionModalProps, PieceType } from '../types/chess';
import { ChessPiece } from './ChessPiece';
import { X } from 'lucide-react';



export function PromotionModal({ color, skin, onSelect, onCancel }: PromotionModalProps) {
  const pieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Promote Pawn</h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">Choose a piece to promote to:</p>
        
        <div className="flex gap-2">
          {pieces.map(pieceType => (
            <button
              key={pieceType}
              onClick={() => onSelect(pieceType)}
              className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <ChessPiece
                piece={{ type: pieceType, color }}
                skin={skin}
                size={48}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}