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

// Em caso de 401, limpa a sessão e redireciona para o login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error instanceof AxiosError &&
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      setStoredToken(null);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

/**
 * Sessão = token de login real salvo no localStorage.
 * Não considera o NEXT_PUBLIC_DEV_TOKEN (conveniência de dev),
 * para que o guard de rota sempre exija autenticação.
 */
export function hasSession(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export interface LoginResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user?: { id: string; name: string; email: string };
}

export const authApi = {
  // Mesmo fluxo do web: tenta login de representante (validado via Paytime API)
  // e, se falhar, cai para o login de usuário comum.
  login: async (email: string, password: string) => {
    try {
      return await api.post<LoginResponse>("/auth/login-representante", {
        email,
        password,
      });
    } catch {
      return await api.post<LoginResponse>("/auth/login", { email, password });
    }
  },
};

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

// Marketplace API — proxied pelo backend (JWT), credenciais Paytime ficam server-side
export const marketplaceApi = {
  listEstablishments: (params?: {
    search?: string;
    filters?: Record<string, any>;
    page?: number;
    perPage?: number;
    sorters?: Array<{ column: string; direction: string }>;
  }) => {
    const config = {
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
    return api.get("/paytime/establishments", config);
  },

  getEstablishment: (id: string | number) => {
    return api.get(`/paytime/establishments/${id}`);
  },
};
