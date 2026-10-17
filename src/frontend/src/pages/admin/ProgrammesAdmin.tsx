import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProgramme,
  useDeleteProgramme,
  useProgrammes,
  useUpdateProgramme,
} from "@/hooks/useQueries";
import type { Id, Programme } from "@/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AdminSectionHeader,
  ConfirmDeleteDialog,
  Field,
  MutationError,
} from "./AdminUI";

interface ProgrammeDraft {
  title: string;
  description: string;
  objectives: string;
  actions: string;
  imageUrl: string;
  displayOrder: string;
}

const EMPTY_DRAFT: ProgrammeDraft = {
  title: "",
  description: "",
  objectives: "",
  actions: "",
  imageUrl: "",
  displayOrder: "0",
};

function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

export function ProgrammesAdmin() {
  const { data: programmes, isLoading, isError, refetch } = useProgrammes();
  const createProgramme = useCreateProgramme();
  const updateProgramme = useUpdateProgramme();
  const deleteProgramme = useDeleteProgramme();

  const [editingId, setEditingId] = useState<Id | null>(null);
  const [draft, setDraft] = useState<ProgrammeDraft>(EMPTY_DRAFT);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Programme | null>(null);

  const saving = createProgramme.isPending || updateProgramme.isPending;
  const mutationError =
    createProgramme.error?.message ?? updateProgramme.error?.message;

  function openCreate() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setFormOpen(true);
  }

  function openEdit(programme: Programme) {
    setEditingId(programme.id);
    setDraft({
      title: programme.title,
      description: programme.description,
      objectives: programme.objectives.join("\n"),
      actions: programme.actions.join("\n"),
      imageUrl: programme.imageUrl,
      displayOrder: programme.displayOrder.toString(),
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
      title: draft.title,
      description: draft.description,
      objectives: toLines(draft.objectives),
      actions: toLines(draft.actions),
      imageUrl: draft.imageUrl,
      displayOrder: BigInt(Number.parseInt(draft.displayOrder, 10) || 0),
    };
    if (editingId === null) {
      createProgramme.mutate(payload, { onSuccess: closeForm });
    } else {
      updateProgramme.mutate(
        { id: editingId, ...payload },
        { onSuccess: closeForm },
      );
    }
  }

  const canSubmit =
    draft.title.trim() !== "" && draft.description.trim() !== "";

  return (
    <div className="space-y-6" data-ocid="admin.programmes.panel">
      <AdminSectionHeader
        title="Programmes"
        description="Décrivez les programmes d'aide : objectifs, actions menées et ordre d'affichage."
        action={
          <Button
            type="button"
            className="rounded-full"
            data-ocid="admin.programmes.add_button"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nouveau programme
          </Button>
        }
      />

      {formOpen && (
        <Card className="rounded-2xl border-border shadow-subtle">
          <CardContent className="space-y-4 pt-6">
            <h3 className="font-display text-lg font-semibold">
              {editingId === null
                ? "Nouveau programme"
                : "Modifier le programme"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Titre" htmlFor="programme-title">
                <Input
                  id="programme-title"
                  data-ocid="admin.programmes.title_input"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, title: e.target.value }))
                  }
                />
              </Field>
              <Field
                label="Ordre d'affichage"
                htmlFor="programme-order"
                hint="Nombre entier, du plus petit au plus grand."
              >
                <Input
                  id="programme-order"
                  type="number"
                  min={0}
                  data-ocid="admin.programmes.order_input"
                  value={draft.displayOrder}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, displayOrder: e.target.value }))
                  }
                />
              </Field>
            </div>
            <Field label="Description" htmlFor="programme-description">
              <Textarea
                id="programme-description"
                data-ocid="admin.programmes.description_textarea"
                rows={3}
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Objectifs"
                htmlFor="programme-objectives"
                hint="Un objectif par ligne."
              >
                <Textarea
                  id="programme-objectives"
                  data-ocid="admin.programmes.objectives_textarea"
                  rows={4}
                  value={draft.objectives}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, objectives: e.target.value }))
                  }
                />
              </Field>
              <Field
                label="Actions"
                htmlFor="programme-actions"
                hint="Une action par ligne."
              >
                <Textarea
                  id="programme-actions"
                  data-ocid="admin.programmes.actions_textarea"
                  rows={4}
                  value={draft.actions}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, actions: e.target.value }))
                  }
                />
              </Field>
            </div>
            <Field label="Image (URL)" htmlFor="programme-image">
              <Input
                id="programme-image"
                data-ocid="admin.programmes.image_input"
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
                data-ocid="admin.programmes.save_button"
                disabled={!canSubmit || saving}
                onClick={submit}
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                data-ocid="admin.programmes.cancel_button"
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
          data-ocid="admin.programmes.loading_state"
          className="text-sm text-muted-foreground"
        >
          Chargement des programmes…
        </p>
      )}

      {isError && (
        <div data-ocid="admin.programmes.error_state" className="space-y-2">
          <p className="text-sm text-destructive">
            Impossible de charger les programmes.
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

      {!isLoading && !isError && (programmes?.length ?? 0) === 0 && (
        <p
          data-ocid="admin.programmes.empty_state"
          className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground"
        >
          Aucun programme enregistré. Créez le premier pour présenter vos
          actions sur le terrain.
        </p>
      )}

      <ul className="space-y-3">
        {programmes?.map((programme, index) => (
          <li
            key={programme.id.toString()}
            data-ocid={`admin.programmes.item.${index + 1}`}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-subtle sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <h3 className="truncate font-medium">{programme.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {programme.description}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {programme.objectives.length} objectif(s) ·{" "}
                {programme.actions.length} action(s) · ordre{" "}
                {programme.displayOrder.toString()}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                data-ocid={`admin.programmes.edit_button.${index + 1}`}
                onClick={() => openEdit(programme)}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Modifier
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full text-destructive"
                data-ocid={`admin.programmes.delete_button.${index + 1}`}
                onClick={() => setPendingDelete(programme)}
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
        title="Supprimer ce programme ?"
        description={`« ${pendingDelete?.title ?? ""} » sera définitivement supprimé.`}
        pending={deleteProgramme.isPending}
        ocid="admin.programmes.delete"
        onConfirm={() => {
          if (pendingDelete) {
            deleteProgramme.mutate(pendingDelete.id, {
              onSuccess: () => setPendingDelete(null),
            });
          }
        }}
      />
    </div>
  );
}
