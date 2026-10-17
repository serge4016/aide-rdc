import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Inbox } from "lucide-react";
import type { ReactNode } from "react";

/** Friendly empty state with a headline and an optional next step. */
export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  icon,
  className,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-ocid="empty_state"
      className={cn(
        "flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid size-14 place-items-center rounded-full bg-secondary text-primary">
        {icon ?? <Inbox className="size-6" aria-hidden="true" />}
      </span>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionTo && (
        <Button asChild className="mt-1 rounded-full px-5">
          <Link to={actionTo} data-ocid="empty_state.action_button">
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}

/** Inline error state with a retry action. */
export function ErrorState({
  message = "Une erreur est survenue lors du chargement des données.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      data-ocid="error_state"
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-10 text-center",
        className,
      )}
    >
      <AlertTriangle className="size-6 text-destructive" aria-hidden="true" />
      <p className="max-w-md text-sm text-foreground">{message}</p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          data-ocid="error_state.retry_button"
          className="rounded-full"
        >
          Réessayer
        </Button>
      )}
    </div>
  );
}
