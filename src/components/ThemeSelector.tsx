import { ThemeSelectorProps } from '../types/chess';
import { boardThemes, pieceSkins } from '../data/themes';
import { Palette, Crown } from 'lucide-react';



export function ThemeSelector({
  selectedTheme,
  selectedSkin,
  onThemeChange,
  onSkinChange
}: ThemeSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Board Themes</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {boardThemes.map(theme => (
            <button
              key={theme.name}
              onClick={() => onThemeChange(theme)}
              className={`p-2 rounded-lg border-2 transition-all ${
                selectedTheme.name === theme.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex mb-1">
                <div
                  className="w-4 h-4 border border-gray-400"
                  style={{ backgroundColor: theme.lightSquare }}
                />
                <div
                  className="w-4 h-4 border border-gray-400"
                  style={{ backgroundColor: theme.darkSquare }}
                />
              </div>
              <div className="text-xs font-medium text-gray-700">{theme.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-gray-800">Piece Skins</h3>
        </div>
        <div className="space-y-2">
          {pieceSkins.map(skin => (
            <button
              key={skin.name}
              onClick={() => onSkinChange(skin)}
              className={`w-full p-2 rounded-lg border-2 transition-all text-left ${
                selectedSkin.name === skin.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="text-lg">{skin.pieces['white-king']}</span>
                  <span className="text-lg">{skin.pieces['black-queen']}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{skin.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}