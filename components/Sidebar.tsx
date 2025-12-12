import React from 'react';
import { TasteProfile } from '../types';
import { 
  User, MapPin, Heart, XCircle, Flame, 
  Navigation, Activity, UtensilsCrossed, 
  Thermometer, ChefHat, Volume2, Lightbulb,
  Calendar, Users, Briefcase, Coffee, Brain, Utensils
} from 'lucide-react';

interface SidebarProps {
  profile: TasteProfile;
  isOpen: boolean;
  toggleSidebar: () => void;
  onGenerateItinerary: (type: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ profile, isOpen, toggleSidebar, onGenerateItinerary }) => {
  // Sort favorites by score
  const sortedFavorites = Object.entries(profile.cuisine_intelligence.favorites)
    .sort(([,a], [,b]) => b - a)
    .map(([k]) => k);
    
  // Sort dishes by score
  const sortedDishes = profile.cuisine_intelligence.dish_preferences 
    ? Object.entries(profile.cuisine_intelligence.dish_preferences)
        .sort(([,a], [,b]) => b - a)
        .map(([k]) => k)
    : [];

  // Helper for segmented bar
  const SegmentedBar = ({ level }: { level: string }) => {
    const segments = 5;
    let active = 0;
    if (level === 'very_spicy') active = 5;
    else if (level === 'spicy') active = 4;
    else if (level === 'medium') active = 3;
    else if (level === 'mild') active = 2;
    else active = 1;

    return (
      <div className="flex gap-1 h-2 flex-1">
        {[...Array(segments)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-sm transition-all duration-300 ${i < active ? 'bg-white' : 'bg-nyc-border'}`} 
          />
        ))}
      </div>
    );
  };

  const ContextBadge = ({ active, icon: Icon, label }: { active: boolean; icon: any; label: string }) => (
    <div className={`flex flex-col items-center justify-center p-2 rounded border transition-all ${active ? 'bg-white text-black border-white' : 'bg-nyc-card border-nyc-border text-zinc-600'}`}>
        <Icon size={14} className="mb-1" />
        <span className="text-[9px] uppercase font-bold tracking-tighter">{label}</span>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-80 bg-nyc-black border-r border-nyc-border 
          transform transition-transform duration-300 ease-in-out flex flex-col h-full
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-nyc-border flex items-center justify-between bg-nyc-black">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded font-bold font-mono">
                AK
            </div>
            <div>
                <h2 className="font-bold text-sm tracking-widest leading-none">AKHIL'S SCOUT</h2>
                <span className="text-[10px] text-zinc-500 font-mono">PROFILE: ACTIVE</span>
            </div>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-zinc-400 hover:text-white transition-colors">
            <XCircle size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-nyc-card border border-nyc-border p-3 rounded-lg">
                <div className="text-[10px] text-zinc-500 uppercase font-mono mb-1">Interactions</div>
                <div className="text-xl font-bold text-white font-mono">{profile.profile_metadata.total_interactions}</div>
             </div>
             <div className="bg-nyc-card border border-nyc-border p-3 rounded-lg">
                <div className="text-[10px] text-zinc-500 uppercase font-mono mb-1">Recs Given</div>
                <div className="text-xl font-bold text-white font-mono">{profile.profile_metadata.total_recommendations_given}</div>
             </div>
          </div>

          {/* Quick Actions / Itineraries */}
          <section>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
              <Navigation size={12} /> Generators
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'quick_bite', label: '🍔 Quick Bite', sub: '30 min • Nearby' },
                { id: 'dinner_dessert', label: '🍝 Dinner + Dessert', sub: 'Evening Walk' },
                { id: 'friends_night', label: '🎉 Friends Night', sub: 'Group Fun' },
                { id: 'cafe_chill', label: '☕ Café + Chill', sub: 'Work/Read' }
              ].map(plan => (
                <button
                  key={plan.id}
                  onClick={() => {
                    onGenerateItinerary(plan.id);
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                  className="w-full text-left px-3 py-3 rounded-lg bg-nyc-card hover:bg-zinc-800 text-sm text-gray-200 transition-all border border-nyc-border hover:border-zinc-600 group"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium group-hover:text-white">{plan.label}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{plan.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Preferences Visualization */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
              <Activity size={12} /> Taste Matrix
            </h3>
            
            <div className="bg-nyc-card p-4 rounded-xl border border-nyc-border space-y-4">
              {/* Spice */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-zinc-400 text-xs flex items-center gap-1"><Flame size={10} /> Spice Level</span>
                  <span className="text-white text-[10px] font-mono font-bold uppercase">{profile.flavor_profile.spice_tolerance.level.replace('_', ' ')}</span>
                </div>
                <SegmentedBar level={profile.flavor_profile.spice_tolerance.level} />
              </div>

              {/* Sweet vs Umami */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/50">
                 <div>
                    <span className="text-zinc-500 text-[10px] block mb-1">Sweetness</span>
                    <div className={`text-xs font-medium border px-2 py-1 rounded text-center ${profile.flavor_profile.sweetness.preference === 'loves_sweet' ? 'border-white text-white bg-zinc-800' : 'border-zinc-800 text-zinc-500'}`}>
                        {profile.flavor_profile.sweetness.preference === 'loves_sweet' ? 'HIGH' : profile.flavor_profile.sweetness.preference === 'moderate' ? 'MED' : 'LOW'}
                    </div>
                 </div>
                 <div>
                    <span className="text-zinc-500 text-[10px] block mb-1">Umami</span>
                    <div className={`text-xs font-medium border px-2 py-1 rounded text-center ${profile.flavor_profile.savory_umami.preference === 'umami_seeker' ? 'border-white text-white bg-zinc-800' : 'border-zinc-800 text-zinc-500'}`}>
                        {profile.flavor_profile.savory_umami.preference === 'umami_seeker' ? 'HIGH' : 'MED'}
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* Sensory DNA (Textures, etc) */}
          {(profile.flavor_profile.texture_preferences.length > 0 || profile.flavor_profile.cooking_style_preferences.length > 0) && (
             <section>
                 <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
                    <ChefHat size={12} /> Sensory DNA
                 </h3>
                 <div className="flex flex-wrap gap-1.5">
                    {profile.flavor_profile.texture_preferences.map((t, i) => (
                        <span key={i} className="text-[10px] text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded capitalize">{t}</span>
                    ))}
                    {profile.flavor_profile.cooking_style_preferences.map((c, i) => (
                        <span key={i} className="text-[10px] text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded capitalize">{c}</span>
                    ))}
                 </div>
             </section>
          )}

          {/* Ambience & Context */}
          <section>
             <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
                <Lightbulb size={12} /> Situational
             </h3>
             <div className="bg-nyc-card p-3 rounded-xl border border-nyc-border mb-3">
                 <div className="flex justify-between items-center mb-3 text-xs">
                     <span className="text-zinc-400 flex items-center gap-1"><Volume2 size={10} /> Noise</span>
                     <span className="text-white font-mono uppercase">{profile.vibe_preferences.ambience_factors.noise_preference || 'ANY'}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                     <span className="text-zinc-400 flex items-center gap-1"><Lightbulb size={10} /> Lighting</span>
                     <span className="text-white font-mono uppercase">{profile.vibe_preferences.ambience_factors.lighting_preference || 'ANY'}</span>
                 </div>
             </div>
             <div className="grid grid-cols-4 gap-2">
                 <ContextBadge active={profile.vibe_preferences.context_preferences.date_night.length > 0} icon={Heart} label="Date" />
                 <ContextBadge active={profile.vibe_preferences.context_preferences.solo_dining.length > 0} icon={User} label="Solo" />
                 <ContextBadge active={profile.vibe_preferences.context_preferences.group_outings.length > 0} icon={Users} label="Group" />
                 <ContextBadge active={profile.vibe_preferences.context_preferences.work_lunch.length > 0} icon={Briefcase} label="Work" />
             </div>
          </section>

          {/* Specific Cravings (Dishes) */}
          {sortedDishes.length > 0 && (
             <section>
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
                  <Utensils size={12} /> Top Cravings
                </h3>
                <div className="flex flex-wrap gap-2">
                   {sortedDishes.slice(0, 6).map((d, i) => (
                      <span key={i} className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white font-bold font-mono">
                         {d}
                      </span>
                   ))}
                </div>
             </section>
          )}

          {/* Cuisines */}
          <section>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
              <Heart size={12} /> Top Cuisines
            </h3>
            <div className="flex flex-wrap gap-2">
              {sortedFavorites.length > 0 ? (
                sortedFavorites.slice(0, 8).map((c, i) => (
                  <span key={i} className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-gray-300 font-medium">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-zinc-600 text-xs italic p-2 border border-dashed border-zinc-800 rounded w-full text-center">No favorites yet...</span>
              )}
            </div>
          </section>

          {/* Dietary Information */}
          {(profile.dietary_information.restrictions.length > 0 || profile.dietary_information.allergies.length > 0) && (
             <section>
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
                  <UtensilsCrossed size={12} /> Dietary
                </h3>
                <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg space-y-2">
                    {profile.dietary_information.restrictions.map((r, i) => (
                        <div key={`rest-${i}`} className="flex items-center gap-2 text-xs text-white">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> {r}
                        </div>
                    ))}
                    {profile.dietary_information.allergies.map((a, i) => (
                        <div key={`alg-${i}`} className="flex items-center gap-2 text-xs text-red-300">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> No {a}
                        </div>
                    ))}
                </div>
             </section>
          )}

           {/* Logistics */}
           <section>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
              <MapPin size={12} /> Logistics
            </h3>
            <div className="flex items-center justify-between text-xs bg-nyc-card p-3 rounded border border-nyc-border mb-2">
                <span className="text-zinc-400">Budget Range</span>
                <span className="text-white font-mono font-bold bg-zinc-800 px-2 py-0.5 rounded">{profile.practical_preferences.budget.comfort_level || '??'}</span>
            </div>
             {profile.practical_preferences.neighborhoods.frequented.length > 0 && (
                 <div className="mt-2">
                     <div className="text-[10px] text-zinc-500 mb-1 pl-1 uppercase">Frequented Areas</div>
                     <div className="flex flex-wrap gap-1.5 mb-2">
                         {profile.practical_preferences.neighborhoods.frequented.map((n, i) => (
                             <span key={i} className="text-[10px] text-zinc-300 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">{n}</span>
                         ))}
                     </div>
                 </div>
             )}
              {profile.practical_preferences.neighborhoods.exploration_interest.length > 0 && (
                 <div className="mt-2">
                     <div className="text-[10px] text-zinc-500 mb-1 pl-1 uppercase text-nyc-accent">To Explore</div>
                     <div className="flex flex-wrap gap-1.5">
                         {profile.practical_preferences.neighborhoods.exploration_interest.map((n, i) => (
                             <span key={i} className="text-[10px] text-nyc-black bg-white border border-white px-1.5 py-0.5 rounded font-bold">{n}</span>
                         ))}
                     </div>
                 </div>
             )}
          </section>

          {/* Persona Badge */}
          <section className="mt-6 pt-6 border-t border-nyc-border">
              <div className="bg-gradient-to-br from-zinc-800 to-black p-4 rounded-xl border border-zinc-700 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Brain size={48} />
                  </div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2 font-mono tracking-widest">INFERRED PERSONA</div>
                  <div className="text-sm font-bold text-white uppercase tracking-wide mb-1">
                      {profile.inferred_persona.foodie_level.replace('_', ' ') || "The Explorer"}
                  </div>
                  <div className="text-xs text-zinc-400 capitalize flex items-center gap-2">
                      <span className="w-1 h-1 bg-white rounded-full"></span>
                      {profile.inferred_persona.primary_use_case.replace('_', ' ') || "Discovery"}
                  </div>
              </div>
          </section>

        </div>
        
        <div className="p-4 border-t border-nyc-border bg-nyc-black text-center">
            <p className="text-[9px] text-zinc-600 font-mono">SYSTEM ONLINE • MEMORY ACTIVE</p>
        </div>
      </aside>
    </>
  );
};