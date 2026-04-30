import { useCallback, useState } from "react";

import { aiService } from "@/services/ai.service";
import type { ChatResponse, RecipeIdea } from "@/types/ai";
import type { Food } from "@/types/food";

export interface ChatUiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recipes?: RecipeIdea[];
  warnings?: string[];
  prioritizedFoods?: Food[];
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Erro inesperado";

const getAssistantContent = (response: ChatResponse) =>
  response.message ?? response.reply ?? response.text ?? "Nao encontrei uma resposta.";

export function useChat() {
  const [messages, setMessages] = useState<ChatUiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim();
      if (!trimmedContent || loading) return;

      const userMessage: ChatUiMessage = {
        id: `${Date.now()}-user`,
        role: "user",
        content: trimmedContent,
      };

      setMessages((currentMessages) => [...currentMessages, userMessage]);
      setLoading(true);
      setError(null);

      try {
        const response = await aiService.chat({
          message: trimmedContent,
          messages: [...messages, userMessage].map((message) => ({
            role: message.role,
            content: message.content,
          })),
        });

        const assistantMessage: ChatUiMessage = {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: getAssistantContent(response),
          recipes: response.recipes ?? response.recipeIdeas,
          warnings: response.warnings ?? response.alerts,
          prioritizedFoods: response.prioritizedFoods ?? response.priorityFoods,
        };

        setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  const clear = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clear };
}
