export type EstablishmentStatus = "ENABLED" | "DISABLED";

export interface Address {
  id?: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Responsible {
  id?: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
}

export interface Banking {
  id?: string;
  institution: string;
  bankCode: string;
  branch: string;
  account: string;
  accountType: string;
}

export interface SalesPlan {
  id?: string;
  planName: string;
  apiTrigger3ds: number;
  apiRequired3ds: number;
}

export interface Limit {
  id?: string;
  key: string;
  value: number;
}

export interface Permission {
  id?: string;
  name: string;
  enabled: boolean;
}

export interface EstablishmentDocument {
  id?: string;
  type: string;
  name: string;
  url?: string | null;
}

export interface EstablishmentSummary {
  id: string;
  brandName: string;
  companyName: string;
  cnpj: string;
  email: string;
  phone: string;
  activationCode: string;
  companyType: string;
  accountType: string;
  monthlyRevenue: number;
  mcc: string;
  status: EstablishmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Establishment extends EstablishmentSummary {
  address: Address | null;
  responsible: Responsible | null;
  banking: Banking | null;
  salesPlan: SalesPlan | null;
  limits: Limit[];
  permissions: Permission[];
  documents: EstablishmentDocument[];
}

export interface ListEstablishmentsParams {
  search?: string;
  status?: EstablishmentStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateEstablishmentInput {
  brandName: string;
  companyName: string;
  cnpj: string;
  email: string;
  phone: string;
  activationCode: string;
  companyType: string;
  accountType: string;
  monthlyRevenue: number;
  mcc: string;
  status?: EstablishmentStatus;
  address: Address;
  responsible: Responsible;
  banking: Banking;
  salesPlan: SalesPlan;
  limits: Limit[];
  permissions: Permission[];
  documents?: EstablishmentDocument[];
}

export type UpdateEstablishmentInput = Partial<CreateEstablishmentInput>;

export interface PaytimeImportSummary {
  fetched: number;
  created: number;
  updated: number;
  skipped: Array<{ paytimeId: number | null; reason: string }>;
  errors: Array<{ paytimeId: number | null; message: string }>;
}
