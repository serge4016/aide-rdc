import { CardGridSkeleton } from "@/components/layout/LoadingStates";
import { EmptyState, ErrorState } from "@/components/layout/States";
import { Button } from "@/components/ui/button";
import { useTestimonies } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Quote } from "lucide-react";

/** Featured voices from the people and communities we support. */
export function TestimoniesPreview() {
  const { data, isLoading, isError, refetch } = useTestimonies();
  const testimonies = (data ?? []).slice(0, 3);

  return (
    <section data-ocid="home.testimonies.section" className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Témoignages
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Leurs voix, notre raison d'agir
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Derrière chaque action, des personnes résilientes qui
              reconstruisent leur vie.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            data-ocid="home.testimonies.view_all_button"
            className="shrink-0 rounded-full border-border bg-card px-5 font-semibold"
          >
            <Link to="/temoignages">
              Tous les témoignages
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <CardGridSkeleton count={3} />
          ) : isError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : testimonies.length === 0 ? (
            <EmptyState
              title="Les témoignages arrivent bientôt"
              description="Nous recueillons les récits des communautés que nous accompagnons."
              actionLabel="Nous contacter"
              actionTo="/contact"
              icon={<Quote className="size-6" aria-hidden="true" />}
            />
          ) : (
            <ul className="grid gap-6 md:grid-cols-3">
              {testimonies.map((testimony, index) => (
                <li
                  key={testimony.id.toString()}
                  data-ocid={`home.testimonies.item.${index + 1}`}
                  className="flex h-full flex-col gap-5 rounded-lg border border-border bg-card p-7 shadow-sm"
                >
                  <Quote className="size-8 text-accent" aria-hidden="true" />
                  <blockquote className="flex-1 text-base leading-relaxed text-foreground">
                    « {testimony.story} »
                  </blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-border pt-5">
                    {testimony.imageUrl ? (
                      <img
                        src={testimony.imageUrl}
                        alt={testimony.name}
                        className="size-11 rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="grid size-11 place-items-center rounded-full bg-primary/10 font-display text-lg font-semibold text-primary">
                        {testimony.name.charAt(0)}
                      </span>
                    )}
                    <span className="flex flex-col">
                      <span className="font-semibold">{testimony.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {testimony.origin}
                      </span>
                    </span>
                  </figcaption>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
