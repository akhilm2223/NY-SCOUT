import React from 'react';
import { Restaurant } from '../types';
import { Bookmark, ThumbsDown, Info, Clock, Calendar, Utensils, Lightbulb, Map } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSave?: (r: Restaurant) => void;
  onReject?: (r: Restaurant) => void;
  compact?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSave, onReject, compact = false }) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + " " + restaurant.neighborhood + " NYC")}`;

  if (compact) {
    return (
      <div className="bg-nyc-card border border-nyc-border rounded-lg p-4 transition-all hover:border-white/20 hover:bg-zinc-800 cursor-pointer group">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1 mr-2">
            <h3 className="font-sans font-bold text-sm text-white truncate flex items-center gap-1 group-hover:text-gray-200 transition-colors">
              {restaurant.is_adventure_pick && <span>🎯</span>}
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1 font-mono">
              <span className="truncate max-w-[80px]">{restaurant.neighborhood}</span>
              <span className="text-zinc-600">•</span>
              <span className="shrink-0">{restaurant.cuisine}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-white font-medium">{restaurant.price}</span>
            </div>
          </div>
          {restaurant.rating && (
            <div className="bg-white/10 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 border border-white/10 font-mono">
              {restaurant.rating.toFixed(1)}
            </div>
          )}
        </div>
        
        {restaurant.why_for_you && (
          <p className="mt-3 text-xs text-zinc-400 line-clamp-2 leading-relaxed border-l-2 border-zinc-700 pl-2">
            {restaurant.why_for_you}
          </p>
        )}

        <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-800/50">
           <button 
             onClick={(e) => { e.stopPropagation(); onSave?.(restaurant); }}
             className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors uppercase tracking-wider font-bold"
           >
             <Bookmark size={12} /> Save
           </button>
           <a 
             href={mapUrl}
             target="_blank"
             rel="noreferrer"
             onClick={(e) => e.stopPropagation()}
             className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors uppercase tracking-wider font-bold ml-auto"
           >
             <Map size={12} /> Map
           </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-nyc-card border border-nyc-border rounded-xl p-0 overflow-hidden transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 ${restaurant.is_adventure_pick ? 'ring-1 ring-white/20' : ''}`}>
      
      {/* Header */}
      <div className="p-5 border-b border-nyc-border bg-gradient-to-b from-zinc-900 to-nyc-card relative">
        {restaurant.is_adventure_pick && (
            <div className="absolute top-0 right-0 bg-white text-black text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                Adventure Pick
            </div>
        )}
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-sans font-bold text-xl text-white flex items-center gap-2">
            {restaurant.name}
          </h3>
          {restaurant.rating && (
            <div className="flex items-center gap-1 bg-white text-black px-2 py-1 rounded text-xs font-bold border border-white font-mono">
              ⭐ {restaurant.rating}
            </div>
          )}
        </div>
        
        <div className="flex items-center flex-wrap gap-2 text-sm text-zinc-400 font-mono mb-3">
            <span>{restaurant.neighborhood}</span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-300">{restaurant.cuisine}</span>
            <span className="text-zinc-700">|</span>
            <span className="text-white font-bold">{restaurant.price}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {restaurant.vibe.map((v, i) => (
            <span key={i} className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[10px] text-zinc-400 uppercase tracking-wide">
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 space-y-5">
        
        {/* Why For You - Highlight */}
        <div className="bg-zinc-900/50 border-l-2 border-white pl-3 py-2">
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">MATCH ANALYSIS</div>
            <div className="text-sm text-gray-200 leading-relaxed">{restaurant.why_for_you}</div>
        </div>

        {/* Data Grid Spec Sheet */}
        <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden">
            {/* Must Order */}
            <div className="bg-nyc-card p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">
                    <Utensils size={10} /> Must Order
                </div>
                <div className="text-xs text-white font-medium">{restaurant.signature_dish || 'Chef\'s choice'}</div>
            </div>

            {/* Pro Tip */}
            <div className="bg-nyc-card p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">
                    <Lightbulb size={10} /> Pro Tip
                </div>
                <div className="text-xs text-zinc-300">{restaurant.pro_tip || 'Ask for specials'}</div>
            </div>

            {/* Wait Time */}
            <div className="bg-nyc-card p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">
                    <Clock size={10} /> Wait Time
                </div>
                <div className="text-xs text-zinc-300 font-mono">{restaurant.wait_time || 'Unknown'}</div>
            </div>

             {/* Best Time */}
             <div className="bg-nyc-card p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">
                    <Calendar size={10} /> Best Time
                </div>
                <div className="text-xs text-zinc-300 font-mono">{restaurant.best_time || 'Reservations'}</div>
            </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="flex items-center border-t border-nyc-border bg-zinc-900/30">
        <button 
          onClick={() => onSave?.(restaurant)}
          className="flex-1 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
        >
          <Bookmark size={14} /> Save
        </button>
        <div className="w-px h-full bg-nyc-border"></div>
        <a 
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
        >
          <Map size={14} /> View Map
        </a>
        <div className="w-px h-full bg-nyc-border"></div>
        <button 
          onClick={() => onReject?.(restaurant)}
          className="flex-1 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
        >
          <ThumbsDown size={14} /> Pass
        </button>
      </div>
    </div>
  );
};