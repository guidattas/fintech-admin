import { api } from "@/lib/api";
import type {
  CreateEstablishmentInput,
  Establishment,
  EstablishmentSummary,
  ListEstablishmentsParams,
  PaginatedResponse,
  PaytimeImportSummary,
  UpdateEstablishmentInput,
} from "@/lib/types/establishment";

const RESOURCE = "/establishments";

export async function listEstablishments(
  params: ListEstablishmentsParams = {},
): Promise<PaginatedResponse<EstablishmentSummary>> {
  const { data } = await api.get<PaginatedResponse<EstablishmentSummary>>(
    RESOURCE,
    { params },
  );
  return data;
}

export async function getEstablishment(id: string): Promise<Establishment> {
  const { data } = await api.get<Establishment>(`${RESOURCE}/${id}`);
  return data;
}

export async function createEstablishment(
  input: CreateEstablishmentInput,
): Promise<Establishment> {
  const { data } = await api.post<Establishment>(RESOURCE, input);
  return data;
}

export async function updateEstablishment(
  id: string,
  input: UpdateEstablishmentInput,
): Promise<Establishment> {
  const { data } = await api.patch<Establishment>(`${RESOURCE}/${id}`, input);
  return data;
}

export async function deleteEstablishment(id: string): Promise<void> {
  await api.delete(`${RESOURCE}/${id}`);
}

export async function importEstablishmentsFromPaytime(): Promise<PaytimeImportSummary> {
  const { data } = await api.post<PaytimeImportSummary>(
    `${RESOURCE}/import/paytime`,
  );
  return data;
}
