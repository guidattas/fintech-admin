"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import {
  PERMISSION_CATALOG,
  PERMISSION_GROUP_LABELS,
  type PermissionCatalogEntry,
} from "@/lib/constants/establishment";
import { SectionCard } from "@/components/establishments/form/section-card";
import { Separator } from "@/components/ui/separator";
import type { EstablishmentFormInput } from "@/lib/validation/establishment";

export function PermissionsSection() {
  const { register, watch, setValue } =
    useFormContext<EstablishmentFormInput>();
  const permissions = watch("permissions");

  const groups = React.useMemo(() => {
    const map = new Map<
      PermissionCatalogEntry["group"],
      { entry: PermissionCatalogEntry; index: number }[]
    >();
    PERMISSION_CATALOG.forEach((entry, index) => {
      const bucket = map.get(entry.group) ?? [];
      bucket.push({ entry, index });
      map.set(entry.group, bucket);
    });
    return Array.from(map.entries());
  }, []);

  return (
    <SectionCard
      title="Permissões"
      description="Habilite os recursos disponíveis para este estabelecimento."
    >
      <div className="space-y-6">
        {groups.map(([groupKey, items], groupIdx) => (
          <div key={groupKey}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {PERMISSION_GROUP_LABELS[groupKey]}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map(({ entry, index }) => {
                const checked = permissions?.[index]?.enabled ?? false;
                return (
                  <label
                    key={entry.name}
                    htmlFor={`permission-${entry.name}`}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-colors hover:bg-zinc-50"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900">
                        {entry.label}
                      </p>
                      {entry.description ? (
                        <p className="text-xs text-zinc-500">
                          {entry.description}
                        </p>
                      ) : null}
                    </div>
                    <input
                      type="hidden"
                      value={entry.name}
                      {...register(`permissions.${index}.name` as const)}
                    />
                    <Switch
                      id={`permission-${entry.name}`}
                      checked={checked}
                      onCheckedChange={(value) =>
                        setValue(`permissions.${index}.enabled` as const, value, {
                          shouldDirty: true,
                        })
                      }
                    />
                  </label>
                );
              })}
            </div>
            {groupIdx < groups.length - 1 ? <Separator className="mt-6" /> : null}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
