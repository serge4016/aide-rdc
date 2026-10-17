import { DonationWizard } from "@/components/donate";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";

/** Public donation page hosting the six-step donation journey. */
export default function DonatePage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Faire un don"
        title="Votre générosité change des vies"
        lead="Chaque don finance directement l'aide alimentaire, la santé et les abris d'urgence pour les familles déplacées dans l'est de la RDC."
        className="mb-10"
      />
      <DonationWizard />
    </PageContainer>
  );
}
