"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ACCOUNT_TYPES,
  COMPANY_TYPES,
  STATUS_OPTIONS,
} from "@/lib/constants/establishment";
import type { EstablishmentFormInput } from "@/lib/validation/establishment";
import { FormField } from "@/components/establishments/form/form-field";
import { SectionCard } from "@/components/establishments/form/section-card";

export function MainSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EstablishmentFormInput>();

  const status = watch("status");
  const companyType = watch("companyType");
  const accountType = watch("accountType");

  return (
    <SectionCard
      title="Dados principais"
      description="Informações de cadastro do estabelecimento."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Nome fantasia"
          htmlFor="brandName"
          required
          error={errors.brandName?.message}
        >
          <Input
            id="brandName"
            placeholder="Ex.: DATTAS"
            invalid={Boolean(errors.brandName)}
            {...register("brandName")}
          />
        </FormField>

        <FormField
          label="Razão social"
          htmlFor="companyName"
          required
          error={errors.companyName?.message}
        >
          <Input
            id="companyName"
            placeholder="Ex.: DATTAS INTERNET LTDA"
            invalid={Boolean(errors.companyName)}
            {...register("companyName")}
          />
        </FormField>

        <FormField
          label="CNPJ"
          htmlFor="cnpj"
          required
          error={errors.cnpj?.message}
          hint="Apenas dígitos. 14 caracteres."
        >
          <Input
            id="cnpj"
            placeholder="00000000000000"
            invalid={Boolean(errors.cnpj)}
            {...register("cnpj")}
          />
        </FormField>

        <FormField
          label="Código de ativação"
          htmlFor="activationCode"
          required
          error={errors.activationCode?.message}
        >
          <Input
            id="activationCode"
            placeholder="Ex.: DATU3RCR"
            invalid={Boolean(errors.activationCode)}
            {...register("activationCode")}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="email"
          required
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            placeholder="contato@empresa.com.br"
            invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Telefone"
          htmlFor="phone"
          required
          error={errors.phone?.message}
        >
          <Input
            id="phone"
            placeholder="(11) 99999-9999"
            invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
        </FormField>

        <FormField
          label="Tipo de empresa"
          required
          error={errors.companyType?.message}
        >
          <Select
            value={companyType ?? "LTDA"}
            onValueChange={(value) =>
              setValue("companyType", value, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Modalidade da conta"
          required
          error={errors.accountType?.message}
        >
          <Select
            value={accountType ?? "Adquirência"}
            onValueChange={(value) =>
              setValue("accountType", value, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Faturamento mensal"
          htmlFor="monthlyRevenue"
          required
          error={errors.monthlyRevenue?.message}
          hint="Valor em reais."
        >
          <Input
            id="monthlyRevenue"
            type="number"
            min={0}
            step="0.01"
            placeholder="100000"
            invalid={Boolean(errors.monthlyRevenue)}
            {...register("monthlyRevenue")}
          />
        </FormField>

        <FormField
          label="Segmento MCC"
          htmlFor="mcc"
          required
          error={errors.mcc?.message}
        >
          <Input
            id="mcc"
            placeholder="Ex.: 5044"
            invalid={Boolean(errors.mcc)}
            {...register("mcc")}
          />
        </FormField>

        <FormField label="Status" required error={errors.status?.message}>
          <Select
            value={status ?? "ENABLED"}
            onValueChange={(value) =>
              setValue("status", value as "ENABLED" | "DISABLED", {
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </SectionCard>
  );
}
