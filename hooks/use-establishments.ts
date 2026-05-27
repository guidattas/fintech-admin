"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { extractErrorMessage } from "@/lib/api";
import {
  createEstablishment,
  deleteEstablishment,
  getEstablishment,
  importEstablishmentsFromPaytime,
  listEstablishments,
  updateEstablishment,
} from "@/lib/services/establishments";
import type {
  CreateEstablishmentInput,
  ListEstablishmentsParams,
  UpdateEstablishmentInput,
} from "@/lib/types/establishment";

export const establishmentsKeys = {
  all: ["establishments"] as const,
  lists: () => [...establishmentsKeys.all, "list"] as const,
  list: (params: ListEstablishmentsParams) =>
    [...establishmentsKeys.lists(), params] as const,
  details: () => [...establishmentsKeys.all, "detail"] as const,
  detail: (id: string) => [...establishmentsKeys.details(), id] as const,
};

export function useEstablishmentsList(params: ListEstablishmentsParams = {}) {
  return useQuery({
    queryKey: establishmentsKeys.list(params),
    queryFn: () => listEstablishments(params),
    placeholderData: keepPreviousData,
  });
}

export function useEstablishment(id: string | undefined) {
  return useQuery({
    queryKey: establishmentsKeys.detail(id ?? ""),
    queryFn: () => getEstablishment(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateEstablishment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEstablishmentInput) => createEstablishment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: establishmentsKeys.lists() });
      toast.success("Estabelecimento criado");
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateEstablishment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateEstablishmentInput) =>
      updateEstablishment(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: establishmentsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: establishmentsKeys.detail(id),
      });
      toast.success("Estabelecimento atualizado");
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteEstablishment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEstablishment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: establishmentsKeys.lists() });
      toast.success("Estabelecimento removido");
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useImportPaytimeEstablishments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => importEstablishmentsFromPaytime(),
    onSuccess: (summary) => {
      queryClient.invalidateQueries({ queryKey: establishmentsKeys.lists() });
      const parts = [
        `${summary.created} criados`,
        `${summary.updated} atualizados`,
      ];
      if (summary.skipped.length) parts.push(`${summary.skipped.length} pulados`);
      if (summary.errors.length) parts.push(`${summary.errors.length} erros`);
      toast.success(`Importação concluída · ${parts.join(" · ")}`);
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
