import axios, { AxiosError, type AxiosInstance } from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const TOKEN_STORAGE_KEY = "admin:access-token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem(TOKEN_STORAGE_KEY) ??
    process.env.NEXT_PUBLIC_DEV_TOKEN ??
    null
  );
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

api.interceptors.request.use((config) => {
  const token =
    getStoredToken() ?? process.env.NEXT_PUBLIC_DEV_TOKEN ?? null;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function extractErrorMessage(error: unknown, fallback = "Erro inesperado") {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string | string[]; error?: string }
      | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(", ") : data.message;
    }
    if (data?.error) return data.error;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

// Marketplace API
export const marketplaceApi = {
  listEstablishments: (params?: {
    search?: string;
    filters?: Record<string, any>;
    page?: number;
    perPage?: number;
    sorters?: Array<{ column: string; direction: string }>;
  }) => {
    const config = {
      headers: {
        "integration-key":
          process.env.NEXT_PUBLIC_INTEGRATION_KEY || "",
        "x-token": process.env.NEXT_PUBLIC_X_TOKEN || "",
      },
      params: {
        ...params,
        filters: params?.filters
          ? JSON.stringify(params.filters)
          : undefined,
        sorters: params?.sorters
          ? JSON.stringify(params.sorters)
          : undefined,
      },
    };
    return api.get("/v1/marketplace/establishments", config);
  },

  getEstablishment: (id: string | number) => {
    const config = {
      headers: {
        "integration-key":
          process.env.NEXT_PUBLIC_INTEGRATION_KEY || "",
        "x-token": process.env.NEXT_PUBLIC_X_TOKEN || "",
      },
    };
    return api.get(`/v1/marketplace/establishments/${id}`, config);
  },
};
