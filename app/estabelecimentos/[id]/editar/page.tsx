import { EstablishmentEdit } from "@/components/establishments/establishment-edit";

export const metadata = {
  title: "Editar estabelecimento · Fintech Admin",
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EstablishmentEditPage({ params }: EditPageProps) {
  const { id } = await params;
  return <EstablishmentEdit id={id} />;
}
