import { apiRequest } from "./api";
import type { AnalyzeImageRequest, ChatRequest, ChatResponse, ImageAnalysisResponse } from "@/types/ai";

export const aiService = {
  analyzeImage(input: AnalyzeImageRequest) {
    return apiRequest<ImageAnalysisResponse>("/ai/analyze-image", {
      method: "POST",
      body: input,
    });
  },

  chat(input: ChatRequest) {
    return apiRequest<ChatResponse>("/ai/chat", {
      method: "POST",
      body: input,
    });
  },
};
