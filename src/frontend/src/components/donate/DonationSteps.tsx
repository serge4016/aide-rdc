import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { usePaymentSettings } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Currency, Frequency, PaymentMethod } from "@/types";
import { Check } from "lucide-react";
import type { DonationDraft, FieldErrors } from "./donationDraft";
import {
  CURRENCY_OPTIONS,
  FREQUENCY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PRESET_AMOUNTS,
} from "./donationOptions";

/** Inline field error message. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

/** A selectable option card used across steps 1–4. */
function OptionCard({
  selected,
  onSelect,
  ocid,
  children,
  className,
}: {
  selected: boolean;
  onSelect: () => void;
  ocid: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      data-ocid={ocid}
      aria-pressed={selected}
      className={cn(
        "relative flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border bg-card hover:border-primary/40 hover:bg-secondary/40",
        className,
      )}
    >
      {children}
      {selected && (
        <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" aria-hidden="true" />
        </span>
      )}
    </button>
  );
}

/* ------------------------------- Step 1 ---------------------------------- */

export function AmountStep({
  draft,
  errors,
  onChange,
}: {
  draft: DonationDraft;
  errors: FieldErrors;
  onChange: (patch: Partial<DonationDraft>) => void;
}) {
  const presets = PRESET_AMOUNTS[draft.currency];
  const selectedPreset = presets.find((p) => String(p) === draft.amount);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">
          Choisissez votre montant
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Chaque contribution finance directement l'aide alimentaire, la santé
          et les abris d'urgence.
        </p>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-foreground">
          Devise
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {CURRENCY_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <OptionCard
                key={option.value}
                selected={draft.currency === option.value}
                onSelect={() =>
                  onChange({ currency: option.value, amount: "" })
                }
                ocid={`donate.currency.${option.value}`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </OptionCard>
            );
          })}
        </div>
      </fieldset>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Montants suggérés
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange({ amount: String(preset) })}
              data-ocid={`donate.preset.${preset}`}
              aria-pressed={selectedPreset === preset}
              className={cn(
                "rounded-lg border px-4 py-3 text-center font-display text-lg font-semibold transition-all",
                selectedPreset === preset
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary/40",
              )}
            >
              {preset.toLocaleString("fr-FR")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="donate-amount">Ou saisissez un montant libre</Label>
        <Input
          id="donate-amount"
          data-ocid="donate.amount_input"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Ex. 75"
          value={draft.amount}
          aria-invalid={!!errors.amount}
          aria-describedby={errors.amount ? "donate-amount-error" : undefined}
          onChange={(e) => onChange({ amount: e.target.value })}
          className="mt-2 h-12 text-lg"
        />
        <FieldError id="donate-amount-error" message={errors.amount} />
      </div>
    </div>
  );
}

/* ------------------------------- Step 2 ---------------------------------- */

