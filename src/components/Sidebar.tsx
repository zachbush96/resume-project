import React from 'react';
import { Trash2 } from 'lucide-react';
import type { SavedGeneration } from '../types';

interface Props {
  generations: SavedGeneration[];
  onSelect: (generation: SavedGeneration) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
}

export function Sidebar({ generations, onSelect, onDelete, selectedId }: Props) {
  return (
    <div className="w-64 bg-white/90 h-screen fixed left-0 top-0 shadow-lg border-r-2 border-amber-900 pt-20">
      <div className="p-4">
        <h2 className="text-lg font-bold text-amber-900 mb-4">Past Generations</h2>
        <div className="space-y-2">
          {generations.length === 0 ? (
            <p className="text-sm text-gray-500">No past generations</p>
          ) : (
            generations.map((gen) => (
              <div
                key={gen.id}
                className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                  selectedId === gen.id ? 'bg-amber-100' : 'hover:bg-amber-50'
                }`}
                onClick={() => onSelect(gen)}
              >
                <div>
                  <p className="font-medium text-amber-900">{gen.input.jobTitle}</p>
                  <p className="text-sm text-amber-700">{gen.input.companyName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(gen.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(gen.id);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 