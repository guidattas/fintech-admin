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
import { BRAZIL_STATES } from "@/lib/constants/establishment";
import type { EstablishmentFormInput } from "@/lib/validation/establishment";
import { FormField } from "@/components/establishments/form/form-field";
import { SectionCard } from "@/components/establishments/form/section-card";

export function AddressSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EstablishmentFormInput>();

  const state = watch("address.state");

  return (
    <SectionCard
      title="Endereço"
      description="Endereço comercial do estabelecimento."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FormField
          label="Rua"
          htmlFor="address.street"
          required
          error={errors.address?.street?.message}
          className="lg:col-span-2"
        >
          <Input
            id="address.street"
            placeholder="Ex.: Brig. Faria Lima"
            invalid={Boolean(errors.address?.street)}
            {...register("address.street")}
          />
        </FormField>

        <FormField
          label="Número"
          htmlFor="address.number"
          required
          error={errors.address?.number?.message}
        >
          <Input
            id="address.number"
            placeholder="Ex.: 1811"
            invalid={Boolean(errors.address?.number)}
            {...register("address.number")}
          />
        </FormField>

        <FormField
          label="Complemento"
          htmlFor="address.complement"
          error={errors.address?.complement?.message}
          className="lg:col-span-2"
        >
          <Input
            id="address.complement"
            placeholder="Ex.: Andar 9 Conj 918"
            {...register("address.complement")}
          />
        </FormField>

        <FormField
          label="Bairro"
          htmlFor="address.neighborhood"
          required
          error={errors.address?.neighborhood?.message}
        >
          <Input
            id="address.neighborhood"
            placeholder="Ex.: Jardim Paulistano"
            invalid={Boolean(errors.address?.neighborhood)}
            {...register("address.neighborhood")}
          />
        </FormField>

        <FormField
          label="Cidade"
          htmlFor="address.city"
          required
          error={errors.address?.city?.message}
        >
          <Input
            id="address.city"
            placeholder="Ex.: São Paulo"
            invalid={Boolean(errors.address?.city)}
            {...register("address.city")}
          />
        </FormField>

        <FormField
          label="UF"
          required
          error={errors.address?.state?.message}
        >
          <Select
            value={state ?? "SP"}
            onValueChange={(value) =>
              setValue("address.state", value, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="UF" />
            </SelectTrigger>
            <SelectContent>
              {BRAZIL_STATES.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="CEP"
          htmlFor="address.zipCode"
          required
          error={errors.address?.zipCode?.message}
          hint="Apenas 8 dígitos."
        >
          <Input
            id="address.zipCode"
            placeholder="01452001"
            invalid={Boolean(errors.address?.zipCode)}
            {...register("address.zipCode")}
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
