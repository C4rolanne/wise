import { Platform } from "react-native";

import { supabase } from "@/services/supabase";
import type { ApiErrorBody } from "@/types/api";

const defaultApiUrl =
  Platform.OS === "android" ? "http://10.0.2.2:3001/api" : "http://localhost:3001/api";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? defaultApiUrl;

export class ApiError extends Error {
  status: number;
  body?: ApiErrorBody;

  constructor(status: number, message: string, body?: ApiErrorBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type QueryValue = string | number | boolean | null | undefined;

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Record<string, QueryValue>;
  authenticated?: boolean;
}

const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const parseResponseBody = async (response: Response) => {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError(response.status, "Resposta invalida recebida do servidor");
  }
};

const parseErrorMessage = (body: ApiErrorBody | undefined, fallback: string) => {
  if (!body) return fallback;
  if (Array.isArray(body.message)) return body.message.join("\n");
  return body.message ?? body.error ?? fallback;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, query, authenticated = true, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Content-Type") && body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      throw new ApiError(401, "Usuario nao autenticado", { code: "UNAUTHENTICATED" });
    }

    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, query), {
    ...requestOptions,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const responseBody = (await parseResponseBody(response)) as ApiErrorBody | T | undefined;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      parseErrorMessage(responseBody as ApiErrorBody | undefined, "Erro ao comunicar com o servidor"),
      responseBody as ApiErrorBody | undefined,
    );
  }

  return responseBody as T;
}
