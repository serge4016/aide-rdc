import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

/** Section heading used at the top of every admin panel. */
export function AdminSectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

/** Labelled form control wrapper with an optional hint. */
export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Confirmation dialog for destructive actions. */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  pending,
  onConfirm,
  ocid,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  pending: boolean;
  onConfirm: () => void;
  ocid: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid={`${ocid}.modal`} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            data-ocid={`${ocid}.cancel_button`}
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-full"
            data-ocid={`${ocid}.confirm_button`}
            disabled={pending}
            onClick={onConfirm}
          >
            {pending && (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            )}
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Inline error banner for failed mutations. */
export function MutationError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      data-ocid="admin.mutation_error"
      className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  );
}
