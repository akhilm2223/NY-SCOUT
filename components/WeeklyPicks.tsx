import React from 'react';
import { WeeklyPicks, Restaurant } from '../types';
import { RestaurantCard } from './RestaurantCard';
import { X, RefreshCw } from 'lucide-react';

interface WeeklyPicksProps {
  picks: WeeklyPicks;
  onClose: () => void;
  onSave: (r: Restaurant) => void;
  onReject: (r: Restaurant) => void;
}

export const WeeklyPicksView: React.FC<WeeklyPicksProps> = ({ picks, onClose, onSave, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
              ✨ Your Weekly Food Drops
            </h2>
            <p className="text-gray-400 text-sm">Curated for you on {picks.generated_date}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-12 pb-12">
          
          {/* New Spots */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🔥 3 New Spots You'll Love
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {picks.new_spots.map((spot, i) => (
                <div key={i} className="min-w-[280px]">
                  <RestaurantCard restaurant={spot} onSave={onSave} onReject={onReject} compact={true} />
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hidden Gem */}
            <section>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                💎 Hidden Gem Alert
              </h3>
              <RestaurantCard restaurant={{...picks.hidden_gem, is_adventure_pick: false}} onSave={onSave} onReject={onReject} />
            </section>

            {/* Dessert */}
            <section>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🍰 Dessert of the Week
              </h3>
              <RestaurantCard restaurant={picks.dessert_of_week} onSave={onSave} onReject={onReject} />
            </section>
          </div>

          {/* Adventure */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🎯 Food Adventure Challenge
            </h3>
            <RestaurantCard restaurant={{...picks.adventure, is_adventure_pick: true}} onSave={onSave} onReject={onReject} />
          </section>

          <div className="text-center pt-8 border-t border-zinc-800">
             <button className="text-gray-500 text-xs flex items-center justify-center gap-2 mx-auto hover:text-gray-300">
               <RefreshCw size={12} /> Refreshes automatically next Monday
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};