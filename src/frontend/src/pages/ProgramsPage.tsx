import { CardGridSkeleton } from "@/components/layout/LoadingStates";
import {
  PageContainer,
  PageHeader,
  SectionBand,
} from "@/components/layout/PageContainer";
import { EmptyState, ErrorState } from "@/components/layout/States";
import { Button } from "@/components/ui/button";
import { useProgrammes } from "@/hooks/useQueries";
import type { Programme } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  Home,
  ShieldCheck,
  Stethoscope,
  UtensilsCrossed,
} from "lucide-react";
import type { ReactNode } from "react";

/** Icon chosen from the programme title so each card reads at a glance. */
function iconForTitle(title: string): ReactNode {
  const value = title.toLowerCase();
  if (value.includes("aliment"))
    return <UtensilsCrossed className="size-6" aria-hidden="true" />;
  if (value.includes("sant"))
    return <Stethoscope className="size-6" aria-hidden="true" />;
  if (value.includes("abri") || value.includes("logement"))
    return <Home className="size-6" aria-hidden="true" />;
  if (value.includes("éduc") || value.includes("educ"))
    return <BookOpen className="size-6" aria-hidden="true" />;
  if (
    value.includes("protection") ||
    value.includes("femme") ||
    value.includes("enfant")
  )
    return <ShieldCheck className="size-6" aria-hidden="true" />;
  return <HeartHandshake className="size-6" aria-hidden="true" />;
}

function ProgrammeCard({ programme }: { programme: Programme }) {
  return (
    <article
      data-ocid="programmes.card"
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {programme.imageUrl ? (
          <img
            src={programme.imageUrl}
            alt={programme.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center bg-gradient-warm text-accent-foreground">
            {iconForTitle(programme.title)}
          </div>
        )}
        <span className="absolute left-4 top-4 grid size-11 place-items-center rounded-full bg-card/95 text-primary shadow-sm">
          {iconForTitle(programme.title)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h2 className="font-display text-xl font-semibold leading-snug">
          {programme.title}
        </h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {programme.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link
              to="/programmes/$id"
              params={{ id: programme.id.toString() }}
              data-ocid="programmes.detail_link"
            >
              Découvrir
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Link
            to="/faire-un-don"
            data-ocid="programmes.donate_link"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Affecter un don
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ProgramsPage() {
  const { data, isLoading, isError, refetch } = useProgrammes();
  const programmes = data ?? [];

  return (
    <>
      <SectionBand tone="cream" className="border-b border-border">
        <PageHeader
          eyebrow="Nos actions"
          title="Nos programmes humanitaires"
          lead="Cinq domaines d'intervention pour répondre aux besoins essentiels des personnes déplacées par le conflit dans l'est de la République démocratique du Congo."
        />
      </SectionBand>

      <PageContainer data-ocid="programmes.page">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : isError ? (
          <ErrorState
            message="Impossible de charger nos programmes pour le moment."
            onRetry={() => void refetch()}
          />
        ) : programmes.length === 0 ? (
          <EmptyState
            title="Aucun programme publié"
            description="Nos programmes sont en cours de mise à jour. Revenez bientôt pour découvrir nos actions sur le terrain."
            actionLabel="Nous contacter"
            actionTo="/contact"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.map((programme) => (
              <ProgrammeCard
                key={programme.id.toString()}
                programme={programme}
              />
            ))}
          </div>
        )}
      </PageContainer>

      <SectionBand tone="plain" className="border-t border-border">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg bg-gradient-primary px-8 py-10 text-primary-foreground sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-semibold">
              Votre don finance directement le terrain
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/85">
              Chaque contribution soutient l'aide alimentaire, la santé, les
              abris d'urgence, l'éducation et la protection des femmes et des
              enfants.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 rounded-full bg-accent px-6 font-semibold text-accent-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <Link to="/faire-un-don" data-ocid="programmes.cta_button">
              Faire un don
            </Link>
          </Button>
        </div>
      </SectionBand>
    </>
  );
}
