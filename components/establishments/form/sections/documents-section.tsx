"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { FileText, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/establishments/form/form-field";
import { SectionCard } from "@/components/establishments/form/section-card";
import type { EstablishmentFormInput } from "@/lib/validation/establishment";

export function DocumentsSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EstablishmentFormInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  return (
    <SectionCard
      title="Documentos"
      description="Anexos de identificação e comprovação. Opcional."
    >
      {fields.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum documento adicionado"
          description="Use o botão abaixo para incluir documentos como contrato social, comprovante de endereço ou similares."
        />
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const itemErrors = errors.documents?.[index];
            return (
              <div
                key={field.id}
                className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <FormField
                  label="Tipo"
                  required
                  error={itemErrors?.type?.message}
                >
                  <Input
                    placeholder="Ex.: Contrato social"
                    {...register(`documents.${index}.type` as const)}
                  />
                </FormField>
                <FormField
                  label="Nome"
                  required
                  error={itemErrors?.name?.message}
                >
                  <Input
                    placeholder="Ex.: contrato-social.pdf"
                    {...register(`documents.${index}.name` as const)}
                  />
                </FormField>
                <FormField label="URL / Identificador">
                  <Input
                    placeholder="https://..."
                    {...register(`documents.${index}.url` as const)}
                  />
                </FormField>
                <div className="flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label="Remover documento"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ type: "", name: "", url: "" })}
        >
          <Plus className="h-4 w-4" />
          Adicionar documento
        </Button>
      </div>
    </SectionCard>
  );
}
