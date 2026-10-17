import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTestimony,
  useDeleteTestimony,
  useTestimonies,
  useUpdateTestimony,
} from "@/hooks/useQueries";
import type { Id, Testimony } from "@/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AdminSectionHeader,
  ConfirmDeleteDialog,
  Field,
  MutationError,
} from "./AdminUI";

interface TestimonyDraft {
  name: string;
  origin: string;
  story: string;
  imageUrl: string;
}

const EMPTY_DRAFT: TestimonyDraft = {
  name: "",
  origin: "",
  story: "",
  imageUrl: "",
};

export function TestimoniesAdmin() {
  const { data: testimonies, isLoading, isError, refetch } = useTestimonies();
  const createTestimony = useCreateTestimony();
  const updateTestimony = useUpdateTestimony();
  const deleteTestimony = useDeleteTestimony();

  const [editingId, setEditingId] = useState<Id | null>(null);
  const [draft, setDraft] = useState<TestimonyDraft>(EMPTY_DRAFT);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Testimony | null>(null);

  const saving = createTestimony.isPending || updateTestimony.isPending;
  const mutationError =
    createTestimony.error?.message ?? updateTestimony.error?.message;

  function openCreate() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormOpen(true);
  }

  function openEdit(testimony: Testimony) {
    setEditingId(testimony.id);
    setDraft({
      name: testimony.name,
      origin: testimony.origin,
      story: testimony.story,
      imageUrl: testimony.imageUrl ?? "",
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  function submit() {
    const payload = {
      name: draft.name,
      origin: draft.origin,
      story: draft.story,
      imageUrl: draft.imageUrl.trim() === "" ? null : draft.imageUrl,
    };
    if (editingId === null) {
      createTestimony.mutate(payload, { onSuccess: closeForm });
    } else {
      updateTestimony.mutate(
        { id: editingId, ...payload },
        { onSuccess: closeForm },
      );
    }
  }

  const canSubmit =
    draft.name.trim() !== "" &&
    draft.origin.trim() !== "" &&
    draft.story.trim() !== "";

  return (
    <div className="space-y-6" data-ocid="admin.testimonies.panel">
      <AdminSectionHeader
        title="Témoignages"
        description="Recueillez les voix des personnes et communautés accompagnées."
        action={
          <Button
            type="button"
            className="rounded-full"
            data-ocid="admin.testimonies.add_button"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nouveau témoignage
          </Button>
        }
      />

      {formOpen && (
        <Card className="rounded-2xl border-border shadow-subtle">
          <CardContent className="space-y-4 pt-6">
            <h3 className="font-display text-lg font-semibold">
              {editingId === null
                ? "Nouveau témoignage"
                : "Modifier le témoignage"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom" htmlFor="testimony-name">
                <Input
                  id="testimony-name"
                  data-ocid="admin.testimonies.name_input"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, name: e.target.value }))
                  }
                />
              </Field>
              <Field label="Origine" htmlFor="testimony-origin">
                <Input
                  id="testimony-origin"
                  data-ocid="admin.testimonies.origin_input"
                  value={draft.origin}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, origin: e.target.value }))
                  }
                />
              </Field>
            </div>
            <Field label="Récit" htmlFor="testimony-story">
              <Textarea
                id="testimony-story"
                data-ocid="admin.testimonies.story_textarea"
                rows={5}
                value={draft.story}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, story: e.target.value }))
                }
              />
            </Field>
            <Field label="Photo (URL, facultatif)" htmlFor="testimony-image">
              <Input
                id="testimony-image"
                data-ocid="admin.testimonies.image_input"
                value={draft.imageUrl}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, imageUrl: e.target.value }))
                }
              />
            </Field>
            <MutationError message={mutationError} />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="rounded-full"
                data-ocid="admin.testimonies.save_button"
                disabled={!canSubmit || saving}
                onClick={submit}
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                data-ocid="admin.testimonies.cancel_button"
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
          data-ocid="admin.testimonies.loading_state"
          className="text-sm text-muted-foreground"
        >
          Chargement des témoignages…
        </p>
      )}

      {isError && (
        <div data-ocid="admin.testimonies.error_state" className="space-y-2">
          <p className="text-sm text-destructive">
            Impossible de charger les témoignages.
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

      {!isLoading && !isError && (testimonies?.length ?? 0) === 0 && (
        <p
          data-ocid="admin.testimonies.empty_state"
          className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground"
        >
          Aucun témoignage pour le moment. Ajoutez le premier pour donner la
          parole aux communautés.
        </p>
      )}

      <ul className="space-y-3">
        {testimonies?.map((testimony, index) => (
          <li
            key={testimony.id.toString()}
            data-ocid={`admin.testimonies.item.${index + 1}`}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-subtle sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <h3 className="truncate font-medium">{testimony.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {testimony.origin}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {testimony.story}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                data-ocid={`admin.testimonies.edit_button.${index + 1}`}
                onClick={() => openEdit(testimony)}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Modifier
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full text-destructive"
                data-ocid={`admin.testimonies.delete_button.${index + 1}`}
                onClick={() => setPendingDelete(testimony)}
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
        title="Supprimer ce témoignage ?"
        description={`Le témoignage de « ${pendingDelete?.name ?? ""} » sera définitivement supprimé.`}
        pending={deleteTestimony.isPending}
        ocid="admin.testimonies.delete"
        onConfirm={() => {
          if (pendingDelete) {
            deleteTestimony.mutate(pendingDelete.id, {
              onSuccess: () => setPendingDelete(null),
            });
          }
        }}
      />
    </div>
  );
}
