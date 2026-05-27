"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Square, RotateCcw, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerConfig {
  name: string;
  runtimeExecutable: string;
  runtimeArgs: string[];
  port: number;
  cwd: string;
  env?: Record<string, string>;
}

interface ServerStatus {
  name: string;
  status: "running" | "stopped" | "unknown";
  port: number;
  pid?: number;
  error?: string;
}

async function fetchServerConfigs(): Promise<ServerConfig[]> {
  try {
    const response = await fetch("/api/dev-servers/configs");
    if (!response.ok) throw new Error("Failed to fetch server configs");
    return response.json();
  } catch (error) {
    console.error("Error fetching server configs:", error);
    return [];
  }
}

async function fetchServerStatuses(): Promise<ServerStatus[]> {
  try {
    const response = await fetch("/api/dev-servers/status");
    if (!response.ok) throw new Error("Failed to fetch server statuses");
    return response.json();
  } catch (error) {
    console.error("Error fetching server statuses:", error);
    return [];
  }
}

async function startServer(serverName: string): Promise<void> {
  const response = await fetch("/api/dev-servers/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: serverName }),
  });
  if (!response.ok) throw new Error("Failed to start server");
}

async function stopServer(serverName: string): Promise<void> {
  const response = await fetch("/api/dev-servers/stop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: serverName }),
  });
  if (!response.ok) throw new Error("Failed to stop server");
}

async function restartServer(serverName: string): Promise<void> {
  const response = await fetch("/api/dev-servers/restart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: serverName }),
  });
  if (!response.ok) throw new Error("Failed to restart server");
}

export function ServerManager() {
  const queryClient = useQueryClient();
  const [configs, setConfigs] = useState<ServerConfig[]>([]);

  // Fetch server configurations once
  useEffect(() => {
    fetchServerConfigs().then(setConfigs);
  }, []);

  // Fetch server statuses with polling
  const { data: statuses = [], isLoading } = useQuery({
    queryKey: ["dev-servers-status"],
    queryFn: fetchServerStatuses,
    refetchInterval: 3000,
    refetchOnWindowFocus: false,
  });

  const startMutation = useMutation({
    mutationFn: startServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dev-servers-status"] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: stopServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dev-servers-status"] });
    },
  });

  const restartMutation = useMutation({
    mutationFn: restartServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dev-servers-status"] });
    },
  });

  const getStatusColor = (status: ServerStatus["status"]) => {
    switch (status) {
      case "running":
        return "bg-green-50 border-green-200";
      case "stopped":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusBadgeVariant = (status: ServerStatus["status"]) => {
    switch (status) {
      case "running":
        return "success";
      case "stopped":
        return "secondary";
      default:
        return "warning";
    }
  };

  const getStatusIcon = (status: ServerStatus["status"]) => {
    switch (status) {
      case "running":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "stopped":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (configs.length === 0 && !isLoading) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          Nenhuma configuração de servidor encontrada em .claude/launch.json
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {configs.map((config) => {
        const status = statuses.find((s) => s.name === config.name);
        const isLoading_local =
          startMutation.isPending ||
          stopMutation.isPending ||
          restartMutation.isPending;

        return (
          <div
            key={config.name}
            className={cn(
              "rounded-lg border p-6 transition-colors",
              getStatusColor(status?.status || "unknown")
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {config.name}
                  </h3>
                  {isLoading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <>
                      {getStatusIcon(status?.status || "unknown")}
                      <Badge variant={getStatusBadgeVariant(status?.status || "unknown")}>
                        {status?.status === "running" && "Rodando"}
                        {status?.status === "stopped" && "Parado"}
                        {status?.status === "unknown" && "Desconhecido"}
                      </Badge>
                    </>
                  )}
                </div>

                <div className="mt-3 space-y-1 text-sm text-zinc-600">
                  <p>
                    <span className="font-medium">Comando:</span> {config.runtimeExecutable}{" "}
                    {config.runtimeArgs.join(" ")}
                  </p>
                  <p>
                    <span className="font-medium">Porta:</span> {config.port}
                  </p>
                  <p>
                    <span className="font-medium">Diretório:</span> {config.cwd}
                  </p>
                  {status?.pid && (
                    <p>
                      <span className="font-medium">PID:</span> {status.pid}
                    </p>
                  )}
                </div>

                {status?.error && (
                  <div className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">
                    {status.error}
                  </div>
                )}
              </div>

              <div className="ml-4 flex gap-2">
                <Button
                  size="sm"
                  variant={status?.status === "running" ? "outline" : "default"}
                  onClick={() => startMutation.mutate(config.name)}
                  disabled={
                    status?.status === "running" ||
                    isLoading_local ||
                    isLoading
                  }
                >
                  <Play className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Iniciar</span>
                </Button>

                <Button
                  size="sm"
                  variant={status?.status === "stopped" ? "outline" : "destructive"}
                  onClick={() => stopMutation.mutate(config.name)}
                  disabled={
                    status?.status === "stopped" ||
                    isLoading_local ||
                    isLoading
                  }
                >
                  <Square className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Parar</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => restartMutation.mutate(config.name)}
                  disabled={isLoading_local || isLoading}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Reiniciar</span>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
