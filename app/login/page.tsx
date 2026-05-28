"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { authApi, extractErrorMessage, setStoredToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await authApi.login(email, password);
      const token = data.accessToken ?? data.token;
      if (!token) {
        setError("Token não recebido do servidor.");
        setLoading(false);
        return;
      }
      setStoredToken(token);
      router.replace("/");
    } catch (err) {
      setError(extractErrorMessage(err, "Falha ao autenticar."));
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Fintech Admin</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Entre com suas credenciais para acessar o painel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="voce@empresa.com.br"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-md border-l-4 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Autenticando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
