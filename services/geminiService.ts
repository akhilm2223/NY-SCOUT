import { GoogleGenAI, Chat, Part } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { TOOLS } from "./tools";
import { updateTasteProfile, searchRestaurants } from "../utils/profileLogic";
import { TasteProfile } from "../types";

let chatSession: Chat | null = null;
let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing from environment variables");
      throw new Error("API Key not found");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

// New Service: Generate Embeddings for RAG
export const getEmbedding = async (text: string): Promise<number[]> => {
  const aiInstance = getAI();
  // Using text-embedding-004 model
  const result = await aiInstance.models.embedContent({
    model: "text-embedding-004",
    contents: text,
  });
  
  // Robust check for singular (embedding) or plural (embeddings) depending on SDK version/response
  // Type casting 'any' to handle potential SDK mismatch
  const embeddingValues = (result as any).embedding?.values || (result as any).embeddings?.[0]?.values;

  if (!embeddingValues) {
    throw new Error("Failed to generate embedding: No values returned from API");
  }
  return embeddingValues;
};

export const initializeChat = async () => {
  const aiInstance = getAI();
  try {
    chatSession = aiInstance.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        tools: TOOLS,
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    throw error;
  }
};

export const sendMessageToGemini = async (
  text: string, 
  currentProfile: TasteProfile,
  imageBase64?: string
): Promise<{ text: string, newProfile?: TasteProfile }> => {
  
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
      throw new Error("Chat session could not be initialized");
  }

  try {
    // Inject current profile context
    const profileContext = `\n\n[CURRENT_PROFILE_CONTEXT]\n${JSON.stringify(currentProfile, null, 2)}\n[END_CONTEXT]\n`;
    
    const parts: Part[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      });
    }
    parts.push({ text: profileContext + (text || "Analyze this image and recommend similar NYC spots.") });

    let result = await chatSession.sendMessage({
       message: parts
    });

    let finalResponseText = "";
    let updatedProfile: TasteProfile | undefined = undefined;
    let localProfile = structuredClone(currentProfile); // Track updates locally during turn

    // Handle Function Calls Loop
    while (result.functionCalls && result.functionCalls.length > 0) {
      const responseParts: Part[] = [];
      
      for (const call of result.functionCalls) {
        console.log("Tool Call:", call.name, call.args);
        
        let responseContent: any = { result: "Success" };

        if (call.name === "update_taste_profile") {
           localProfile = updateTasteProfile(localProfile, call.args as any);
           updatedProfile = localProfile; // Mark that we have an update
           responseContent = { result: "Profile Updated Successfully", updated_snapshot: "Profile updated." };
        } else if (call.name === "search_restaurants") {
           // Async RAG call
           try {
              const results = await searchRestaurants(localProfile, call.args as any);
              responseContent = { results: results };
           } catch (e) {
              console.error("Search failed", e);
              responseContent = { error: "Search failed due to database connection." };
           }
        }

        responseParts.push({
          functionResponse: {
            name: call.name,
            id: call.id,
            response: responseContent
          }
        });
      }

      // Send result back to model
      result = await chatSession.sendMessage({
        message: responseParts
      });
    }
    
    finalResponseText = result.text || "";

    return {
      text: finalResponseText,
      newProfile: updatedProfile
    };

  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return { text: "Sorry, I had trouble connecting to the NYC grid. Please try again." };
  }
};