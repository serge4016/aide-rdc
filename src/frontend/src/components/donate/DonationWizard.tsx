import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateDonation, useProgrammes } from "@/hooks/useQueries";
import { PaymentMethod } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DonationProgress } from "./DonationProgress";
import {
  AllocationStep,
  AmountStep,
  DetailsStep,
  FrequencyStep,
  MethodStep,
} from "./DonationSteps";
import { DonationSummary } from "./DonationSummary";
import {
  type DonationDraft,
  type FieldErrors,
  INITIAL_DRAFT,
  hasErrors,
  parseAmount,
  validateAmount,
  validateDetails,
  validateMethod,
} from "./donationDraft";
import { DONATION_STEPS } from "./donationOptions";

/** Multi-step donation journey: amount → frequency → allocation → method → details → recap. */
export function DonationWizard() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<DonationDraft>(INITIAL_DRAFT);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: programmes = [] } = useProgrammes();
  const createDonation = useCreateDonation();

  const selectedProgramme = useMemo(
    () =>
      draft.programmeId === null
        ? null
        : (programmes.find((p) => p.id.toString() === draft.programmeId) ??
          null),
    [draft.programmeId, programmes],
  );

  const amountValue = parseAmount(draft.amount) ?? 0;

  function update(patch: Partial<DonationDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof DonationDraft)[]) {
        delete next[key];
      }
      return next;
    });
  }

  function validateStep(index: number): FieldErrors {
    if (index === 0) return validateAmount(draft);
    if (index === 3) return validateMethod(draft);
    if (index === 4) return validateDetails(draft);
    return {};
  }

  function goNext() {
    const stepErrors = validateStep(stepIndex);
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStepIndex((i) => Math.min(i + 1, DONATION_STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleSubmit() {
    const stepErrors = {
      ...validateAmount(draft),
      ...validateMethod(draft),
      ...validateDetails(draft),
    };
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      return;
    }
    if (!draft.method) return;

    setSubmitError(null);
    createDonation.mutate(
      {
        amount: BigInt(amountValue),
        currency: draft.currency,
        frequency: draft.frequency,
        programmeId: selectedProgramme ? selectedProgramme.id : null,
        method: draft.method,
        donor: {
          name: draft.donorName.trim(),
          email: draft.donorEmail.trim(),
          phone: draft.donorPhone.trim() || undefined,
        },
      },
      {
        onSuccess: (donation) => {
          void navigate({
            to: "/don/confirmation",
            search: { id: donation.id.toString() },
          });
        },
        onError: () => {
          setSubmitError(
            "Le don n'a pas pu être enregistré. Vérifiez vos informations et réessayez.",
          );
        },
      },
    );
  }

  const isLastStep = stepIndex === DONATION_STEPS.length - 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <Card className="rounded-lg border-border shadow-none">
        <CardContent className="p-6 sm:p-8">
          <DonationProgress
            currentIndex={stepIndex}
            onStepSelect={(index) => {
              setErrors({});
              setStepIndex(index);
            }}
          />

          <div className="mt-8">
            {stepIndex === 0 && (
              <AmountStep draft={draft} errors={errors} onChange={update} />
            )}
            {stepIndex === 1 && (
              <FrequencyStep draft={draft} onChange={update} />
            )}
            {stepIndex === 2 && (
              <AllocationStep
                draft={draft}
                programmes={programmes}
                onChange={update}
              />
            )}
            {stepIndex === 3 && (
              <MethodStep draft={draft} errors={errors} onChange={update} />
            )}
            {stepIndex === 4 && (
              <DetailsStep draft={draft} errors={errors} onChange={update} />
            )}
            {stepIndex === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Vérifiez votre don
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Relisez les informations avant de valider votre don.
                  </p>
                </div>
                <DonationSummary
                  amount={BigInt(amountValue)}
                  currency={draft.currency}
                  frequency={draft.frequency}
                  programmeTitle={selectedProgramme?.title ?? null}
                  method={draft.method ?? PaymentMethod.visa}
                  donorName={draft.donorName.trim()}
                  donorEmail={draft.donorEmail.trim()}
                  donorPhone={draft.donorPhone.trim() || undefined}
                />
              </div>
            )}
          </div>

          {submitError && (
            <div
              data-ocid="donate.error_state"
              className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
            >
              <AlertTriangle
                className="mt-0.5 size-5 shrink-0 text-destructive"
                aria-hidden="true"
              />
              <p className="text-sm text-foreground">{submitError}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={stepIndex === 0 || createDonation.isPending}
              data-ocid="donate.back_button"
              className="rounded-full"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Retour
            </Button>

            {isLastStep ? (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={createDonation.isPending}
                data-ocid="donate.submit_button"
                className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
              >
                {createDonation.isPending ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                    Traitement…
                  </>
                ) : (
                  "Confirmer mon don"
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                data-ocid="donate.next_button"
                className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Continuer
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="rounded-lg border border-border bg-secondary/40 p-5">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="size-5" aria-hidden="true" />
            <p className="text-sm font-semibold">Don sécurisé</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Vos informations sont traitées de manière confidentielle. Aucun
            prélèvement n'est effectué sans votre validation.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground">Votre impact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>25 USD — un kit alimentaire pour une famille</li>
            <li>50 USD — une consultation médicale d'urgence</li>
            <li>100 USD — une bâche et des couvertures</li>
          </ul>
        </div>
        <p className="px-1 text-xs leading-relaxed text-muted-foreground">
          Paiement traité en mode démonstration. Les cartes peuvent être
          traitées via Stripe lorsque l'administrateur a configuré une clé
          valide.
        </p>
      </aside>
    </div>
  );
}
