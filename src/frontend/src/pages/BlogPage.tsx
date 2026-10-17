import { CardGridSkeleton } from "@/components/layout/LoadingStates";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { EmptyState, ErrorState } from "@/components/layout/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePublishedArticles } from "@/hooks/useQueries";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Article } from "@/types";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { CalendarDays, Newspaper, User } from "lucide-react";
import { useMemo } from "react";

const ALL_CATEGORIES = "Toutes";

function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-none transition-smooth hover:-translate-y-1 hover:shadow-md">
      <Link
        to="/actualites/$id"
        params={{ id: article.id.toString() }}
        data-ocid={`blog.item.${article.id.toString()}`}
        className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="grid size-full place-items-center text-muted-foreground">
              <Newspaper className="size-10" aria-hidden="true" />
            </span>
          )}
          <Badge className="absolute left-3 top-3 rounded-full bg-accent text-accent-foreground shadow-sm">
            {article.category}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h2 className="text-balance font-display text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
            {article.title}
          </h2>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {article.content}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5" aria-hidden="true" />
              {article.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default function BlogPage() {
  const search = useSearch({ strict: false }) as { categorie?: string };
  const categorie = search.categorie;
  const navigate = useNavigate({ from: "/actualites" });
  const {
    data: articles,
    isLoading,
    isError,
    refetch,
  } = usePublishedArticles();

  const categories = useMemo(() => {
    const unique = new Set<string>();
    for (const article of articles ?? []) {
      if (article.category) unique.add(article.category);
    }
    return [
      ALL_CATEGORIES,
      ...Array.from(unique).sort((a, b) => a.localeCompare(b, "fr")),
    ];
  }, [articles]);

  const activeCategory = categorie ?? ALL_CATEGORIES;

  const filtered = useMemo(() => {
    if (!articles) return [];
    if (activeCategory === ALL_CATEGORIES) return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [articles, activeCategory]);

  function selectCategory(category: string) {
    void navigate({
      search: category === ALL_CATEGORIES ? {} : { categorie: category },
      replace: true,
    });
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Actualités"
        title="La vie de nos actions sur le terrain"
        lead="Suivez nos interventions et les histoires des communautés que nous accompagnons dans l'est de la RDC."
      />

      {!isLoading && !isError && categories.length > 1 && (
        <fieldset
          data-ocid="blog.filter.tabs"
          className="mt-8 flex flex-wrap gap-2 border-0 p-0"
        >
          <legend className="sr-only">Filtrer par catégorie</legend>
          {categories.map((category) => {
            const active = category === activeCategory;
            return (
              <Button
                key={category}
                type="button"
                variant={active ? "default" : "outline"}
                onClick={() => selectCategory(category)}
                data-ocid={`blog.filter.tab.${category === ALL_CATEGORIES ? "toutes" : category.toLowerCase().replace(/\s+/g, "-")}`}
                aria-pressed={active}
                className={cn(
                  "rounded-full px-4",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-secondary",
                )}
              >
                {category}
              </Button>
            );
          })}
        </fieldset>
      )}

      <div className="mt-10">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : isError ? (
          <ErrorState
            message="Impossible de charger les actualités pour le moment."
            onRetry={() => void refetch()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Aucun article dans cette catégorie"
            description="Revenez bientôt : de nouvelles actualités de nos équipes sont publiées régulièrement."
            actionLabel="Voir toutes les actualités"
            actionTo="/actualites"
            icon={<Newspaper className="size-6" aria-hidden="true" />}
          />
        ) : (
          <div
            data-ocid="blog.list"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((article) => (
              <ArticleCard key={article.id.toString()} article={article} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
