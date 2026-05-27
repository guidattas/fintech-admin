"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useCreateEstablishment,
  useUpdateEstablishment,
} from "@/hooks/use-establishments";
import {
  DEFAULT_LIMITS,
  DEFAULT_PERMISSIONS,
} from "@/lib/constants/establishment";
import {
  establishmentSchema,
  type EstablishmentFormInput,
  type EstablishmentFormOutput,
} from "@/lib/validation/establishment";
import type {
  CreateEstablishmentInput,
  Establishment,
} from "@/lib/types/establishment";

import { MainSection } from "./sections/main-section";
import { AddressSection } from "./sections/address-section";
import { ResponsibleSection } from "./sections/responsible-section";
import { BankingSection } from "./sections/banking-section";
import { LimitsSection } from "./sections/limits-section";
import { PermissionsSection } from "./sections/permissions-section";
import { SalesPlanSection } from "./sections/sales-plan-section";
import { DocumentsSection } from "./sections/documents-section";

interface EstablishmentFormProps {
  mode: "create" | "edit";
  establishment?: Establishment;
}

function buildInitialValues(
  establishment?: Establishment,
): EstablishmentFormInput {
  if (!establishment) {
    return {
      brandName: "",
      companyName: "",
      cnpj: "",
      email: "",
      phone: "",
      activationCode: "",
      companyType: "LTDA",
      accountType: "Adquirência",
      monthlyRevenue: 0,
      mcc: "",
      status: "ENABLED",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "SP",
        zipCode: "",
      },
      responsible: {
        name: "",
        cpf: "",
        email: "",
        phone: "",
        birthDate: "",
      },
      banking: {
        institution: "",
        bankCode: "",
        branch: "",
        account: "",
        accountType: "corrente",
      },
      salesPlan: {
        planName: "Estabelecimento padrão",
        apiTrigger3ds: 0,
        apiRequired3ds: 0,
      },
      limits: DEFAULT_LIMITS,
      permissions: DEFAULT_PERMISSIONS,
      documents: [],
    };
  }

  const limitsByKey = new Map(
    establishment.limits.map((item) => [item.key, item.value]),
  );
  const permissionsByName = new Map(
    establishment.permissions.map((item) => [item.name, item.enabled]),
  );

  return {
    brandName: establishment.brandName,
    companyName: establishment.companyName,
    cnpj: establishment.cnpj,
    email: establishment.email,
    phone: establishment.phone,
    activationCode: establishment.activationCode,
    companyType: establishment.companyType,
    accountType: establishment.accountType,
    monthlyRevenue: establishment.monthlyRevenue,
    mcc: establishment.mcc,
    status: establishment.status,
    address: establishment.address ?? {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "SP",
      zipCode: "",
    },
    responsible: establishment.responsible
      ? {
          name: establishment.responsible.name,
          cpf: establishment.responsible.cpf,
          email: establishment.responsible.email,
          phone: establishment.responsible.phone,
          birthDate: (establishment.responsible.birthDate ?? "").slice(0, 10),
        }
      : { name: "", cpf: "", email: "", phone: "", birthDate: "" },
    banking: establishment.banking ?? {
      institution: "",
      bankCode: "",
      branch: "",
      account: "",
      accountType: "corrente",
    },
    salesPlan: establishment.salesPlan ?? {
      planName: "Estabelecimento padrão",
      apiTrigger3ds: 0,
      apiRequired3ds: 0,
    },
    limits: DEFAULT_LIMITS.map((entry) => ({
      key: entry.key,
      value: limitsByKey.get(entry.key) ?? 0,
    })),
    permissions: DEFAULT_PERMISSIONS.map((entry) => ({
      name: entry.name,
      enabled: permissionsByName.get(entry.name) ?? false,
    })),
    documents: establishment.documents.map((doc) => ({
      type: doc.type,
      name: doc.name,
      url: doc.url ?? "",
    })),
  };
}

const TABS = [
  { value: "main", label: "Dados principais" },
  { value: "responsible", label: "Responsável" },
  { value: "banking", label: "Banking" },
  { value: "limits", label: "Limites" },
  { value: "permissions", label: "Permissões" },
  { value: "sales", label: "Configurações de venda" },
  { value: "documents", label: "Documentos" },
];

export function EstablishmentForm({
  mode,
  establishment,
}: EstablishmentFormProps) {
  const router = useRouter();
  const create = useCreateEstablishment();
  const update = useUpdateEstablishment(establishment?.id ?? "");

  const methods = useForm<EstablishmentFormInput, unknown, EstablishmentFormOutput>(
    {
      resolver: zodResolver(establishmentSchema),
      defaultValues: buildInitialValues(establishment),
      mode: "onBlur",
    },
  );

  const onSubmit = methods.handleSubmit(async (values) => {
    const payload = values as CreateEstablishmentInput;
    if (mode === "create") {
      const created = await create.mutateAsync(payload);
      router.push(`/estabelecimentos/${created.id}`);
    } else if (establishment) {
      await update.mutateAsync(payload);
      router.push(`/estabelecimentos/${establishment.id}`);
    }
  });

  const submitting = create.isPending || update.isPending;

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="space-y-6">
        <Tabs defaultValue="main" className="space-y-4">
          <TabsList className="w-full overflow-x-auto">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="main">
            <div className="space-y-4">
              <MainSection />
              <AddressSection />
            </div>
          </TabsContent>

          <TabsContent value="responsible">
            <ResponsibleSection />
          </TabsContent>

          <TabsContent value="banking">
            <BankingSection />
          </TabsContent>

          <TabsContent value="limits">
            <LimitsSection />
          </TabsContent>

          <TabsContent value="permissions">
            <PermissionsSection />
          </TabsContent>

          <TabsContent value="sales">
            <SalesPlanSection />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsSection />
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-4">
          <Button variant="outline" asChild>
            <Link
              href={
                establishment
                  ? `/estabelecimentos/${establishment.id}`
                  : "/estabelecimentos"
              }
            >
              Cancelar
            </Link>
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === "create" ? "Criar estabelecimento" : "Salvar"}
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
