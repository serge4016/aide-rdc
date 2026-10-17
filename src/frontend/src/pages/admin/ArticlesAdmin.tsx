import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllArticles,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
} from "@/hooks/useQueries";
import { formatDate } from "@/lib/format";
import type { Article, Id } from "@/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AdminSectionHeader,
  ConfirmDeleteDialog,
  Field,
  MutationError,
} from "./AdminUI";

interface ArticleDraft {
  title: string;
  category: string;
  author: string;
  imageUrl: string;
  content: string;
  published: boolean;
}

const EMPTY_DRAFT: ArticleDraft = {
  title: "",
  category: "",
  author: "",
  imageUrl: "",
  content: "",
  published: true,
};

export function ArticlesAdmin() {
  const { data: articles, isLoading, isError, refetch } = useAllArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [editingId, setEditingId] = useState<Id | null>(null);
  const [draft, setDraft] = useState<ArticleDraft>(EMPTY_DRAFT);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Article | null>(null);

  const saving = createArticle.isPending || updateArticle.isPending;
  const mutationError =
    createArticle.error?.message ?? updateArticle.error?.message;

  function openCreate() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormOpen(true);
  }

  function openEdit(article: Article) {
    setEditingId(article.id);
    setDraft({
      title: article.title,
      category: article.category,
      author: article.author,
      imageUrl: article.imageUrl,
      content: article.content,
      published: article.published,
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  function submit() {
    const payload = { ...draft };
    if (editingId === null) {
      createArticle.mutate(payload, { onSuccess: closeForm });
    } else {
      updateArticle.mutate(
        { id: editingId, ...payload },
        { onSuccess: closeForm },
      );
    }
  }

  const canSubmit =
    draft.title.trim() !== "" &&
    draft.category.trim() !== "" &&
    draft.author.trim() !== "" &&
    draft.content.trim() !== "";

  return (
    <div className="space-y-6" data-ocid="admin.articles.panel">
      <AdminSectionHeader
        title="Articles de blog"
        description="Rédigez et publiez les actualités du terrain. Les articles publiés apparaissent sur la page Actualités."
        action={
          <Button
            type="button"
            className="rounded-full"
            data-ocid="admin.articles.add_button"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nouvel article
          </Button>
        }
      />

      {formOpen && (
        <Card className="rounded-2xl border-border shadow-subtle">
          <CardContent className="space-y-4 pt-6">
            <h3 className="font-display text-lg font-semibold">
              {editingId === null ? "Nouvel article" : "Modifier l'article"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Titre" htmlFor="article-title">
                <Input
                  id="article-title"
                  data-ocid="admin.articles.title_input"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, title: e.target.value }))
                  }
                />
              </Field>
              <Field label="Catégorie" htmlFor="article-category">
                <Input
                  id="article-category"
                  data-ocid="admin.articles.category_input"
                  value={draft.category}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, category: e.target.value }))
                  }
                />
              </Field>
              <Field label="Auteur" htmlFor="article-author">
                <Input
                  id="article-author"
                  data-ocid="admin.articles.author_input"
                  value={draft.author}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, author: e.target.value }))
                  }
                />
              </Field>
              <Field
                label="Image (URL)"
                htmlFor="article-image"
                hint="Adresse d'une image hébergée, ex. /assets/images/…"
              >
                <Input
                  id="article-image"
                  data-ocid="admin.articles.image_input"
                  value={draft.imageUrl}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, imageUrl: e.target.value }))
                  }
                />
              </Field>
            </div>
            <Field label="Contenu" htmlFor="article-content">
              <Textarea
                id="article-content"
                data-ocid="admin.articles.content_textarea"
                rows={6}
                value={draft.content}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, content: e.target.value }))
                }
              />
            </Field>
            <div className="flex items-center gap-3">
              <Switch
                id="article-published"
                data-ocid="admin.articles.published_switch"
                checked={draft.published}
                onCheckedChange={(checked) =>
                  setDraft((d) => ({ ...d, published: checked }))
                }
              />
              <label htmlFor="article-published" className="text-sm">
                Publier immédiatement
              </label>
            </div>
            <MutationError message={mutationError} />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="rounded-full"
                data-ocid="admin.articles.save_button"
                disabled={!canSubmit || saving}
                onClick={submit}
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                data-ocid="admin.articles.cancel_button"
                onClick={closeForm}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <p
          data-ocid="admin.articles.loading_state"
          className="text-sm text-muted-foreground"
        >
          Chargement des articles…
        </p>
      )}

      {isError && (
        <div data-ocid="admin.articles.error_state" className="space-y-2">
          <p className="text-sm text-destructive">
            Impossible de charger les articles.
          </p>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => void refetch()}
          >
            Réessayer
          </Button>
        </div>
      )}

      {!isLoading && !isError && (articles?.length ?? 0) === 0 && (
        <p
          data-ocid="admin.articles.empty_state"
          className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground"
        >
          Aucun article pour le moment. Créez le premier pour alimenter la page
          Actualités.
        </p>
      )}

      <ul className="space-y-3">
        {articles?.map((article, index) => (
          <li
            key={article.id.toString()}
            data-ocid={`admin.articles.item.${index + 1}`}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-subtle sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-medium">{article.title}</h3>
                <span
                  className={
                    article.published
                      ? "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                      : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  }
                >
                  {article.published ? "Publié" : "Brouillon"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {article.category} · {article.author} ·{" "}
                {formatDate(article.publishedAt)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                data-ocid={`admin.articles.edit_button.${index + 1}`}
                onClick={() => openEdit(article)}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Modifier
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full text-destructive"
                data-ocid={`admin.articles.delete_button.${index + 1}`}
                onClick={() => setPendingDelete(article)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Supprimer
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Supprimer cet article ?"
        description={`« ${pendingDelete?.title ?? ""} » sera définitivement supprimé.`}
        pending={deleteArticle.isPending}
        ocid="admin.articles.delete"
        onConfirm={() => {
          if (pendingDelete) {
            deleteArticle.mutate(pendingDelete.id, {
              onSuccess: () => setPendingDelete(null),
            });
          }
        }}
      />
    </div>
  );
}
