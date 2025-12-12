import React, { useRef, useEffect, useState } from 'react';
import { Message, Restaurant, WeeklyPicks, TasteProfile } from '../types';
import { Send, Image as ImageIcon, Loader2, X, Database, Shirt } from 'lucide-react';
import { ChatMessage } from './ChatMessage';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  profile?: TasteProfile;
  onSendMessage: (text: string, image?: string) => void;
  openSidebar: () => void;
  onSaveRestaurant: (r: Restaurant) => void;
  onRejectRestaurant: (r: Restaurant) => void;
  onViewWeeklyPicks: (picks: WeeklyPicks) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  isLoading, 
  profile,
  onSendMessage, 
  openSidebar,
  onSaveRestaurant,
  onRejectRestaurant,
  onViewWeeklyPicks
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
  };

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;
    onSendMessage(inputText, selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Drag and Drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Dynamic Suggestion based on Profile
  const neverTriedSuggestion = profile?.cuisine_intelligence.never_tried[0] 
    ? `Try ${profile.cuisine_intelligence.never_tried[0]} food?` 
    : "Surprise me with something new";

  return (
    <div className="flex flex-col h-full bg-nyc-black w-full relative overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-nyc-border bg-nyc-black/90 backdrop-blur sticky top-0 z-30">
        <h1 className="text-white font-bold tracking-widest text-sm">NYC SCOUT</h1>
        <button onClick={openSidebar} className="text-gray-300">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide z-10">
        
        {/* Empty State Hero */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center p-8 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="w-24 h-24 bg-gradient-to-tr from-zinc-800 to-black border border-zinc-700 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-white/5 relative">
                <div className="absolute inset-0 bg-white/5 blur-xl rounded-full"></div>
                <span className="text-5xl relative z-10">🗽</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight font-sans text-center">NYC SCOUT</h1>
            <p className="text-zinc-500 max-w-sm text-center text-sm leading-relaxed mb-10">
              The advanced AI concierge for New York City dining and culture. 
              <br/>Memory enabled. Context aware. Social Proof.
            </p>

            {profile && (
               <div className="flex items-center gap-4 mb-8 text-[10px] text-zinc-600 font-mono border border-zinc-800 px-4 py-2 rounded-full bg-zinc-900/50">
                  <span className="flex items-center gap-1.5"><Database size={10} /> {profile.profile_metadata.total_interactions} Data Points</span>
                  <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                  <span>Persona: {profile.inferred_persona.foodie_level.replace('_', ' ') || "INITIALIZING"}</span>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                {[
                  { t: "👕 Analyze my outfit vibe", d: "Match food to fashion" },
                  { t: "🔥 Find viral spots", d: "Trending on TikTok" },
                  { t: `🌍 ${neverTriedSuggestion}`, d: "Expand your palate" },
                  { t: "✨ Generate Weekly Picks", d: "Based on your taste" }
                ].map((item, i) => (
                   <button 
                      key={i}
                      onClick={() => setInputText(item.t)} 
                      className="group p-4 bg-nyc-card hover:bg-zinc-800 border border-nyc-border hover:border-zinc-600 rounded-xl text-left transition-all hover:-translate-y-0.5"
                   >
                      <div className="text-sm font-medium text-gray-200 group-hover:text-white truncate flex items-center gap-2">
                          {item.t.includes("outfit") && <Shirt size={14} className="text-indigo-400"/>}
                          {item.t}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-1">{item.d}</div>
                   </button>
                ))}
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            onSaveRestaurant={onSaveRestaurant}
            onRejectRestaurant={onRejectRestaurant}
            onViewWeeklyPicks={onViewWeeklyPicks}
          />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-nyc-card rounded-2xl rounded-tl-none p-4 flex items-center gap-3 border border-nyc-border shadow-lg">
               <Loader2 className="animate-spin text-white" size={16} />
               <div className="flex flex-col">
                  <span className="text-gray-200 text-xs font-medium">Thinking...</span>
                  <span className="text-zinc-500 text-[10px]">Analyzing taste & social signals...</span>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-nyc-black/80 backdrop-blur-xl border-t border-nyc-border z-20">
        
        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-nyc-card/90 border-2 border-dashed border-white backdrop-blur-sm z-50 flex items-center justify-center flex-col gap-4 text-white">
            <ImageIcon size={48} className="animate-bounce" />
            <span className="font-mono text-sm tracking-widest uppercase">Drop food OR outfit to analyze</span>
          </div>
        )}

        {/* Image Preview */}
        {selectedImage && (
          <div className="flex items-center gap-3 mb-4 bg-nyc-card w-fit p-2 pr-4 rounded-xl border border-nyc-border shadow-2xl animate-in slide-in-from-bottom-2 fade-in">
             <div className="relative">
                <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-zinc-700" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-nyc-card"></div>
             </div>
             <div className="text-xs text-zinc-400">
               <div className="font-bold text-white mb-0.5">Image Ready</div>
               <div className="font-mono text-[10px]">Analysis pending...</div>
             </div>
             <button 
                onClick={() => setSelectedImage(null)}
                className="ml-2 p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
             >
               <X size={14} />
             </button>
          </div>
        )}

        <div className="max-w-4xl mx-auto relative">
            <div 
              ref={dropZoneRef}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className="flex items-end gap-3"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={onFileInputChange}
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`
                  p-4 rounded-xl transition-all duration-200 flex-shrink-0
                  ${selectedImage 
                    ? 'bg-white text-black' 
                    : 'bg-nyc-card text-zinc-400 hover:text-white hover:bg-zinc-800 border border-nyc-border'}
                `}
                title="Upload Image (Food or Outfit)"
              >
                <ImageIcon size={20} />
              </button>

              <div className="flex-1 bg-nyc-card rounded-xl border border-nyc-border focus-within:border-white/50 focus-within:bg-zinc-900 focus-within:ring-1 focus-within:ring-white/10 transition-all flex items-center shadow-inner relative group">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Scout or Drop Outfit..."
                  className="w-full bg-transparent border-none text-white placeholder-zinc-600 p-4 max-h-32 focus:ring-0 resize-none leading-relaxed text-sm"
                  rows={1}
                  style={{ minHeight: '56px' }}
                />
                <div className="absolute right-3 bottom-3 text-[10px] text-zinc-700 font-mono hidden md:block border border-zinc-800 px-1.5 py-0.5 rounded pointer-events-none group-focus-within:text-zinc-500">
                    RETURN
                </div>
              </div>

              <button 
                onClick={handleSend}
                disabled={(!inputText.trim() && !selectedImage) || isLoading}
                className={`
                  p-4 rounded-xl transition-all duration-300 flex-shrink-0
                  ${(!inputText.trim() && !selectedImage) || isLoading 
                    ? 'bg-nyc-card text-zinc-700 cursor-not-allowed border border-nyc-border' 
                    : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10'}
                `}
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
            
             {/* Quick Mobile Suggestion Pills */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {['🔥 Trending', '👕 Match my outfit', '📍 Near me', '👀 Surprise me'].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(suggestion)}
                  className="px-3 py-1.5 bg-nyc-card hover:bg-zinc-800 rounded-full text-[10px] text-zinc-400 hover:text-white border border-nyc-border transition-colors font-mono uppercase tracking-wide"
                >
                  {suggestion}
                </button>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};