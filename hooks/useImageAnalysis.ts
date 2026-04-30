import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { aiService } from "@/services/ai.service";
import type { ImageAnalysisResponse, ImageAnalysisSuggestion } from "@/types/ai";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Erro inesperado";

const getMimeType = (uri: string, explicitType?: string | null) => {
  if (explicitType) return explicitType;
  const lowerUri = uri.toLowerCase();
  if (lowerUri.endsWith(".png")) return "image/png";
  if (lowerUri.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
};

const getSuggestion = (response: ImageAnalysisResponse): ImageAnalysisSuggestion | null =>
  response.suggestion ?? response.food ?? null;

export function useImageAnalysis() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<ImageAnalysisResponse | null>(null);
  const [suggestion, setSuggestion] = useState<ImageAnalysisSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeAsset = useCallback(async (asset: ImagePicker.ImagePickerAsset) => {
    if (!asset.base64) {
      throw new Error("Nao foi possivel ler a imagem em base64.");
    }

    setLoading(true);
    setError(null);
    setImageUri(asset.uri);

    try {
      const response = await aiService.analyzeImage({
        imageBase64: asset.base64,
        mimeType: getMimeType(asset.uri, asset.mimeType),
      });

      setResult(response);
      setSuggestion(getSuggestion(response));
      return response;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError("Permissao de camera negada");
      return null;
    }

    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      base64: true,
      quality: 0.75,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (image.canceled) return null;
    return analyzeAsset(image.assets[0]);
  }, [analyzeAsset]);

  const pickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Permissao de galeria negada");
      return null;
    }

    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      base64: true,
      quality: 0.75,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (image.canceled) return null;
    return analyzeAsset(image.assets[0]);
  }, [analyzeAsset]);

  const reset = useCallback(() => {
    setImageUri(null);
    setResult(null);
    setSuggestion(null);
    setError(null);
  }, []);

  return {
    imageUri,
    result,
    suggestion,
    loading,
    error,
    takePhoto,
    pickImage,
    analyzeAsset,
    reset,
  };
}
