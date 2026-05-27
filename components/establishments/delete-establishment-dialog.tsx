"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteEstablishment } from "@/hooks/use-establishments";

interface DeleteEstablishmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  establishmentId: string | null;
  brandName?: string;
  onDeleted?: () => void;
}

export function DeleteEstablishmentDialog({
  open,
  onOpenChange,
  establishmentId,
  brandName,
  onDeleted,
}: DeleteEstablishmentDialogProps) {
  const mutation = useDeleteEstablishment();

  async function handleConfirm() {
    if (!establishmentId) return;
    try {
      await mutation.mutateAsync(establishmentId);
      onOpenChange(false);
      onDeleted?.();
    } catch {
      // toast already triggered by hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir estabelecimento</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O estabelecimento{" "}
            <strong className="text-zinc-900">{brandName ?? "selecionado"}</strong>{" "}
            será removido permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-600/90"
            onClick={handleConfirm}
            disabled={mutation.isPending || !establishmentId}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Excluindo…
              </>
            ) : (
              "Excluir"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
