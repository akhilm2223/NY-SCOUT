import { TasteProfile, Restaurant } from "../types";
import { supabase } from "../services/supabaseClient";
import { getEmbedding } from "../services/geminiService";

// Fallback Mock Data to ensure app functionality if DB is offline/unconfigured
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    name: "L'Artusi",
    neighborhood: "West Village",
    cuisine: "Italian",
    price: "$$$",
    rating: 4.7,
    vibe: ["romantic", "lively", "upscale casual", "date night"],
    signature_dish: "Roasted Mushroom Garganelli",
    why_for_you: "A quintessential West Village pasta destination that perfectly balances energy and elegance.",
    pro_tip: "Walk-in seats at the chef's counter are often available if you arrive right at 5pm.",
    wait_time: "Reservation required",
    best_time: "5:00 PM or 10:00 PM",
    coordinates: { lat: 40.7338, lng: -74.0051 }
  },
  {
    name: "Win Son",
    neighborhood: "East Williamsburg",
    cuisine: "Taiwanese-American",
    price: "$$",
    rating: 4.5,
    vibe: ["cool", "loud", "trendy", "casual"],
    signature_dish: "Fly's Head with Pork & Chives",
    why_for_you: "Bold flavors and a high-energy atmosphere that captures the modern Brooklyn dining scene.",
    pro_tip: "Put your name down and grab a donut at their bakery across the street while you wait.",
    wait_time: "45-90 min",
    best_time: "Late night (after 9pm)",
    coordinates: { lat: 40.7072, lng: -73.9406 }
  },
  {
    name: "Double Chicken Please",
    neighborhood: "Lower East Side",
    cuisine: "Cocktails/Sandwiches",
    price: "$$",
    rating: 4.8,
    vibe: ["industrial", "vibrant", "innovative", "viral"],
    signature_dish: "Hot Honey Chicken Sandwich",
    why_for_you: "Voted one of the world's best bars, offering incredible food in a design-forward space.",
    pro_tip: "The front room (Free Coop) is walk-in only and serves the famous sandwiches.",
    wait_time: "60+ min",
    best_time: "Weekdays 5pm",
    coordinates: { lat: 40.7186, lng: -73.9916 }
  },
  {
    name: "Rubirosa",
    neighborhood: "Nolita",
    cuisine: "Italian/Pizza",
    price: "$$",
    rating: 4.6,
    vibe: ["cozy", "dimly lit", "classic", "family friendly"],
    signature_dish: "Tie-Dye Pizza",
    why_for_you: "A cozy, classic NYC red-sauce joint famous for its thin crust pizza.",
    pro_tip: "The vodka sauce pizza is non-negotiable.",
    wait_time: "30-60 min",
    best_time: "Lunch or late night",
    coordinates: { lat: 40.7227, lng: -73.9960 }
  },
  {
    name: "Kiki's",
    neighborhood: "Dimes Square",
    cuisine: "Greek",
    price: "$$",
    rating: 4.4,
    vibe: ["rustic", "trendy", "lively", "low-key"],
    signature_dish: "Grilled Octopus",
    why_for_you: "Effortlessly cool vibe with great prices and authentic food. A local favorite.",
    pro_tip: "There is no sign outside. Look for the Chinese sign from the previous tenant.",
    wait_time: "30-45 min",
    best_time: "Pre-7pm",
    coordinates: { lat: 40.7145, lng: -73.9915 }
  }
];

