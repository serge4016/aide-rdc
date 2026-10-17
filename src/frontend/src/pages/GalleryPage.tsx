import { CardGridSkeleton } from "@/components/layout/LoadingStates";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { EmptyState, ErrorState } from "@/components/layout/States";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePhotos } from "@/hooks/useQueries";
import type { Photo } from "@/types";
import { Camera, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/** A single photo tile in the gallery grid. */
function PhotoCard({
  photo,
  index,
  onOpen,
}: {
  photo: Photo;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-ocid={`gallery.item.${index + 1}`}
      aria-label={`Agrandir la photo : ${photo.caption}`}
      className="group relative block w-full overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition-smooth hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={photo.imageUrl}
          alt={photo.caption}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-card/90 text-primary opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
          <Camera className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="flex items-start gap-2 p-4">
        <span
          className="mt-1 h-4 w-1 shrink-0 rounded-full flag-ribbon"
          aria-hidden="true"
        />
        <p className="text-sm leading-relaxed text-foreground">
          {photo.caption}
        </p>
      </div>
    </button>
  );
}

/** Full-size photo viewer with previous/next navigation. */
function PhotoLightbox({
  photos,
  activeIndex,
  onClose,
  onNavigate,
}: {
  photos: Photo[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const open = activeIndex !== null;
  const photo = activeIndex !== null ? photos[activeIndex] : undefined;

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex - 1 + photos.length) % photos.length);
  }, [activeIndex, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex + 1) % photos.length);
  }, [activeIndex, photos.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, goPrev, goNext]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        data-ocid="gallery.modal"
        className="max-w-4xl gap-0 overflow-hidden border-border bg-card p-0"
      >
        {photo && (
          <div className="flex flex-col">
            <div className="relative bg-foreground/95">
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="mx-auto max-h-[70vh] w-full object-contain"
              />
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    data-ocid="gallery.pagination_prev"
                    aria-label="Photo précédente"
                    className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-sm transition-smooth hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    data-ocid="gallery.pagination_next"
                    aria-label="Photo suivante"
                    className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-sm transition-smooth hover:bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-col gap-1 p-5">
              <DialogTitle className="font-display text-lg font-semibold">
                {photo.caption}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {activeIndex !== null
                  ? `Photo ${activeIndex + 1} sur ${photos.length}`
                  : ""}
              </DialogDescription>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function GalleryPage() {
  const { data: photos, isLoading, isError, refetch } = usePhotos();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const sorted = photos
    ? [...photos].sort((a, b) => Number(a.displayOrder - b.displayOrder))
    : [];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Galerie"
        title="Nos actions sur le terrain"
        lead="Des images de nos interventions auprès des personnes déplacées dans l'est de la République démocratique du Congo, présentées avec dignité et transparence."
      />

      <div className="mt-10">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : isError ? (
          <ErrorState
            message="Impossible de charger la galerie pour le moment."
            onRetry={() => void refetch()}
          />
        ) : sorted.length === 0 ? (
          <EmptyState
            title="Aucune photo pour le moment"
            description="Notre galerie s'enrichit au fil de nos missions. Revenez bientôt pour découvrir nos actions sur le terrain."
            icon={<ImageOff className="size-6" aria-hidden="true" />}
          />
        ) : (
          <div
            data-ocid="gallery.list"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sorted.map((photo, index) => (
              <PhotoCard
                key={photo.id.toString()}
                photo={photo}
                index={index}
                onOpen={() => setActiveIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <PhotoLightbox
        photos={sorted}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </PageContainer>
  );
}
