"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { ResponsibleAvatar } from "@/components/establishments/responsible-avatar";
import { FormField } from "@/components/establishments/form/form-field";
import { SectionCard } from "@/components/establishments/form/section-card";
import type { EstablishmentFormInput } from "@/lib/validation/establishment";

export function ResponsibleSection() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<EstablishmentFormInput>();

  const name = watch("responsible.name") || "Responsável";
  const email = watch("responsible.email") || "—";

  return (
    <SectionCard
      title="Responsável"
      description="Pessoa física responsável pela conta."
    >
      <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <ResponsibleAvatar name={name} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {name}
          </p>
          <p className="truncate text-xs text-zinc-500">{email}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Nome completo"
          htmlFor="responsible.name"
          required
          error={errors.responsible?.name?.message}
        >
          <Input
            id="responsible.name"
            placeholder="Ex.: Guilherme Oliveira"
            invalid={Boolean(errors.responsible?.name)}
            {...register("responsible.name")}
          />
        </FormField>

        <FormField
          label="CPF"
          htmlFor="responsible.cpf"
          required
          error={errors.responsible?.cpf?.message}
          hint="Apenas 11 dígitos."
        >
          <Input
            id="responsible.cpf"
            placeholder="00000000000"
            invalid={Boolean(errors.responsible?.cpf)}
            {...register("responsible.cpf")}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="responsible.email"
          required
          error={errors.responsible?.email?.message}
        >
          <Input
            id="responsible.email"
            type="email"
            placeholder="responsavel@empresa.com"
            invalid={Boolean(errors.responsible?.email)}
            {...register("responsible.email")}
          />
        </FormField>

        <FormField
          label="Celular"
          htmlFor="responsible.phone"
          required
          error={errors.responsible?.phone?.message}
        >
          <Input
            id="responsible.phone"
            placeholder="(11) 99999-9999"
            invalid={Boolean(errors.responsible?.phone)}
            {...register("responsible.phone")}
          />
        </FormField>

        <FormField
          label="Data de nascimento"
          htmlFor="responsible.birthDate"
          required
          error={errors.responsible?.birthDate?.message}
        >
          <Input
            id="responsible.birthDate"
            type="date"
            invalid={Boolean(errors.responsible?.birthDate)}
            {...register("responsible.birthDate")}
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
