import { CardGridSkeleton } from "@/components/layout/LoadingStates";
import { EmptyState, ErrorState } from "@/components/layout/States";
import { Button } from "@/components/ui/button";
import { useProgrammes } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake } from "lucide-react";

const FALLBACK_IMAGE = "/assets/images/placeholder.svg";

/** Preview of the organisation's programmes, with a link to the full list. */
export function ProgrammesPreview() {
  const { data, isLoading, isError, refetch } = useProgrammes();
  const programmes = data ?? [];
  const featured = programmes.slice(0, 3);

  return (
    <section data-ocid="home.programmes.section" className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Nos programmes
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Des actions concrètes sur le terrain
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Nous répondons aux besoins essentiels des familles déplacées, de
              l'urgence jusqu'à la reconstruction.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            data-ocid="home.programmes.view_all_button"
            className="shrink-0 rounded-full border-border bg-card px-5 font-semibold"
          >
            <Link to="/programmes">
              Tous nos programmes
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <CardGridSkeleton count={3} />
          ) : isError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : featured.length === 0 ? (
            <EmptyState
              title="Nos programmes arrivent bientôt"
              description="Nous préparons la présentation détaillée de nos actions sur le terrain."
              actionLabel="Nous contacter"
              actionTo="/contact"
              icon={<HeartHandshake className="size-6" aria-hidden="true" />}
            />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((programme, index) => (
                <li key={programme.id.toString()}>
                  <Link
                    to="/programmes/$id"
                    params={{ id: programme.id.toString() }}
                    data-ocid={`home.programmes.item.${index + 1}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-smooth hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={programme.imageUrl || FALLBACK_IMAGE}
                        alt={programme.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <h3 className="font-display text-xl font-semibold leading-snug">
                        {programme.title}
                      </h3>
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {programme.description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
                        En savoir plus
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
