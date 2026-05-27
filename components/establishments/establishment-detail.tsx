"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  FileText,
  Hash,
  Pencil,
  ShieldCheck,
  Sliders,
  Trash2,
  Wallet,
  Mail,
  Phone,
  MapPin,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ResponsibleAvatar } from "@/components/establishments/responsible-avatar";
import { StatusBadge } from "@/components/establishments/status-badge";
import { EstablishmentTimeline } from "@/components/establishments/establishment-timeline";
import { DeleteEstablishmentDialog } from "@/components/establishments/delete-establishment-dialog";
import { useEstablishment } from "@/hooks/use-establishments";
import {
  LIMIT_CATALOG,
  PERMISSION_CATALOG,
  PERMISSION_GROUP_LABELS,
} from "@/lib/constants/establishment";
import {
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatCurrencyBRL,
  formatDateBR,
} from "@/lib/utils";

interface EstablishmentDetailProps {
  id: string;
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  copyable?: boolean;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      {icon ? (
        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-500">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
        <p className="mt-0.5 break-words text-sm text-zinc-900">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export function EstablishmentDetail({ id }: EstablishmentDetailProps) {
  const router = useRouter();
  const { data: establishment, isLoading, isError, refetch } =
    useEstablishment(id);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !establishment) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <EmptyState
          icon={Building2}
          title="Estabelecimento não encontrado"
          description="Verifique se o ID é válido ou se o backend está disponível."
          action={
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
              <Button asChild>
                <Link href="/estabelecimentos">Voltar</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const limitByKey = new Map(establishment.limits.map((l) => [l.key, l.value]));
  const permByName = new Map(
    establishment.permissions.map((p) => [p.name, p.enabled]),
  );

  const permissionGroups = PERMISSION_CATALOG.reduce<
    Record<string, typeof PERMISSION_CATALOG>
  >((acc, entry) => {
    acc[entry.group] = acc[entry.group] ?? [];
    acc[entry.group].push(entry);
    return acc;
  }, {});

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <Link
          href="/estabelecimentos"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para estabelecimentos
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-zinc-100 bg-gradient-to-r from-blue-50 via-white to-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <ResponsibleAvatar
                name={establishment.brandName}
                size="lg"
                className="bg-blue-600 text-white"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                    {establishment.brandName}
                  </h1>
                  <StatusBadge status={establishment.status} />
                </div>
                <p className="text-sm text-zinc-600">
                  {establishment.companyName}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Hash className="h-3 w-3" />
                    {formatCNPJ(establishment.cnpj)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="h-3 w-3" />
                    Código: {establishment.activationCode}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Wallet className="h-3 w-3" />
                    MCC {establishment.mcc}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`/estabelecimentos/${establishment.id}/editar`}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Faturamento mensal
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {formatCurrencyBRL(establishment.monthlyRevenue)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Modalidade
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">
            {establishment.accountType}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Permissões ativas
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {establishment.permissions.filter((p) => p.enabled).length}
            <span className="ml-1 text-base font-normal text-zinc-500">
              / {establishment.permissions.length}
            </span>
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Documentos
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {establishment.documents.length}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Tabs defaultValue="main" className="space-y-4">
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="main">Dados principais</TabsTrigger>
            <TabsTrigger value="responsible">Responsável</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="limits">Limites</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="sales">Configurações de venda</TabsTrigger>
            <TabsTrigger value="3ds">3DS</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <Card>
              <CardHeader>
                <CardTitle>Dados principais</CardTitle>
                <CardDescription>
                  Informações de cadastro e contato do estabelecimento.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5 md:grid-cols-2">
                  <InfoRow label="Nome fantasia" value={establishment.brandName} />
                  <InfoRow
                    label="Razão social"
                    value={establishment.companyName}
                  />
                  <InfoRow
                    label="CNPJ"
                    icon={<Hash className="h-3.5 w-3.5" />}
                    value={formatCNPJ(establishment.cnpj)}
                  />
                  <InfoRow
                    label="Email"
                    icon={<Mail className="h-3.5 w-3.5" />}
                    value={establishment.email}
                  />
                  <InfoRow
                    label="Telefone"
                    icon={<Phone className="h-3.5 w-3.5" />}
                    value={establishment.phone}
                  />
                  <InfoRow
                    label="Código de ativação"
                    icon={<Tag className="h-3.5 w-3.5" />}
                    value={establishment.activationCode}
                  />
                  <InfoRow
                    label="Tipo de empresa"
                    value={establishment.companyType}
                  />
                  <InfoRow
                    label="Modalidade da conta"
                    value={establishment.accountType}
                  />
                  <InfoRow
                    label="Faturamento mensal"
                    value={formatCurrencyBRL(establishment.monthlyRevenue)}
                  />
                  <InfoRow label="Segmento MCC" value={establishment.mcc} />
                </div>

                <Separator className="my-6" />

                <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
                  Endereço
                </p>
                {establishment.address ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <InfoRow
                      label="Logradouro"
                      icon={<MapPin className="h-3.5 w-3.5" />}
                      value={`${establishment.address.street}, ${establishment.address.number}`}
                    />
                    <InfoRow
                      label="Complemento"
                      value={establishment.address.complement ?? "—"}
                    />
                    <InfoRow
                      label="Bairro"
                      value={establishment.address.neighborhood}
                    />
                    <InfoRow
                      label="Cidade / UF"
                      value={`${establishment.address.city} / ${establishment.address.state}`}
                    />
                    <InfoRow
                      label="CEP"
                      value={formatCEP(establishment.address.zipCode)}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">Endereço não cadastrado.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responsible">
            <Card>
              <CardHeader>
                <CardTitle>Responsável</CardTitle>
                <CardDescription>
                  Pessoa física responsável pela conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {establishment.responsible ? (
                  <>
                    <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                      <ResponsibleAvatar
                        name={establishment.responsible.name}
                        size="lg"
                      />
                      <div>
                        <p className="text-base font-semibold text-zinc-900">
                          {establishment.responsible.name}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {establishment.responsible.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <InfoRow
                        label="CPF"
                        value={formatCPF(establishment.responsible.cpf)}
                      />
                      <InfoRow
                        label="Celular"
                        value={establishment.responsible.phone}
                      />
                      <InfoRow
                        label="Email"
                        value={establishment.responsible.email}
                      />
                      <InfoRow
                        label="Data de nascimento"
                        value={formatDateBR(establishment.responsible.birthDate)}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Responsável não cadastrado.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banking">
            <Card>
              <CardHeader>
                <CardTitle>Banking</CardTitle>
                <CardDescription>Conta de liquidação configurada.</CardDescription>
              </CardHeader>
              <CardContent>
                {establishment.banking ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <InfoRow
                      label="Instituição"
                      icon={<CreditCard className="h-3.5 w-3.5" />}
                      value={establishment.banking.institution}
                    />
                    <InfoRow
                      label="Código do banco"
                      value={establishment.banking.bankCode}
                    />
                    <InfoRow
                      label="Agência"
                      value={establishment.banking.branch}
                    />
                    <InfoRow
                      label="Conta"
                      value={establishment.banking.account}
                    />
                    <InfoRow
                      label="Tipo de conta"
                      value={
                        establishment.banking.accountType === "corrente"
                          ? "Conta corrente"
                          : establishment.banking.accountType === "poupanca"
                            ? "Conta poupança"
                            : establishment.banking.accountType
                      }
                    />
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Banking não cadastrado.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits">
            <Card>
              <CardHeader>
                <CardTitle>Limites</CardTitle>
                <CardDescription>
                  Tetos de operação por canal e por dia (em reais).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {LIMIT_CATALOG.map((entry) => (
                    <div
                      key={entry.key}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                          <Sliders className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-medium text-zinc-900">
                          {entry.label}
                        </p>
                      </div>
                      <p className="font-mono text-sm font-semibold text-zinc-900">
                        {formatCurrencyBRL(limitByKey.get(entry.key) ?? 0)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Permissões</CardTitle>
                <CardDescription>
                  Recursos liberados para o estabelecimento.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(permissionGroups).map(
                  ([group, entries], idx, arr) => (
                    <div key={group}>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        {PERMISSION_GROUP_LABELS[
                          group as keyof typeof PERMISSION_GROUP_LABELS
                        ] ?? group}
                      </p>
                      <div className="grid gap-3 md:grid-cols-2">
                        {entries.map((entry) => (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
                          >
                            <div className="flex items-center gap-2">
                              <ShieldCheck
                                className={
                                  permByName.get(entry.name)
                                    ? "h-4 w-4 text-emerald-500"
                                    : "h-4 w-4 text-zinc-300"
                                }
                              />
                              <p className="text-sm font-medium text-zinc-900">
                                {entry.label}
                              </p>
                            </div>
                            <Switch
                              checked={permByName.get(entry.name) ?? false}
                              disabled
                            />
                          </div>
                        ))}
                      </div>
                      {idx < arr.length - 1 ? (
                        <Separator className="mt-6" />
                      ) : null}
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de venda</CardTitle>
                <CardDescription>
                  Plano comercial vigente para este estabelecimento.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {establishment.salesPlan ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <InfoRow
                      label="Plano"
                      value={establishment.salesPlan.planName}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Nenhuma configuração de venda cadastrada.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="3ds">
            <Card>
              <CardHeader>
                <CardTitle>3DS</CardTitle>
                <CardDescription>
                  Configuração de autenticação para transações via API.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {establishment.salesPlan ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    <InfoRow
                      label="API trigger 3DS"
                      value={formatCurrencyBRL(
                        establishment.salesPlan.apiTrigger3ds,
                      )}
                    />
                    <InfoRow
                      label="API obrigatório 3DS"
                      value={formatCurrencyBRL(
                        establishment.salesPlan.apiRequired3ds,
                      )}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Nenhuma configuração 3DS cadastrada.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>
                  Documentos anexados ao estabelecimento.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {establishment.documents.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="Nenhum documento anexado"
                    description="Use o formulário de edição para adicionar documentos."
                  />
                ) : (
                  <ul className="divide-y divide-zinc-100">
                    {establishment.documents.map((doc) => (
                      <li
                        key={doc.id ?? `${doc.type}-${doc.name}`}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-500">
                            <FileText className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-medium text-zinc-900">
                              {doc.name}
                            </p>
                            <p className="text-xs text-zinc-500">{doc.type}</p>
                          </div>
                        </div>
                        {doc.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-blue-600 hover:underline"
                          >
                            Abrir
                          </a>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <aside className="space-y-4">
          <EstablishmentTimeline
            createdAt={establishment.createdAt}
            updatedAt={establishment.updatedAt}
          />
        </aside>
      </div>

      <DeleteEstablishmentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        establishmentId={establishment.id}
        brandName={establishment.brandName}
        onDeleted={() => router.push("/estabelecimentos")}
      />
    </div>
  );
}
