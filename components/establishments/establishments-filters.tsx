"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { EstablishmentStatus } from "@/lib/types/establishment";

interface EstablishmentsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: EstablishmentStatus | "ALL";
  onStatusChange: (value: EstablishmentStatus | "ALL") => void;
  onClear?: () => void;
  hasActiveFilters?: boolean;
}

export function EstablishmentsFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onClear,
  hasActiveFilters,
}: EstablishmentsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nome, razão social, CNPJ, email ou código"
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="w-44">
          <Select
            value={status}
            onValueChange={(value) =>
              onStatusChange(value as EstablishmentStatus | "ALL")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="ENABLED">Habilitados</SelectItem>
              <SelectItem value="DISABLED">Desabilitados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4" />
            Limpar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