export const updateTasteProfile = (
  profile: TasteProfile,
  args: {
    update_type: string;
    cuisine_signal?: string;
    dish_signal?: string;
    vibe_signals?: string[];
    fashion_signal?: string;
    neighborhood_signal?: string;
    price_signal?: string;
    dietary_signals?: string[];
    feedback_restaurant?: string;
    feedback_type?: string;
    description?: string; // For image uploads
  }
): TasteProfile => {
  const newProfile = structuredClone(profile);
  const timestamp = new Date().toISOString();
  newProfile.profile_metadata.last_updated = timestamp;
  newProfile.profile_metadata.total_interactions += 1;

  // Image Analysis Storage
  if (args.update_type === 'image_upload') {
      newProfile.profile_metadata.total_images_analyzed += 1;
      
      const desc = args.description || `Analyzed ${args.cuisine_signal ? 'food' : args.fashion_signal ? 'outfit' : 'image'}`;
      newProfile.interaction_history.images_uploaded.push({
          description: desc,
          timestamp: timestamp
      });

      // Heavy boost for image signals
      if (args.cuisine_signal) {
          const c = args.cuisine_signal;
          newProfile.cuisine_intelligence.favorites[c] = (newProfile.cuisine_intelligence.favorites[c] || 0) + 20;
      }
      if (args.dish_signal) {
          const d = args.dish_signal;
          // Initialize dish_preferences if it doesn't exist
          if (!newProfile.cuisine_intelligence.dish_preferences) newProfile.cuisine_intelligence.dish_preferences = {};
          newProfile.cuisine_intelligence.dish_preferences[d] = (newProfile.cuisine_intelligence.dish_preferences[d] || 0) + 20;
      }
      if (args.vibe_signals) {
          args.vibe_signals.forEach(v => {
              newProfile.vibe_preferences.favorite_vibes[v] = (newProfile.vibe_preferences.favorite_vibes[v] || 0) + 15;
          });
      }
      // Fashion Signal Tracking
      if (args.fashion_signal) {
          if (!newProfile.vibe_preferences.fashion_aesthetic) {
              newProfile.vibe_preferences.fashion_aesthetic = [];
          }
          if (!newProfile.vibe_preferences.fashion_aesthetic.includes(args.fashion_signal)) {
              newProfile.vibe_preferences.fashion_aesthetic.push(args.fashion_signal);
          }
      }
  }

  // Cuisine Updates
  if (args.cuisine_signal) {
    const cuisine = args.cuisine_signal;
    const currentScore = newProfile.cuisine_intelligence.favorites[cuisine] || 0;
    
    newProfile.cuisine_intelligence.favorites[cuisine] = currentScore + 10;
    
    if (!newProfile.cuisine_intelligence.cuisine_history.includes(cuisine)) {
      newProfile.cuisine_intelligence.cuisine_history.push(cuisine);
    }
    const neverTriedIndex = newProfile.cuisine_intelligence.never_tried.indexOf(cuisine);
    if (neverTriedIndex > -1) {
      newProfile.cuisine_intelligence.never_tried.splice(neverTriedIndex, 1);
    }
  }

  // Specific Dish Updates
  if (args.dish_signal) {
    const dish = args.dish_signal;
    if (!newProfile.cuisine_intelligence.dish_preferences) newProfile.cuisine_intelligence.dish_preferences = {};
    const currentScore = newProfile.cuisine_intelligence.dish_preferences[dish] || 0;
    newProfile.cuisine_intelligence.dish_preferences[dish] = currentScore + 15;
  }

  // Vibe Updates
  if (args.vibe_signals && Array.isArray(args.vibe_signals)) {
    args.vibe_signals.forEach(vibe => {
      const currentScore = newProfile.vibe_preferences.favorite_vibes[vibe] || 0;
      newProfile.vibe_preferences.favorite_vibes[vibe] = currentScore + 8;
    });
  }

  // Neighborhood Updates
  if (args.neighborhood_signal) {
    const hood = args.neighborhood_signal;
    if (!newProfile.practical_preferences.neighborhoods.frequented.includes(hood)) {
      newProfile.practical_preferences.neighborhoods.frequented.push(hood);
    }
  }

  // Price Updates
  if (args.price_signal) {
     newProfile.practical_preferences.budget.comfort_level = args.price_signal;
     newProfile.practical_preferences.budget.confidence += 10;
  }

  // Recommendation Feedback
  if (args.feedback_type && args.feedback_restaurant) {
    newProfile.profile_metadata.total_recommendations_given += 1;
    
    if (!newProfile.weekly_tracking.suggested_this_week.includes(args.feedback_restaurant)) {
        newProfile.weekly_tracking.suggested_this_week.push(args.feedback_restaurant);
    }

    if (args.feedback_type === 'saved' || args.feedback_type === 'clicked') {
        if (!newProfile.interaction_history.restaurants_saved.includes(args.feedback_restaurant)) {
            newProfile.interaction_history.restaurants_saved.push(args.feedback_restaurant);
        }
    } else if (args.feedback_type === 'rejected') {
        if (!newProfile.interaction_history.restaurants_rejected.includes(args.feedback_restaurant)) {
            newProfile.interaction_history.restaurants_rejected.push(args.feedback_restaurant);
        }
    }
  }

  return newProfile;
};

