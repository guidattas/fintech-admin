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
import { ACCOUNT_KINDS } from "@/lib/constants/establishment";
import { FormField } from "@/components/establishments/form/form-field";
import { SectionCard } from "@/components/establishments/form/section-card";
import type { EstablishmentFormInput } from "@/lib/validation/establishment";

export function BankingSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EstablishmentFormInput>();

  const accountType = watch("banking.accountType");

  return (
    <SectionCard
      title="Banking"
      description="Conta de liquidação configurada para o estabelecimento."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Instituição financeira"
          htmlFor="banking.institution"
          required
          error={errors.banking?.institution?.message}
        >
          <Input
            id="banking.institution"
            placeholder="Ex.: CELCOIN IP S.A."
            invalid={Boolean(errors.banking?.institution)}
            {...register("banking.institution")}
          />
        </FormField>

        <FormField
          label="Código do banco"
          htmlFor="banking.bankCode"
          required
          error={errors.banking?.bankCode?.message}
        >
          <Input
            id="banking.bankCode"
            placeholder="Ex.: 509"
            invalid={Boolean(errors.banking?.bankCode)}
            {...register("banking.bankCode")}
          />
        </FormField>

        <FormField
          label="Agência"
          htmlFor="banking.branch"
          required
          error={errors.banking?.branch?.message}
        >
          <Input
            id="banking.branch"
            placeholder="Ex.: 0001"
            invalid={Boolean(errors.banking?.branch)}
            {...register("banking.branch")}
          />
        </FormField>

        <FormField
          label="Conta"
          htmlFor="banking.account"
          required
          error={errors.banking?.account?.message}
        >
          <Input
            id="banking.account"
            placeholder="Ex.: 420102-6"
            invalid={Boolean(errors.banking?.account)}
            {...register("banking.account")}
          />
        </FormField>

        <FormField
          label="Tipo de conta"
          required
          error={errors.banking?.accountType?.message}
        >
          <Select
            value={accountType ?? "corrente"}
            onValueChange={(value) =>
              setValue("banking.accountType", value, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNT_KINDS.map((kind) => (
                <SelectItem key={kind.value} value={kind.value}>
                  {kind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </SectionCard>
  );
}
