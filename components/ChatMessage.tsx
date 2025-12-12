import React from 'react';
import { Message, Restaurant, WeeklyPicks, Itinerary } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { RestaurantCard } from './RestaurantCard';
import { ItineraryView } from './ItineraryView';
import { Bot, User as UserIcon } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onSaveRestaurant: (r: Restaurant) => void;
  onRejectRestaurant: (r: Restaurant) => void;
  onViewWeeklyPicks: (picks: WeeklyPicks) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSaveRestaurant, onRejectRestaurant, onViewWeeklyPicks }) => {
  const isUser = message.role === 'user';
  
  // Check if we have structured data or if text contains JSON code block
  let content: React.ReactNode = <MarkdownRenderer content={message.text} />;
  
  if (message.structuredData) {
    if (message.structuredData.type === 'recommendations') {
      const recs = message.structuredData.data as Restaurant[];
      content = (
        <div className="space-y-4">
           <p className="mb-2 text-gray-300">Here are some spots I think you'll love:</p>
           <div className="grid grid-cols-1 gap-4">
             {recs.map((r, i) => (
               <RestaurantCard key={i} restaurant={r} onSave={onSaveRestaurant} onReject={onRejectRestaurant} />
             ))}
           </div>
        </div>
      );
    } else if (message.structuredData.type === 'weekly_picks') {
       const picks = message.structuredData.data as WeeklyPicks;
       content = (
         <div>
            <p className="mb-4 text-gray-300">I've generated your new weekly picks based on your latest taste profile!</p>
            <button 
              onClick={() => onViewWeeklyPicks(picks)}
              className="w-full py-4 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all group"
            >
               <span className="text-2xl">✨</span>
               <div className="text-left">
                  <div className="font-bold text-white group-hover:text-white transition-colors">Open Weekly Picks</div>
                  <div className="text-xs text-gray-400">3 New Spots • Hidden Gem • Dessert</div>
               </div>
            </button>
         </div>
       );
    } else if (message.structuredData.type === 'itinerary') {
        const itinerary = message.structuredData.data as Itinerary;
        content = <ItineraryView itinerary={itinerary} />;
    }
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-zinc-700' : 'bg-white'}`}>
          {isUser ? <UserIcon size={16} className="text-white" /> : <Bot size={16} className="text-black" />}
        </div>

        {/* Bubble */}
        <div 
          className={`
            rounded-2xl p-4 shadow-md overflow-hidden
            ${isUser 
              ? 'bg-zinc-800 text-white rounded-tr-none' 
              : 'bg-zinc-900/50 text-gray-200 rounded-tl-none border border-zinc-800'}
          `}
        >
          {message.image && (
            <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
              <img src={message.image} alt="User upload" className="max-w-full h-auto max-h-64 object-cover" />
            </div>
          )}
          
          {content}

          <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};