// Phase 2: RAG Search Implementation with Fallback
export const searchRestaurants = async (
  profile: TasteProfile,
  criteria: {
    cuisine?: string;
    neighborhood?: string;
    vibe?: string[];
    price_range?: string;
    is_viral?: boolean;
  }
): Promise<Restaurant[]> => {
  
  try {
      // 1. Construct a "Semantic Query"
      let semanticQuery = "";
      
      if (criteria.cuisine) semanticQuery += `best ${criteria.cuisine} food `;
      if (criteria.neighborhood) semanticQuery += `in ${criteria.neighborhood} `;
      if (criteria.vibe && criteria.vibe.length > 0) semanticQuery += `with ${criteria.vibe.join(" ")} vibe `;
      if (criteria.is_viral) semanticQuery += `trending viral spot `;
      
      if (!semanticQuery.trim()) semanticQuery = "best restaurants in NYC";

      console.log("Generating embedding for:", semanticQuery);

      // 2. Generate Embedding
      const embedding = await getEmbedding(semanticQuery);

      // 3. RPC Call to Supabase
      // Using a lower threshold (0.2) to match loosely if data is sparse
      const { data: matchedRestaurants, error: rpcError } = await supabase.rpc('match_restaurants', {
        query_embedding: embedding,
        match_threshold: 0.2, 
        match_count: 5
      });

      if (rpcError) {
        // Detailed logging to debug the "Object" error
        console.error("Supabase RPC Error Details:", JSON.stringify(rpcError, null, 2));
        console.warn("Falling back to local mock data due to DB error.");
        return MOCK_RESTAURANTS;
      }

      if (!matchedRestaurants || matchedRestaurants.length === 0) {
        console.log("No semantic matches found via RAG. Returning Mock Data fallback.");
        return MOCK_RESTAURANTS;
      }

      // 4. Map to Frontend 'Restaurant' Type
      const mappedResults: Restaurant[] = matchedRestaurants.map((r: any) => {
          return {
             name: r.name,
             neighborhood: r.neighborhood || "NYC",
             cuisine: r.cuisine || "Various",
             price: r.price_tier || "$$",
             rating: Number(r.rating) || 4.5,
             vibe: (r.vibes && r.vibes.length > 0) ? r.vibes : (r.cuisine ? [r.cuisine] : ["Good Vibes"]), 
             is_viral: r.is_viral || false,
             signature_dish: r.signature_dish,
             why_for_you: r.description, 
             pro_tip: r.pro_tip || "Check recent reviews for wait times.",
             wait_time: r.wait_time_typical || "Unknown",
             best_time: r.best_time_to_go || "Early evening",
             coordinates: r.coordinates || { lat: 40.73, lng: -73.99 } 
          };
      });

      return mappedResults;

  } catch (err) {
      console.error("RAG Search failed unexpectedly:", err);
      // Fail safely to mock data so the demo doesn't break
      return MOCK_RESTAURANTS;
  }
};