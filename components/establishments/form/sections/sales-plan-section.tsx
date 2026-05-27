"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { FormField } from "@/components/establishments/form/form-field";
import { SectionCard } from "@/components/establishments/form/section-card";
import type { EstablishmentFormInput } from "@/lib/validation/establishment";

export function SalesPlanSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EstablishmentFormInput>();

  return (
    <div className="space-y-4">
      <SectionCard
        title="Plano de vendas"
        description="Configuração comercial do estabelecimento."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Nome do plano"
            htmlFor="salesPlan.planName"
            required
            error={errors.salesPlan?.planName?.message}
          >
            <Input
              id="salesPlan.planName"
              placeholder="Ex.: Estabelecimento padrão"
              invalid={Boolean(errors.salesPlan?.planName)}
              {...register("salesPlan.planName")}
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard
        title="3DS"
        description="Limites monetários para o gateway 3DS via API."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="API trigger 3DS (R$)"
            htmlFor="salesPlan.apiTrigger3ds"
            required
            error={errors.salesPlan?.apiTrigger3ds?.message}
            hint="Valor a partir do qual o 3DS é acionado."
          >
            <Input
              id="salesPlan.apiTrigger3ds"
              type="number"
              min={0}
              step="0.01"
              placeholder="500"
              invalid={Boolean(errors.salesPlan?.apiTrigger3ds)}
              {...register("salesPlan.apiTrigger3ds")}
            />
          </FormField>

          <FormField
            label="API obrigatório 3DS (R$)"
            htmlFor="salesPlan.apiRequired3ds"
            required
            error={errors.salesPlan?.apiRequired3ds?.message}
            hint="Valor a partir do qual o 3DS é obrigatório."
          >
            <Input
              id="salesPlan.apiRequired3ds"
              type="number"
              min={0}
              step="0.01"
              placeholder="1500"
              invalid={Boolean(errors.salesPlan?.apiRequired3ds)}
              {...register("salesPlan.apiRequired3ds")}
            />
          </FormField>
        </div>
      </SectionCard>
    </div>
  );
}
