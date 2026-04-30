import type { CreateFoodInput, Food } from "./food";

export interface AnalyzeImageRequest {
  imageBase64: string;
  mimeType: string;
}

export interface ImageAnalysisSuggestion extends Partial<CreateFoodInput> {
  confidence?: number;
  notes?: string;
}

export interface ImageAnalysisResponse {
  suggestion?: ImageAnalysisSuggestion;
  food?: ImageAnalysisSuggestion;
  rawText?: string;
  message?: string;
}

export interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  messages?: ChatMessageInput[];
}

export interface RecipeIdea {
  title?: string;
  name?: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
}

export interface ChatResponse {
  message?: string;
  reply?: string;
  text?: string;
  recipes?: RecipeIdea[];
  recipeIdeas?: RecipeIdea[];
  warnings?: string[];
  alerts?: string[];
  prioritizedFoods?: Food[];
  priorityFoods?: Food[];
}
