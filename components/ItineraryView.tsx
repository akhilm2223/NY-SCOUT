import React from 'react';
import { Itinerary } from '../types';
import { Clock, DollarSign, MapPin, Footprints } from 'lucide-react';

interface ItineraryViewProps {
  itinerary: Itinerary;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary }) => {
  return (
    <div className="bg-nyc-card border border-nyc-border rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-zinc-900 p-5 border-b border-nyc-border">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-white tracking-tight">{itinerary.title}</h3>
            <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                PLAN
            </div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-zinc-400 font-mono mt-2">
          <span className="flex items-center gap-1.5"><Clock size={12}/> {itinerary.duration}</span>
          <span className="flex items-center gap-1.5"><DollarSign size={12}/> {itinerary.total_cost_estimate}</span>
          <span className="flex items-center gap-1.5"><MapPin size={12}/> {itinerary.neighborhoods.join(', ')}</span>
        </div>
      </div>

      <div className="p-6 relative">
        <div className="space-y-0">
          {itinerary.stops.map((stop, i) => {
            const isLast = i === itinerary.stops.length - 1;

            if (stop.walking_time) {
              return (
                <div key={i} className="flex relative pl-4 pb-8">
                   {/* Walking Line */}
                   <div className="absolute left-[19px] top-0 bottom-0 w-0.5 border-l-2 border-dashed border-zinc-700"></div>
                   
                   <div className="ml-8 flex items-center gap-3 py-2 px-3 bg-zinc-900/50 border border-zinc-800 rounded-lg w-full">
                       <Footprints size={12} className="text-zinc-500" />
                       <div className="flex flex-col">
                           <span className="text-xs text-white font-mono">{stop.walking_time}</span>
                           <span className="text-[10px] text-zinc-500 uppercase tracking-wide">{stop.walking_description}</span>
                       </div>
                   </div>
                </div>
              )
            }
            
            return (
              <div key={i} className="relative pl-4 pb-8">
                {/* Connector Line */}
                {!isLast && (
                     <div className="absolute left-[19px] top-4 bottom-0 w-1 bg-zinc-800"></div>
                )}
                
                {/* Stop Dot */}
                <div className="absolute left-[11px] top-1 w-5 h-5 rounded-full bg-black border-[3px] border-white z-10 shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
                
                <div className="ml-8">
                  <div className="flex items-baseline justify-between mb-2">
                     <h4 className="text-white font-bold text-lg">{stop.name}</h4>
                     <span className="text-zinc-500 font-mono text-xs">{stop.time}</span>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-300 uppercase tracking-wide border border-zinc-700">
                          {stop.type}
                      </span>
                      {stop.budget && (
                          <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-300 border border-zinc-700">
                              {stop.budget}
                          </span>
                      )}
                  </div>
                  
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 space-y-2">
                       <div>
                           <div className="text-[9px] text-zinc-500 uppercase font-bold mb-0.5">ORDER</div>
                           <div className="text-sm text-gray-200 leading-snug">{stop.what_to_get}</div>
                       </div>
                       <div className="pt-2 border-t border-zinc-800">
                           <div className="text-[9px] text-zinc-500 uppercase font-bold mb-0.5">VIBE CHECK</div>
                           <div className="text-xs text-zinc-400">{stop.why_here}</div>
                       </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-zinc-900 p-4 border-t border-nyc-border">
        <div className="flex gap-2 items-start">
            <span className="text-lg">💡</span>
            <div className="text-xs text-zinc-400 leading-relaxed">
                <span className="text-white font-bold uppercase text-[10px] tracking-wide mr-1">PRO TIPS:</span>
                {itinerary.tips.join(' • ')}
            </div>
        </div>
      </div>
    </div>
  );
};