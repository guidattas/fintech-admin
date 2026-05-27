"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsibleAvatar } from "@/components/establishments/responsible-avatar";
import { StatusBadge } from "@/components/establishments/status-badge";
import { formatCNPJ, formatCurrencyBRL, formatDateBR } from "@/lib/utils";
import type { EstablishmentSummary } from "@/lib/types/establishment";

interface EstablishmentsTableProps {
  data: EstablishmentSummary[];
  loading?: boolean;
  onDelete: (item: EstablishmentSummary) => void;
}

export function EstablishmentsTable({
  data,
  loading,
  onDelete,
}: EstablishmentsTableProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Estabelecimento</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead className="w-12 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-5 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Estabelecimento</TableHead>
            <TableHead>Cadastro</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Modalidade</TableHead>
            <TableHead className="w-12 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer"
              onClick={() => router.push(`/estabelecimentos/${item.id}`)}
            >
              <TableCell className="font-mono text-xs text-zinc-600">
                {item.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <ResponsibleAvatar name={item.brandName} />
                  <div className="min-w-0">
                    <Link
                      href={`/estabelecimentos/${item.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="block truncate font-medium text-zinc-900 hover:text-blue-600"
                    >
                      {item.brandName}
                    </Link>
                    <p className="truncate text-xs text-zinc-500">
                      {formatCNPJ(item.cnpj)}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-zinc-700">
                {formatDateBR(item.createdAt)}
              </TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-sm text-zinc-700">
                {item.companyType || '—'}
              </TableCell>
              <TableCell
                className="text-right"
                onClick={(event) => event.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Abrir menu de ações"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/estabelecimentos/${item.id}`}>
                        <Eye className="h-4 w-4" />
                        Ver detalhes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/estabelecimentos/${item.id}/editar`}>
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem danger onSelect={() => onDelete(item)}>
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
