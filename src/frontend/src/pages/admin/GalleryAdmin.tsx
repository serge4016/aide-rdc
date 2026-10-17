import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCreatePhoto,
  useDeletePhoto,
  usePhotos,
  useUpdatePhoto,
} from "@/hooks/useQueries";
import type { Id, Photo } from "@/types";
import { ImagePlus, Pencil, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import {
  AdminSectionHeader,
  ConfirmDeleteDialog,
  Field,
  MutationError,
} from "./AdminUI";

interface PhotoDraft {
  imageUrl: string;
  caption: string;
  displayOrder: string;
}

const EMPTY_DRAFT: PhotoDraft = {
  imageUrl: "",
  caption: "",
  displayOrder: "0",
};

export function GalleryAdmin() {
  const { data: photos, isLoading, isError, refetch } = usePhotos();
  const createPhoto = useCreatePhoto();
  const updatePhoto = useUpdatePhoto();
  const deletePhoto = useDeletePhoto();

  const [editingId, setEditingId] = useState<Id | null>(null);
  const [draft, setDraft] = useState<PhotoDraft>(EMPTY_DRAFT);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Photo | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saving = createPhoto.isPending || updatePhoto.isPending;
  const mutationError =
    createPhoto.error?.message ?? updatePhoto.error?.message;

  function openCreate() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setUploadError(null);
    setFormOpen(true);
  }

  function openEdit(photo: Photo) {
    setEditingId(photo.id);
    setDraft({
      imageUrl: photo.imageUrl,
      caption: photo.caption,
      displayOrder: photo.displayOrder.toString(),
    });
    setUploadError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setUploadError(null);
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Veuillez choisir un fichier image.");
      return;
    }
    if (file.size > 2_000_000) {
      setUploadError("L'image ne doit pas dépasser 2 Mo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft((d) => ({ ...d, imageUrl: reader.result as string }));
        setUploadError(null);
      }
    };
    reader.onerror = () => setUploadError("Lecture du fichier impossible.");
    reader.readAsDataURL(file);
  }

  function submit() {
    const payload = {
      imageUrl: draft.imageUrl,
      caption: draft.caption,
      displayOrder: BigInt(Number.parseInt(draft.displayOrder, 10) || 0),
    };
    if (editingId === null) {
      createPhoto.mutate(payload, { onSuccess: closeForm });
    } else {
      updatePhoto.mutate(
        { id: editingId, ...payload },
        { onSuccess: closeForm },
      );
    }
  }

  const canSubmit = draft.imageUrl.trim() !== "";

  return (
    <div className="space-y-6" data-ocid="admin.gallery.panel">
      <AdminSectionHeader
        title="Galerie photos"
        description="Téléversez des images de vos actions sur le terrain et légendez-les."
        action={
          <Button
            type="button"
            className="rounded-full"
            data-ocid="admin.gallery.add_button"
            onClick={openCreate}
          >
            <ImagePlus className="size-4" aria-hidden="true" />
            Ajouter une photo
          </Button>
        }
      />

      {formOpen && (
        <Card className="rounded-2xl border-border shadow-subtle">
          <CardContent className="space-y-4 pt-6">
            <h3 className="font-display text-lg font-semibold">
              {editingId === null ? "Nouvelle photo" : "Modifier la photo"}
            </h3>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="grid size-32 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-muted">
                {draft.imageUrl ? (
                  <img
                    src={draft.imageUrl}
                    alt="Aperçu de l'image sélectionnée"
                    className="size-full object-cover"
                  />
                ) : (
                  <ImagePlus
                    className="size-8 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  data-ocid="admin.gallery.file_input"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  data-ocid="admin.gallery.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-4" aria-hidden="true" />
                  Téléverser une image
                </Button>
                <Field
                  label="Ou adresse de l'image (URL)"
                  htmlFor="photo-url"
                  hint="Vous pouvez coller l'adresse d'une image hébergée."
                >
                  <Input
                    id="photo-url"
                    data-ocid="admin.gallery.url_input"
                    value={
                      draft.imageUrl.startsWith("data:") ? "" : draft.imageUrl
                    }
                    placeholder="https://…"
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, imageUrl: e.target.value }))
                    }
                  />
                </Field>
                {uploadError && (
                  <p role="alert" className="text-xs text-destructive">
                    {uploadError}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Légende" htmlFor="photo-caption">
                <Input
                  id="photo-caption"
                  data-ocid="admin.gallery.caption_input"
                  value={draft.caption}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, caption: e.target.value }))
                  }
                />
              </Field>
              <Field
                label="Ordre d'affichage"
                htmlFor="photo-order"
                hint="Nombre entier, du plus petit au plus grand."
              >
                <Input
                  id="photo-order"
                  type="number"
                  min={0}
                  data-ocid="admin.gallery.order_input"
                  value={draft.displayOrder}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, displayOrder: e.target.value }))
                  }
                />
              </Field>
            </div>

            <MutationError message={mutationError} />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="rounded-full"
                data-ocid="admin.gallery.save_button"
                disabled={!canSubmit || saving}
                onClick={submit}
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                data-ocid="admin.gallery.cancel_button"
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
          data-ocid="admin.gallery.loading_state"
          className="text-sm text-muted-foreground"
        >
          Chargement de la galerie…
        </p>
      )}

      {isError && (
        <div data-ocid="admin.gallery.error_state" className="space-y-2">
          <p className="text-sm text-destructive">
            Impossible de charger la galerie.
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

      {!isLoading && !isError && (photos?.length ?? 0) === 0 && (
        <p
          data-ocid="admin.gallery.empty_state"
          className="rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground"
        >
          La galerie est vide. Téléversez une première photo pour la montrer sur
          le site.
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos?.map((photo, index) => (
          <li
            key={photo.id.toString()}
            data-ocid={`admin.gallery.item.${index + 1}`}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-subtle"
          >
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={photo.imageUrl}
                alt={photo.caption || "Photo de la galerie"}
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-medium">
                {photo.caption || "Sans légende"}
              </p>
              <p className="text-xs text-muted-foreground">
                Ordre {photo.displayOrder.toString()}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full"
                  data-ocid={`admin.gallery.edit_button.${index + 1}`}
                  onClick={() => openEdit(photo)}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  Modifier
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full text-destructive"
                  data-ocid={`admin.gallery.delete_button.${index + 1}`}
                  onClick={() => setPendingDelete(photo)}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Supprimer
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Supprimer cette photo ?"
        description="La photo sera définitivement retirée de la galerie."
        pending={deletePhoto.isPending}
        ocid="admin.gallery.delete"
        onConfirm={() => {
          if (pendingDelete) {
            deletePhoto.mutate(pendingDelete.id, {
              onSuccess: () => setPendingDelete(null),
            });
          }
        }}
      />
    </div>
  );
}
