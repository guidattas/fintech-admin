import type { EstablishmentStatus } from "@/lib/types/establishment";

export interface LimitCatalogEntry {
  key: string;
  label: string;
  group: "saque" | "transferencia" | "pix" | "boleto" | "transacao";
  helper?: string;
}

export const LIMIT_CATALOG: LimitCatalogEntry[] = [
  { key: "withdrawal_daily", label: "Saque diário", group: "saque" },
  { key: "ted_daily", label: "TED diário", group: "transferencia" },
  { key: "pix_daily", label: "PIX diário", group: "pix" },
  { key: "boleto_daily", label: "Boleto diário", group: "boleto" },
  {
    key: "online_transaction",
    label: "Transação online",
    group: "transacao",
  },
  {
    key: "boleto_portal_issue",
    label: "Emissão de boleto via portal",
    group: "boleto",
  },
  {
    key: "boleto_api_issue",
    label: "Emissão de boleto via API",
    group: "boleto",
  },
];

export interface PermissionCatalogEntry {
  name: string;
  label: string;
  group: "vendas" | "antifraude" | "boletos" | "transferencias" | "outros";
  description?: string;
}

export const PERMISSION_CATALOG: PermissionCatalogEntry[] = [
  { name: "venda online", label: "Venda online", group: "vendas" },
  { name: "venda online api", label: "Venda online (API)", group: "vendas" },
  {
    name: "venda antecipada d+1",
    label: "Venda antecipada D+1",
    group: "vendas",
  },
  {
    name: "venda antecipada d+14",
    label: "Venda antecipada D+14",
    group: "vendas",
  },
  {
    name: "venda antecipada d+30",
    label: "Venda antecipada D+30",
    group: "vendas",
  },
  { name: "antifraude api", label: "Antifraude (API)", group: "antifraude" },
  { name: "antifraude link", label: "Antifraude (Link)", group: "antifraude" },
  { name: "split", label: "Split de pagamentos", group: "outros" },
  { name: "tap on phone", label: "Tap on phone", group: "outros" },
  {
    name: "emitir boleto api",
    label: "Emitir boleto (API)",
    group: "boletos",
  },
  {
    name: "emitir boleto portal",
    label: "Emitir boleto (Portal)",
    group: "boletos",
  },
  {
    name: "pix payout api",
    label: "PIX payout (API)",
    group: "transferencias",
  },
  {
    name: "ted payout api",
    label: "TED payout (API)",
    group: "transferencias",
  },
];

export const PERMISSION_GROUP_LABELS: Record<
  PermissionCatalogEntry["group"],
  string
> = {
  vendas: "Vendas",
  antifraude: "Antifraude",
  boletos: "Boletos",
  transferencias: "Transferências",
  outros: "Outros",
};

export const STATUS_OPTIONS: { value: EstablishmentStatus; label: string }[] = [
  { value: "ENABLED", label: "Habilitado" },
  { value: "DISABLED", label: "Desabilitado" },
];

export const COMPANY_TYPES = ["LTDA", "MEI", "EIRELI", "SA", "EI"] as const;

export const ACCOUNT_TYPES = [
  "Adquirência",
  "Subadquirência",
  "Pagamento",
] as const;

export const ACCOUNT_KINDS = [
  { value: "corrente", label: "Conta corrente" },
  { value: "poupanca", label: "Conta poupança" },
] as const;

export const BRAZIL_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

export const DEFAULT_LIMITS = LIMIT_CATALOG.map((entry) => ({
  key: entry.key,
  value: 0,
}));

export const DEFAULT_PERMISSIONS = PERMISSION_CATALOG.map((entry) => ({
  name: entry.name,
  enabled: false,
}));
