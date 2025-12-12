export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string
  timestamp: Date;
  structuredData?: {
    type: 'recommendations' | 'weekly_picks' | 'itinerary' | 'image_analysis';
    data: any;
  };
}

export interface Restaurant {
  name: string;
  neighborhood: string;
  cuisine: string;
  price: string;
  rating?: number;
  vibe: string[];
  is_viral?: boolean; // New Social Proof flag
  signature_dish?: string;
  why_for_you?: string;
  pro_tip?: string;
  wait_time?: string;
  best_time?: string;
  is_adventure_pick?: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface WeeklyPicks {
  generated_date: string;
  new_spots: Restaurant[];
  hidden_gem: Restaurant;
  dessert_of_week: Restaurant;
  adventure: Restaurant;
}

export interface ItineraryStop {
  stop_number?: number;
  time?: string;
  name?: string;
  walking_time?: string;
  walking_description?: string;
  type?: string;
  what_to_get?: string;
  why_here?: string;
  budget?: string;
  duration?: string;
}

export interface Itinerary {
  title: string;
  duration: string;
  total_cost_estimate: string;
  neighborhoods: string[];
  stops: ItineraryStop[];
  tips: string[];
}

export interface TasteProfile {
  profile_metadata: {
    session_id: string;
    created_at: string;
    last_updated: string;
    total_interactions: number;
    total_images_analyzed: number;
    total_recommendations_given: number;
  };
  
  cuisine_intelligence: {
    favorites: Record<string, number>; // Cuisine -> Score
    dish_preferences: Record<string, number>; // Specific Dish (e.g., "Dosa", "Ramen") -> Score
    dislikes: Record<string, number>; // Cuisine -> Count
    never_tried: string[];
    curious_about: string[];
    cuisine_history: string[];
  };
  
  flavor_profile: {
    spice_tolerance: {
      level: "unknown" | "mild" | "medium" | "spicy" | "very_spicy";
      confidence: number;
      data_points: string[];
    };
    sweetness: {
      preference: "unknown" | "loves_sweet" | "moderate" | "avoids_sweet";
      confidence: number;
      data_points: string[];
    };
    savory_umami: {
      preference: "unknown" | "umami_seeker" | "neutral";
      confidence: number;
      data_points: string[];
    };
    texture_preferences: string[];
    temperature_preferences: string[];
    cooking_style_preferences: string[];
  };
  
  dietary_information: {
    restrictions: string[];
    allergies: string[];
    avoidances: string[];
    preferences: string[];
    health_focus: "unknown" | "healthy_eating" | "indulgent" | "balanced";
  };
  
  vibe_preferences: {
    favorite_vibes: Record<string, number>;
    disliked_vibes: string[];
    fashion_aesthetic: string[]; // New: Tracks user style (Streetwear, Formal, etc.)
    context_preferences: {
      date_night: string[];
      solo_dining: string[];
      group_outings: string[];
      work_lunch: string[];
      special_occasion: string[];
    };
    ambience_factors: {
      noise_preference: string;
      lighting_preference: string;
      seating_preference: string[];
      music_preference: string;
    };
  };
  
  practical_preferences: {
    budget: {
      comfort_level: string; // $, $$, etc
      max_special_occasion: string;
      typical_meal: string;
      confidence: number;
    };
    wait_tolerance: {
      level: string;
      willing_to_reserve: string;
      data_points: string[];
    };
    neighborhoods: {
      favorites: string[];
      frequented: string[];
      avoided: string[];
      home_area: string;
      exploration_interest: string[];
    };
    timing: {
      typical_meal_times: string[];
      day_preferences: string[];
      advance_planning: string;
    };
    transportation: {
      method: string;
      max_travel_time: string;
    };
  };
  
  interaction_history: {
    images_uploaded: { description: string, timestamp: string }[];
    text_queries: any[];
    recommendations_given: any[];
    restaurants_saved: string[];
    restaurants_rejected: string[];
    itineraries_generated: any[];
  };
  
  weekly_tracking: {
    current_week_start: string;
    suggested_this_week: string[];
    weekly_picks_generated: boolean;
    last_weekly_picks_date: string;
  };
  
  inferred_persona: {
    foodie_level: string;
    social_dining_style: string;
    discovery_style: string;
    primary_use_case: string;
  };
}

export const INITIAL_PROFILE: TasteProfile = {
  profile_metadata: {
    session_id: `AKHIL_NYC_V1`,
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    total_interactions: 0,
    total_images_analyzed: 0,
    total_recommendations_given: 0
  },
  cuisine_intelligence: {
    favorites: {},
    dish_preferences: {},
    dislikes: {},
    never_tried: ["Ethiopian", "Georgian", "Peruvian", "Filipino", "Scandinavian", "Turkish", "Malaysian", "Burmese"],
    curious_about: [],
    cuisine_history: []
  },
  flavor_profile: {
    spice_tolerance: { level: "unknown", confidence: 0, data_points: [] },
    sweetness: { preference: "unknown", confidence: 0, data_points: [] },
    savory_umami: { preference: "unknown", confidence: 0, data_points: [] },
    texture_preferences: [],
    temperature_preferences: [],
    cooking_style_preferences: []
  },
  dietary_information: {
    restrictions: [],
    allergies: [],
    avoidances: [],
    preferences: [],
    health_focus: "unknown"
  },
  vibe_preferences: {
    favorite_vibes: {},
    disliked_vibes: [],
    fashion_aesthetic: [],
    context_preferences: { date_night: [], solo_dining: [], group_outings: [], work_lunch: [], special_occasion: [] },
    ambience_factors: { noise_preference: "unknown", lighting_preference: "unknown", seating_preference: [], music_preference: "unknown" }
  },
  practical_preferences: {
    budget: { comfort_level: "unknown", max_special_occasion: "", typical_meal: "", confidence: 0 },
    wait_tolerance: { level: "unknown", willing_to_reserve: "unknown", data_points: [] },
    neighborhoods: { favorites: [], frequented: [], avoided: [], home_area: "unknown", exploration_interest: [] },
    timing: { typical_meal_times: [], day_preferences: [], advance_planning: "unknown" },
    transportation: { method: "unknown", max_travel_time: "unknown" }
  },
  interaction_history: {
    images_uploaded: [],
    text_queries: [],
    recommendations_given: [],
    restaurants_saved: [],
    restaurants_rejected: [],
    itineraries_generated: []
  },
  weekly_tracking: {
    current_week_start: new Date().toISOString(),
    suggested_this_week: [],
    weekly_picks_generated: false,
    last_weekly_picks_date: ""
  },
  inferred_persona: {
    foodie_level: "unknown",
    social_dining_style: "unknown",
    discovery_style: "unknown",
    primary_use_case: "unknown"
  }
};

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  profile: TasteProfile;
}