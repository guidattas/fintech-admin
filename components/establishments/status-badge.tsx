import { Badge } from "@/components/ui/badge";
import type { EstablishmentStatus } from "@/lib/types/establishment";

interface StatusBadgeProps {
  status: EstablishmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "ENABLED") {
    return (
      <Badge variant="success">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Habilitado
      </Badge>
    );
  }
  return (
    <Badge variant="danger">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Desabilitado
    </Badge>
  );
}
