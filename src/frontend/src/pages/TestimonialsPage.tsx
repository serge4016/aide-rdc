import { ListSkeleton } from "@/components/layout/LoadingStates";
import {
  PageContainer,
  PageHeader,
  SectionBand,
} from "@/components/layout/PageContainer";
import { EmptyState, ErrorState } from "@/components/layout/States";
import { useTestimonies } from "@/hooks/useQueries";
import type { Testimony } from "@/types";
import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Quote, ShieldCheck } from "lucide-react";

/** Initials used as a dignified fallback when no portrait is available. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

function TestimonyCard({
  testimony,
  index,
}: { testimony: Testimony; index: number }) {
  const hasImage = Boolean(testimony.imageUrl);
  return (
    <article
      data-ocid={`testimony.item.${index + 1}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-lg"
    >
      <span
        className="absolute inset-x-0 top-0 h-1 flag-ribbon"
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
        <Quote className="size-7 text-accent" aria-hidden="true" />
        <blockquote className="flex-1">
          <p className="text-pretty text-base leading-relaxed text-foreground/90">
            {testimony.story}
          </p>
        </blockquote>
        <footer className="flex items-center gap-4 border-t border-border pt-5">
          {hasImage ? (
            <img
              src={testimony.imageUrl}
              alt={`Portrait de ${testimony.name}`}
              loading="lazy"
              className="size-12 shrink-0 rounded-full object-cover ring-2 ring-secondary"
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-primary font-display text-sm font-semibold text-primary-foreground"
            >
              {initials(testimony.name)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-foreground">
              {testimony.name}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{testimony.origin}</span>
            </p>
          </div>
        </footer>
      </div>
    </article>
  );
}

export default function TestimonialsPage() {
  const { data, isLoading, isError, refetch } = useTestimonies();
  const testimonies = data ?? [];

  return (
    <>
      <SectionBand tone="cream">
        <PageHeader
          eyebrow="Témoignages"
          title="Leurs voix, leur dignité"
          lead="Des personnes déplacées par le conflit dans l'est de la RDC partagent leur parcours. Chaque récit est publié avec respect, dans leurs propres mots."
        />
      </SectionBand>

      <PageContainer>
        {isLoading ? (
          <ListSkeleton count={4} />
        ) : isError ? (
          <ErrorState
            message="Impossible de charger les témoignages pour le moment."
            onRetry={() => void refetch()}
          />
        ) : testimonies.length === 0 ? (
          <EmptyState
            title="Aucun témoignage publié pour l'instant"
            description="Les récits recueillis sur le terrain seront publiés ici, avec le consentement des personnes concernées."
            actionLabel="Découvrir nos programmes"
            actionTo="/programmes"
            icon={<Heart className="size-6" aria-hidden="true" />}
          />
        ) : (
          <div
            data-ocid="testimony.list"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {testimonies.map((testimony, index) => (
              <TestimonyCard
                key={testimony.id.toString()}
                testimony={testimony}
                index={index}
              />
            ))}
          </div>
        )}
      </PageContainer>

      <SectionBand tone="plain">
        <div className="flex flex-col items-start gap-6 rounded-lg border border-border bg-secondary/40 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </span>
            <div className="max-w-xl">
              <h2 className="font-display text-xl font-semibold">
                Le consentement avant tout
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Chaque témoignage est partagé avec l'accord de la personne
                concernée. Nous ne publions ni nom complet sans autorisation, ni
                détail susceptible de l'exposer.
              </p>
            </div>
          </div>
          <Link
            to="/faire-un-don"
            data-ocid="testimony.donate_link"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <Heart className="size-4" aria-hidden="true" />
            Soutenir ces familles
          </Link>
        </div>
      </SectionBand>
    </>
  );
}
