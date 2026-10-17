import { DonationReceipt } from "@/components/donate";
import { PageContainer } from "@/components/layout/PageContainer";
import { ErrorState } from "@/components/layout/States";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDonation, useProgrammes } from "@/hooks/useQueries";
import { Link, useRouterState } from "@tanstack/react-router";
import { CheckCircle2, Heart } from "lucide-react";

/** Read the `id` search parameter without depending on route registration. */
function useDonationIdFromSearch(): bigint | undefined {
  const search = useRouterState({ select: (s) => s.location.search });
  const raw = (search as Record<string, unknown>).id;
  if (typeof raw !== "string" || raw === "") return undefined;
  try {
    return BigInt(raw);
  } catch {
    return undefined;
  }
}

/** Confirmation page showing the receipt and unique transaction number. */
export default function DonationConfirmationPage() {
  const donationId = useDonationIdFromSearch();
  const {
    data: donation,
    isLoading,
    isError,
    refetch,
  } = useDonation(donationId);
  const { data: programmes = [] } = useProgrammes();

  const programmeTitle =
    donation?.programmeId !== undefined
      ? (programmes.find((p) => p.id === donation.programmeId)?.title ?? null)
      : null;

  return (
    <PageContainer className="max-w-3xl">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-balance font-display text-3xl font-semibold sm:text-4xl">
          Merci pour votre don
        </h1>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Votre générosité apporte une aide concrète aux familles déplacées dans
          l'est de la République démocratique du Congo.
        </p>
      </div>

      {isLoading && (
        <div data-ocid="loading_state" className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-12 w-48 rounded-full" />
        </div>
      )}

      {isError && (
        <ErrorState
          message="Nous n'avons pas pu retrouver votre don. Veuillez réessayer."
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && !donation && (
        <div
          data-ocid="donate.not_found_state"
          className="rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Aucun don ne correspond à cette référence.
          </p>
        </div>
      )}

      {donation && (
        <div className="space-y-6">
          <DonationReceipt
            data={{
              transactionNumber: donation.transactionNumber,
              amount: donation.amount,
              currency: donation.currency,
              frequency: donation.frequency,
              method: donation.method,
              programmeTitle,
              donorName: donation.donor.name,
              donorEmail: donation.donor.email,
              createdAt: donation.createdAt,
            }}
          />

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <Link to="/faire-un-don" data-ocid="donate.again_button">
                <Heart className="size-4" aria-hidden="true" />
                Faire un autre don
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link to="/" data-ocid="donate.home_button">
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
