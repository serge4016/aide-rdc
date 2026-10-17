import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { DONATION_STEPS } from "./donationOptions";

/**
 * Horizontal progress indicator for the six-step donation journey.
 * Completed steps are clickable so the donor can jump back.
 */
export function DonationProgress({
  currentIndex,
  onStepSelect,
}: {
  currentIndex: number;
  onStepSelect: (index: number) => void;
}) {
  const percent = Math.round(
    ((currentIndex + 1) / DONATION_STEPS.length) * 100,
  );

  return (
    <div data-ocid="donate.progress" className="w-full">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-foreground">
          Étape {currentIndex + 1} sur {DONATION_STEPS.length}
        </p>
        <p className="text-sm text-muted-foreground">
          {DONATION_STEPS[currentIndex].label}
        </p>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        tabIndex={0}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progression du don"
      >
        <div
          className="h-full rounded-full bg-gradient-primary transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="mt-5 hidden items-center justify-between gap-1 sm:flex">
        {DONATION_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li
              key={step.id}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <button
                type="button"
                onClick={() => done && onStepSelect(index)}
                disabled={!done}
                data-ocid={`donate.step.${step.id}`}
                aria-current={active ? "step" : undefined}
                aria-label={`Étape ${index + 1} : ${step.label}`}
                className={cn(
                  "grid size-8 place-items-center rounded-full border text-xs font-semibold transition-colors",
                  done &&
                    "cursor-pointer border-primary bg-primary text-primary-foreground hover:bg-primary/90",
                  active &&
                    "border-primary bg-background text-primary ring-2 ring-primary/25",
                  !done &&
                    !active &&
                    "cursor-default border-border bg-muted text-muted-foreground",
                )}
              >
                {done ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </button>
              <span
                className={cn(
                  "text-center text-[0.7rem] font-medium leading-tight",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
