import { Tool, Type } from "@google/genai";

export const TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "update_taste_profile",
        description: "Updates the user's taste profile based on interaction signals. Call this when you detect new preferences.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            update_type: { type: Type.STRING, enum: ["image_upload", "text_query", "recommendation_feedback", "explicit_preference"] },
            cuisine_signal: { type: Type.STRING, description: "Cuisine preference detected (e.g. Italian)" },
            dish_signal: { type: Type.STRING, description: "Specific dish preference detected (e.g. Dosa, Ramen, Bagel)" },
            vibe_signals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Vibe keywords detected" },
            fashion_signal: { type: Type.STRING, description: "Fashion aesthetic detected from image (e.g. 'streetwear', 'old_money')" },
            neighborhood_signal: { type: Type.STRING, description: "Neighborhood preference detected" },
            price_signal: { type: Type.STRING, enum: ["$", "$$", "$$$", "$$$$"], description: "Price preference detected" },
            feedback_restaurant: { type: Type.STRING, description: "Restaurant name if providing feedback" },
            feedback_type: { type: Type.STRING, enum: ["clicked", "saved", "ignored", "rejected"] }
          },
          required: ["update_type"]
        }
      },
      {
        name: "search_restaurants",
        description: "Searches the internal database for restaurants matching criteria.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            cuisine: { type: Type.STRING, description: "Cuisine OR Specific Dish (e.g. 'Dosa')" },
            neighborhood: { type: Type.STRING },
            vibe: { type: Type.ARRAY, items: { type: Type.STRING } },
            is_viral: { type: Type.BOOLEAN, description: "Filter for viral/trending spots" },
            price_range: { type: Type.STRING, enum: ["$", "$$", "$$$", "$$$$", "any"] }
          }
        }
      }
    ]
  }
];