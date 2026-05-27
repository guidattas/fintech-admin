import { z } from "zod";

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const cnpjSchema = z
  .string()
  .min(1, "CNPJ é obrigatório")
  .transform(digitsOnly)
  .refine((v) => v.length === 14, "CNPJ deve ter 14 dígitos");

const cpfSchema = z
  .string()
  .min(1, "CPF é obrigatório")
  .transform(digitsOnly)
  .refine((v) => v.length === 11, "CPF deve ter 11 dígitos");

const cepSchema = z
  .string()
  .min(1, "CEP é obrigatório")
  .transform(digitsOnly)
  .refine((v) => v.length === 8, "CEP deve ter 8 dígitos");

const numericString = z.union([
  z.string().min(1, "Obrigatório"),
  z.number(),
]);

const moneySchema = numericString.transform((value) => {
  if (typeof value === "number") return value;
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
});

export const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ser a sigla (UF)"),
  zipCode: cepSchema,
});

export const responsibleSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: cpfSchema,
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Celular é obrigatório"),
  birthDate: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), {
      message: "Use o formato YYYY-MM-DD",
    }),
});

export const bankingSchema = z.object({
  institution: z.string().min(1, "Instituição é obrigatória"),
  bankCode: z.string().min(1, "Código do banco é obrigatório"),
  branch: z.string().min(1, "Agência é obrigatória"),
  account: z.string().min(1, "Conta é obrigatória"),
  accountType: z.string().min(1, "Tipo de conta é obrigatório"),
});

export const salesPlanSchema = z.object({
  planName: z.string().min(1, "Nome do plano é obrigatório"),
  apiTrigger3ds: moneySchema.refine((v) => v >= 0, "Valor inválido"),
  apiRequired3ds: moneySchema.refine((v) => v >= 0, "Valor inválido"),
});

export const limitSchema = z.object({
  key: z.string().min(1),
  value: moneySchema.refine((v) => v >= 0, "Valor inválido"),
});

export const permissionSchema = z.object({
  name: z.string().min(1),
  enabled: z.boolean(),
});

export const documentSchema = z.object({
  type: z.string().min(1, "Tipo é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  url: z.string().optional().nullable(),
});

export const establishmentSchema = z.object({
  brandName: z.string().min(1, "Nome fantasia é obrigatório"),
  companyName: z.string().min(1, "Razão social é obrigatória"),
  cnpj: cnpjSchema,
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  activationCode: z.string().min(1, "Código de ativação é obrigatório"),
  companyType: z.string().min(1, "Tipo de empresa é obrigatório"),
  accountType: z.string().min(1, "Modalidade de conta é obrigatória"),
  monthlyRevenue: moneySchema.refine(
    (v) => v >= 0,
    "Faturamento deve ser maior ou igual a zero",
  ),
  mcc: z.string().min(1, "MCC é obrigatório"),
  status: z.enum(["ENABLED", "DISABLED"]).default("ENABLED"),
  address: addressSchema,
  responsible: responsibleSchema,
  banking: bankingSchema,
  salesPlan: salesPlanSchema,
  limits: z.array(limitSchema).min(1, "Informe ao menos um limite"),
  permissions: z.array(permissionSchema).min(1),
  documents: z.array(documentSchema).optional(),
});

export type EstablishmentFormInput = z.input<typeof establishmentSchema>;
export type EstablishmentFormOutput = z.output<typeof establishmentSchema>;
