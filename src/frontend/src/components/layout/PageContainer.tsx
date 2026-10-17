import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Consistent vertical rhythm and max width for every page body. */
export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Page title block with an optional eyebrow and lead paragraph. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <header className={cn("max-w-3xl", className)}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="text-balance font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {title}
      </h1>
      {lead && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {lead}
        </p>
      )}
    </header>
  );
}

/** Warm alternating section band used to separate content zones. */
export function SectionBand({
  children,
  tone = "cream",
  className,
}: {
  children: ReactNode;
  tone?: "cream" | "plain";
  className?: string;
}) {
  return (
    <section
      className={cn(
        tone === "cream" ? "bg-secondary/50" : "bg-background",
        className,
      )}
    >
      <PageContainer>{children}</PageContainer>
    </section>
  );
}
