import { EstablishmentDetail } from "@/components/establishments/establishment-detail";

export const metadata = {
  title: "Detalhes do estabelecimento · Fintech Admin",
};

interface EstablishmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EstablishmentDetailPage({
  params,
}: EstablishmentDetailPageProps) {
  const { id } = await params;
  return <EstablishmentDetail id={id} />;
}
