import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { WeeklyPicksView } from './components/WeeklyPicks';
import { Message, TasteProfile, INITIAL_PROFILE, WeeklyPicks, Restaurant } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { updateTasteProfile } from './utils/profileLogic';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<TasteProfile>(INITIAL_PROFILE);
  const [currentWeeklyPicks, setCurrentWeeklyPicks] = useState<WeeklyPicks | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Initial Greeting
  useEffect(() => {
    const greeting: Message = {
      id: 'init-1',
      role: 'model',
      text: "Welcome back, Akhil! 👋 \n\nI'm ready to find some spots for you. Upload a photo or tell me what you're craving today.",
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, []);

  const handleSendMessage = async (text: string, image?: string) => {
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      image,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Send to API with current profile context
      const { text: responseText, newProfile } = await sendMessageToGemini(text, profile, image);
      
      // Update profile if tool was called and returned updates
      if (newProfile) {
        setProfile(newProfile);
      }

      // Detect JSON content for structured UI
      let structuredData = undefined;
      let displayText = responseText;

      // Try to parse JSON code blocks
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
         try {
           const parsed = JSON.parse(jsonMatch[1]);
           // Detect type based on structure
           if (Array.isArray(parsed) && parsed[0]?.name) {
             structuredData = { type: 'recommendations', data: parsed };
             displayText = ""; // Hide raw JSON text
           } else if (parsed.new_spots && parsed.hidden_gem) {
             structuredData = { type: 'weekly_picks', data: parsed };
             displayText = "";
           } else if (parsed.stops && parsed.title) {
             structuredData = { type: 'itinerary', data: parsed };
             displayText = "";
           }
         } catch (e) {
           console.error("Failed to parse JSON response block", e);
         }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: displayText,
        structuredData: structuredData as any,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble reaching my network. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateItinerary = async (type: string) => {
    const itineraryTypes: Record<string, string> = {
      'quick_bite': 'Plan a quick bite (30 min) in a nearby cool area.',
      'dinner_dessert': 'Plan a dinner plus a dessert walk itinerary.',
      'friends_night': 'Plan a fun friends night out itinerary.',
      'cafe_chill': 'Plan a cafe hop and chill afternoon itinerary.'
    };
    
    const prompt = itineraryTypes[type] || `Plan a ${type} itinerary.`;
    handleSendMessage(prompt);
  };

  const handleSaveRestaurant = (r: Restaurant) => {
    const updated = updateTasteProfile(profile, {
      update_type: 'recommendation_feedback',
      feedback_restaurant: r.name,
      feedback_type: 'saved'
    });
    setProfile(updated);
  };

  const handleRejectRestaurant = (r: Restaurant) => {
    const updated = updateTasteProfile(profile, {
      update_type: 'recommendation_feedback',
      feedback_restaurant: r.name,
      feedback_type: 'rejected'
    });
    setProfile(updated);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-nyc-black text-white font-sans">
      <Sidebar 
        profile={profile} 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        onGenerateItinerary={handleGenerateItinerary}
      />
      <main className="flex-1 h-full relative">
        <ChatInterface 
          messages={messages} 
          isLoading={isLoading} 
          profile={profile}
          onSendMessage={handleSendMessage}
          openSidebar={() => setIsSidebarOpen(true)}
          onSaveRestaurant={handleSaveRestaurant}
          onRejectRestaurant={handleRejectRestaurant}
          onViewWeeklyPicks={(picks) => setCurrentWeeklyPicks(picks)}
        />
      </main>

      {/* Weekly Picks Modal */}
      {currentWeeklyPicks && (
        <WeeklyPicksView 
          picks={currentWeeklyPicks} 
          onClose={() => setCurrentWeeklyPicks(null)}
          onSave={handleSaveRestaurant}
          onReject={handleRejectRestaurant}
        />
      )}
    </div>
  );
}