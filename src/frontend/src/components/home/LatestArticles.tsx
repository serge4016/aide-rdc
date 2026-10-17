import { ListSkeleton } from "@/components/layout/LoadingStates";
import { EmptyState, ErrorState } from "@/components/layout/States";
import { Button } from "@/components/ui/button";
import { usePublishedArticles } from "@/hooks/useQueries";
import { formatDate } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Newspaper } from "lucide-react";

const FALLBACK_IMAGE = "/assets/images/placeholder.svg";

/** Latest published articles from the blog. */
export function LatestArticles() {
  const { data, isLoading, isError, refetch } = usePublishedArticles();
  const articles = (data ?? []).slice(0, 3);

  return (
    <section
      data-ocid="home.articles.section"
      className="border-y border-border bg-secondary/50"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Actualités
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              La vie de nos communautés
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Suivez nos interventions et les histoires de celles et ceux que
              nous accompagnons.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            data-ocid="home.articles.view_all_button"
            className="shrink-0 rounded-full border-border bg-card px-5 font-semibold"
          >
            <Link to="/actualites">
              Toutes les actualités
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <ListSkeleton count={3} />
          ) : isError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : articles.length === 0 ? (
            <EmptyState
              title="Aucune actualité pour le moment"
              description="Nos prochaines publications sur le terrain apparaîtront ici."
              actionLabel="Découvrir nos programmes"
              actionTo="/programmes"
              icon={<Newspaper className="size-6" aria-hidden="true" />}
            />
          ) : (
            <ul className="grid gap-6 md:grid-cols-3">
              {articles.map((article, index) => (
                <li key={article.id.toString()}>
                  <Link
                    to="/actualites/$id"
                    params={{ id: article.id.toString() }}
                    data-ocid={`home.articles.item.${index + 1}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-smooth hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={article.imageUrl || FALLBACK_IMAGE}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold uppercase tracking-wider text-primary">
                          {article.category}
                        </span>
                        <time
                          dateTime={new Date(
                            Number(article.publishedAt / 1_000_000n),
                          ).toISOString()}
                        >
                          {formatDate(article.publishedAt)}
                        </time>
                      </div>
                      <h3 className="font-display text-lg font-semibold leading-snug">
                        {article.title}
                      </h3>
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {article.content}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary">
                        Lire l'article
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
