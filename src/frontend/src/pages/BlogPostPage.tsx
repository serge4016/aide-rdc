import { PageContainer } from "@/components/layout/PageContainer";
import { ErrorState } from "@/components/layout/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticle } from "@/hooks/useQueries";
import { formatDate } from "@/lib/format";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Newspaper, User } from "lucide-react";

function ArticleSkeleton() {
  return (
    <div data-ocid="loading_state" className="flex flex-col gap-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const { id } = useParams({ from: "/actualites/$id" });
  const articleId = Number(id);
  const {
    data: article,
    isLoading,
    isError,
    refetch,
  } = useArticle(Number.isNaN(articleId) ? undefined : BigInt(articleId));

  return (
    <PageContainer>
      <Button
        asChild
        variant="ghost"
        data-ocid="blog.back_button"
        className="mb-8 rounded-full pl-2 text-muted-foreground hover:text-primary"
      >
        <Link to="/actualites" search={{}}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour aux actualités
        </Link>
      </Button>

      {isLoading ? (
        <ArticleSkeleton />
      ) : isError ? (
        <ErrorState
          message="Impossible de charger cet article pour le moment."
          onRetry={() => void refetch()}
        />
      ) : !article ? (
        <div
          data-ocid="blog.not_found"
          className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center"
        >
          <span className="grid size-14 place-items-center rounded-full bg-secondary text-primary">
            <Newspaper className="size-6" aria-hidden="true" />
          </span>
          <h1 className="font-display text-2xl font-semibold">
            Article introuvable
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Cet article n'existe pas ou n'est plus disponible.
          </p>
          <Button asChild className="mt-1 rounded-full px-5">
            <Link
              to="/actualites"
              search={{}}
              data-ocid="blog.not_found.button"
            >
              Voir toutes les actualités
            </Link>
          </Button>
        </div>
      ) : (
        <article data-ocid="blog.article" className="mx-auto max-w-3xl">
          <Badge className="rounded-full bg-accent text-accent-foreground">
            {article.category}
          </Badge>
          <h1 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-4" aria-hidden="true" />
              {article.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDate(article.publishedAt)}
            </span>
          </div>

          {article.imageUrl && (
            <div className="mt-8 overflow-hidden rounded-lg border border-border bg-secondary">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-foreground/90">
            {article.content
              .split(/\n{2,}/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph.slice(0, 60)}>{paragraph}</p>
              ))}
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <Button asChild variant="outline" className="rounded-full">
              <Link
                to="/actualites"
                search={{}}
                data-ocid="blog.footer_back_button"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Toutes les actualités
              </Link>
            </Button>
          </div>
        </article>
      )}
    </PageContainer>
  );
}
