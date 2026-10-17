import { Skeleton } from "@/components/ui/skeleton";

/** Layout-matched skeleton for a grid of content cards. */
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  const ids = Array.from({ length: count }, (_, i) => `card-skeleton-${i}`);
  return (
    <div
      data-ocid="loading_state"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {ids.map((id) => (
        <div
          key={id}
          className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
        >
          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

/** Layout-matched skeleton for a list of text rows. */
export function ListSkeleton({ count = 4 }: { count?: number }) {
  const ids = Array.from({ length: count }, (_, i) => `list-skeleton-${i}`);
  return (
    <div data-ocid="loading_state" className="flex flex-col gap-4">
      {ids.map((id) => (
        <div
          key={id}
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6"
        >
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}