export function FrequencyStep({
  draft,
  onChange,
}: {
  draft: DonationDraft;
  onChange: (patch: Partial<DonationDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">
          À quelle fréquence souhaitez-vous donner ?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vous pourrez modifier ou interrompre votre don mensuel à tout moment.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {FREQUENCY_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <OptionCard
              key={option.value}
              selected={draft.frequency === option.value}
              onSelect={() => onChange({ frequency: option.value })}
              ocid={`donate.frequency.${option.value}`}
              className="p-5"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base font-semibold">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </OptionCard>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------- Step 3 ---------------------------------- */

export function AllocationStep({
  draft,
  programmes,
  onChange,
}: {
  draft: DonationDraft;
  programmes: { id: bigint; title: string; description: string }[];
  onChange: (patch: Partial<DonationDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">
          Affectez votre don
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Soutenez l'ensemble de nos actions ou un programme en particulier.
        </p>
      </div>
      <div className="grid gap-3">
        <OptionCard
          selected={draft.programmeId === null}
          onSelect={() => onChange({ programmeId: null })}
          ocid="donate.allocation.general"
          className="p-5"
        >
          <span className="min-w-0">
            <span className="block font-display text-base font-semibold">
              Don général
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Nous l'affectons là où les besoins sont les plus urgents.
            </span>
          </span>
        </OptionCard>
        {programmes.map((programme) => (
          <OptionCard
            key={programme.id.toString()}
            selected={draft.programmeId === programme.id.toString()}
            onSelect={() => onChange({ programmeId: programme.id.toString() })}
            ocid={`donate.allocation.${programme.id.toString()}`}
            className="p-5"
          >
            <span className="min-w-0">
              <span className="block font-display text-base font-semibold">
                {programme.title}
              </span>
              <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
                {programme.description}
              </span>
            </span>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Step 4 ---------------------------------- */

export function MethodStep({
  draft,
  errors,
  onChange,
}: {
  draft: DonationDraft;
  errors: FieldErrors;
  onChange: (patch: Partial<DonationDraft>) => void;
}) {
  const { data: settings } = usePaymentSettings();

  // Only offer methods the administrator has enabled. Until settings load,
  // fall back to the full list so the step is never empty.
  const options = settings
    ? PAYMENT_METHOD_OPTIONS.filter((option) => settings[option.value].enabled)
    : PAYMENT_METHOD_OPTIONS;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold">
          Comment souhaitez-vous payer ?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paiement mobile ou carte bancaire internationale.
        </p>
      </div>
      {options.length === 0 ? (
        <p
          data-ocid="donate.method.empty_state"
          className="rounded-lg border border-dashed border-border bg-card px-4 py-6 text-sm text-muted-foreground"
        >
          Aucune méthode de paiement n'est disponible pour le moment. Veuillez
          réessayer plus tard.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <OptionCard
                key={option.value}
                selected={draft.method === option.value}
                onSelect={() =>
                  onChange({
                    method: option.value,
                    mobileOperator: option.mobile ? option.label : "",
                  })
                }
                ocid={`donate.method.${option.value}`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </OptionCard>
            );
          })}
        </div>
      )}
      <FieldError id="donate-method-error" message={errors.method} />
    </div>
  );
}

/* ------------------------------- Step 5 ---------------------------------- */

export function DetailsStep({
  draft,
  errors,
  onChange,
}: {
  draft: DonationDraft;
  errors: FieldErrors;
  onChange: (patch: Partial<DonationDraft>) => void;
}) {
  const isCard =
    draft.method === PaymentMethod.visa ||
    draft.method === PaymentMethod.mastercard;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold">Vos coordonnées</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elles nous permettent d'établir votre reçu et de vous remercier.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="donor-name">Nom complet</Label>
          <Input
            id="donor-name"
            data-ocid="donate.donor_name_input"
            autoComplete="name"
            value={draft.donorName}
            aria-invalid={!!errors.donorName}
            aria-describedby={errors.donorName ? "donor-name-error" : undefined}
            onChange={(e) => onChange({ donorName: e.target.value })}
            className="mt-2"
          />
          <FieldError id="donor-name-error" message={errors.donorName} />
        </div>
        <div>
          <Label htmlFor="donor-email">Adresse e-mail</Label>
          <Input
            id="donor-email"
            type="email"
            data-ocid="donate.donor_email_input"
            autoComplete="email"
            value={draft.donorEmail}
            aria-invalid={!!errors.donorEmail}
            aria-describedby={
              errors.donorEmail ? "donor-email-error" : undefined
            }
            onChange={(e) => onChange({ donorEmail: e.target.value })}
            className="mt-2"
          />
          <FieldError id="donor-email-error" message={errors.donorEmail} />
        </div>
        <div>
          <Label htmlFor="donor-phone">Téléphone</Label>
          <Input
            id="donor-phone"
            type="tel"
            data-ocid="donate.donor_phone_input"
            autoComplete="tel"
            placeholder="+243 …"
            value={draft.donorPhone}
            aria-invalid={!!errors.donorPhone}
            aria-describedby={
              errors.donorPhone ? "donor-phone-error" : undefined
            }
            onChange={(e) => onChange({ donorPhone: e.target.value })}
            className="mt-2"
          />
          <FieldError id="donor-phone-error" message={errors.donorPhone} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-secondary/40 p-5 sm:p-6">
        <h3 className="font-display text-lg font-semibold">
          {isCard ? "Détails de la carte" : "Détails du paiement mobile"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {isCard
            ? "Vos informations bancaires sont traitées de façon sécurisée."
            : "Vous recevrez un code de confirmation sur votre téléphone."}
        </p>

        {isCard ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="card-number">Numéro de carte</Label>
              <Input
                id="card-number"
                data-ocid="donate.card_number_input"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                value={draft.cardNumber}
                aria-invalid={!!errors.cardNumber}
                aria-describedby={
                  errors.cardNumber ? "card-number-error" : undefined
                }
                onChange={(e) => onChange({ cardNumber: e.target.value })}
                className="mt-2 font-mono"
              />
              <FieldError id="card-number-error" message={errors.cardNumber} />
            </div>
            <div>
              <Label htmlFor="card-expiry">Date d'expiration</Label>
              <Input
                id="card-expiry"
                data-ocid="donate.card_expiry_input"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/AA"
                value={draft.cardExpiry}
                aria-invalid={!!errors.cardExpiry}
                aria-describedby={
                  errors.cardExpiry ? "card-expiry-error" : undefined
                }
                onChange={(e) => onChange({ cardExpiry: e.target.value })}
                className="mt-2 font-mono"
              />
              <FieldError id="card-expiry-error" message={errors.cardExpiry} />
            </div>
            <div>
              <Label htmlFor="card-cvv">CVV</Label>
              <Input
                id="card-cvv"
                data-ocid="donate.card_cvv_input"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={draft.cardCvv}
                aria-invalid={!!errors.cardCvv}
                aria-describedby={errors.cardCvv ? "card-cvv-error" : undefined}
                onChange={(e) => onChange({ cardCvv: e.target.value })}
                className="mt-2 font-mono"
              />
              <FieldError id="card-cvv-error" message={errors.cardCvv} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="card-holder">Nom du titulaire</Label>
              <Input
                id="card-holder"
                data-ocid="donate.card_holder_input"
                autoComplete="cc-name"
                value={draft.cardHolder}
                aria-invalid={!!errors.cardHolder}
                aria-describedby={
                  errors.cardHolder ? "card-holder-error" : undefined
                }
                onChange={(e) => onChange({ cardHolder: e.target.value })}
                className="mt-2"
              />
              <FieldError id="card-holder-error" message={errors.cardHolder} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="billing-address">Adresse de facturation</Label>
              <Textarea
                id="billing-address"
                data-ocid="donate.billing_address_input"
                autoComplete="street-address"
                rows={2}
                value={draft.billingAddress}
                aria-invalid={!!errors.billingAddress}
                aria-describedby={
                  errors.billingAddress ? "billing-address-error" : undefined
                }
                onChange={(e) => onChange({ billingAddress: e.target.value })}
                className="mt-2"
              />
              <FieldError
                id="billing-address-error"
                message={errors.billingAddress}
              />
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="mobile-operator">Opérateur</Label>
              <Input
                id="mobile-operator"
                data-ocid="donate.mobile_operator_input"
                value={draft.mobileOperator}
                aria-invalid={!!errors.mobileOperator}
                aria-describedby={
                  errors.mobileOperator ? "mobile-operator-error" : undefined
                }
                onChange={(e) => onChange({ mobileOperator: e.target.value })}
                className="mt-2"
              />
              <FieldError
                id="mobile-operator-error"
                message={errors.mobileOperator}
              />
            </div>
            <div>
              <Label htmlFor="mobile-confirmation">Code de confirmation</Label>
              <Input
                id="mobile-confirmation"
                data-ocid="donate.mobile_confirmation_input"
                inputMode="numeric"
                placeholder="Ex. 123456"
                value={draft.mobileConfirmation}
                aria-invalid={!!errors.mobileConfirmation}
                aria-describedby={
                  errors.mobileConfirmation
                    ? "mobile-confirmation-error"
                    : undefined
                }
                onChange={(e) =>
                  onChange({ mobileConfirmation: e.target.value })
                }
                className="mt-2 font-mono"
              />
              <FieldError
                id="mobile-confirmation-error"
                message={errors.mobileConfirmation}
              />
            </div>
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Un code de confirmation vous sera envoyé par votre opérateur.
              Saisissez-le ici pour valider le paiement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
