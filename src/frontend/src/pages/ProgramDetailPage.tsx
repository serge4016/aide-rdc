import { ListSkeleton } from "@/components/layout/LoadingStates";
import { PageContainer, SectionBand } from "@/components/layout/PageContainer";
import { ErrorState } from "@/components/layout/States";
import { Button } from "@/components/ui/button";
import { useProgramme } from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Target } from "lucide-react";

export default function ProgramDetailPage() {
  const { id } = useParams({ from: "/programmes/$id" });
  const { data, isLoading, isError, refetch } = useProgramme(BigInt(id));
  const programme = data ?? null;

  if (isLoading) {
    return (
      <PageContainer data-ocid="programme.page">
        <ListSkeleton count={3} />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer data-ocid="programme.page">
        <ErrorState
          message="Impossible de charger ce programme pour le moment."
          onRetry={() => void refetch()}
        />
      </PageContainer>
    );
  }

  if (!programme) {
    return (
      <PageContainer data-ocid="programme.page">
        <div
          data-ocid="programme.not_found"
          className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center"
        >
          <h1 className="font-display text-2xl font-semibold">
            Programme introuvable
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Ce programme n'existe pas ou n'est plus disponible. Découvrez nos
            autres actions sur le terrain.
          </p>
          <Button asChild className="rounded-full px-5">
            <Link to="/programmes" data-ocid="programme.back_button">
              Voir tous les programmes
            </Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <SectionBand tone="cream" className="border-b border-border">
        <Link
          to="/programmes"
          data-ocid="programme.back_link"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Tous les programmes
        </Link>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Programme
            </p>
            <h1 className="text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {programme.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {programme.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <Link to="/faire-un-don" data-ocid="programme.donate_button">
                  Affecter un don à ce programme
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/contact" data-ocid="programme.contact_button">
                  Nous contacter
                </Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-subtle">
            {programme.imageUrl ? (
              <img
                src={programme.imageUrl}
                alt={programme.title}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="grid aspect-[4/3] w-full place-items-center bg-gradient-warm text-accent-foreground">
                <Target className="size-12" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>
      </SectionBand>

      <PageContainer data-ocid="programme.page">
        <div className="grid gap-12 lg:grid-cols-2">
          <section aria-labelledby="objectifs-title">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary">
                <Target className="size-5" aria-hidden="true" />
              </span>
              <h2
                id="objectifs-title"
                className="font-display text-2xl font-semibold"
              >
                Nos objectifs
              </h2>
            </div>
            {programme.objectives.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {programme.objectives.map((objective) => (
                  <li
                    key={objective}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <Target
                      className="mt-0.5 size-5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-foreground">
                      {objective}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                Les objectifs de ce programme seront publiés prochainement.
              </p>
            )}
          </section>

          <section aria-labelledby="actions-title">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary">
                <CheckCircle2 className="size-5" aria-hidden="true" />
              </span>
              <h2
                id="actions-title"
                className="font-display text-2xl font-semibold"
              >
                Actions menées sur le terrain
              </h2>
            </div>
            {programme.actions.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {programme.actions.map((action) => (
                  <li
                    key={action}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-foreground">
                      {action}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                Les actions menées pour ce programme seront publiées
                prochainement.
              </p>
            )}
          </section>
        </div>
      </PageContainer>

      <SectionBand tone="plain" className="border-t border-border">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg bg-gradient-primary px-8 py-10 text-primary-foreground sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-semibold">
              Soutenez « {programme.title} »
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/85">
              Votre don est affecté directement à ce programme et finance nos
              équipes sur le terrain.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 rounded-full bg-accent px-6 font-semibold text-accent-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <Link to="/faire-un-don" data-ocid="programme.cta_button">
              Faire un don
            </Link>
          </Button>
        </div>
      </SectionBand>
    </>
  );
}
