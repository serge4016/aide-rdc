import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  usePaymentSettings,
  useUpdatePaymentSettings,
} from "@/hooks/useQueries";
import {
  CURRENCY_LABELS,
  Currency,
  type MethodSettings,
  PAYMENT_METHOD_LABELS,
  PaymentMethod,
  type PaymentSettings,
} from "@/types";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminSectionHeader, Field, MutationError } from "./AdminUI";

const METHOD_ORDER: PaymentMethod[] = [
  PaymentMethod.mpesa,
  PaymentMethod.orangeMoney,
  PaymentMethod.airtelMoney,
  PaymentMethod.afrimoney,
  PaymentMethod.visa,
  PaymentMethod.mastercard,
];

const EMPTY_METHOD: MethodSettings = {
  enabled: false,
  apiKey: "",
  apiSecret: "",
};

const EMPTY_SETTINGS: PaymentSettings = {
  mpesa: EMPTY_METHOD,
  orangeMoney: EMPTY_METHOD,
  airtelMoney: EMPTY_METHOD,
  afrimoney: EMPTY_METHOD,
  visa: EMPTY_METHOD,
  mastercard: EMPTY_METHOD,
  acceptedCurrencies: [Currency.usd],
  testMode: true,
  webhookUrl: "",
};

export function PaymentSettingsAdmin() {
  const { data, isLoading, isError, refetch } = usePaymentSettings();
  const updateSettings = useUpdatePaymentSettings();

  const [draft, setDraft] = useState<PaymentSettings>(EMPTY_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  function setMethod(method: PaymentMethod, next: Partial<MethodSettings>) {
    setSaved(false);
    setDraft((d) => ({ ...d, [method]: { ...d[method], ...next } }));
  }

  function toggleCurrency(currency: Currency, checked: boolean) {
    setSaved(false);
    setDraft((d) => ({
      ...d,
      acceptedCurrencies: checked
        ? [...d.acceptedCurrencies.filter((c) => c !== currency), currency]
        : d.acceptedCurrencies.filter((c) => c !== currency),
    }));
  }

  function save() {
    setSaved(false);
    updateSettings.mutate(draft, { onSuccess: () => setSaved(true) });
  }

  if (isLoading) {
    return (
      <div
        data-ocid="admin.payments.loading_state"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        Chargement des paramètres de paiement…
      </div>
    );
  }

  if (isError) {
    return (
      <div data-ocid="admin.payments.error_state" className="space-y-2">
        <p className="text-sm text-destructive">
          Impossible de charger les paramètres de paiement.
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
    );
  }

  return (
    <div className="space-y-6" data-ocid="admin.payments.panel">
      <AdminSectionHeader
        title="Paramètres de paiement"
        description="Activez les méthodes de paiement, renseignez les clés API et choisissez les devises acceptées."
      />

      <Card className="rounded-2xl border-border shadow-subtle">
        <CardContent className="space-y-5 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Switch
                id="test-mode"
                data-ocid="admin.payments.test_mode_switch"
                checked={draft.testMode}
                onCheckedChange={(checked) => {
                  setSaved(false);
                  setDraft((d) => ({ ...d, testMode: checked }));
                }}
              />
              <div>
                <label htmlFor="test-mode" className="text-sm font-medium">
                  Mode test
                </label>
                <p className="text-xs text-muted-foreground">
                  {draft.testMode
                    ? "Les transactions sont simulées, aucun paiement réel n'est débité."
                    : "Mode production : les paiements réels sont traités."}
                </p>
              </div>
            </div>
            <span
              className={
                draft.testMode
                  ? "rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent-foreground"
                  : "rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
              }
            >
              {draft.testMode ? "Test" : "Production"}
            </span>
          </div>

          <Field
            label="URL de webhook"
            htmlFor="webhook-url"
            hint="Adresse appelée par le fournisseur pour confirmer chaque paiement."
          >
            <Input
              id="webhook-url"
              data-ocid="admin.payments.webhook_input"
              placeholder="https://…"
              value={draft.webhookUrl}
              onChange={(e) => {
                setSaved(false);
                setDraft((d) => ({ ...d, webhookUrl: e.target.value }));
              }}
            />
          </Field>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Devises acceptées</legend>
            <div className="flex flex-wrap gap-6">
              {Object.values(Currency).map((currency) => (
                <div key={currency} className="flex items-center gap-2">
                  <Checkbox
                    id={`currency-${currency}`}
                    data-ocid={`admin.payments.currency_checkbox.${currency}`}
                    checked={draft.acceptedCurrencies.includes(currency)}
                    onCheckedChange={(checked) =>
                      toggleCurrency(currency, checked === true)
                    }
                  />
                  <label htmlFor={`currency-${currency}`} className="text-sm">
                    {CURRENCY_LABELS[currency]}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {METHOD_ORDER.map((method) => {
          const settings = draft[method];
          return (
            <Card
              key={method}
              data-ocid={`admin.payments.method.${method}`}
              className="rounded-2xl border-border shadow-subtle"
            >
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <KeyRound
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    <h3 className="font-medium">
                      {PAYMENT_METHOD_LABELS[method]}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {settings.enabled ? "Activé" : "Désactivé"}
                    </span>
                    <Switch
                      data-ocid={`admin.payments.method_switch.${method}`}
                      checked={settings.enabled}
                      onCheckedChange={(checked) =>
                        setMethod(method, { enabled: checked })
                      }
                    />
                  </div>
                </div>
                <Field label="Clé API" htmlFor={`api-key-${method}`}>
                  <Input
                    id={`api-key-${method}`}
                    data-ocid={`admin.payments.api_key_input.${method}`}
                    value={settings.apiKey}
                    onChange={(e) =>
                      setMethod(method, { apiKey: e.target.value })
                    }
                  />
                </Field>
                <Field label="Secret API" htmlFor={`api-secret-${method}`}>
                  <Input
                    id={`api-secret-${method}`}
                    type="password"
                    data-ocid={`admin.payments.api_secret_input.${method}`}
                    value={settings.apiSecret}
                    onChange={(e) =>
                      setMethod(method, { apiSecret: e.target.value })
                    }
                  />
                </Field>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          className="rounded-full"
          data-ocid="admin.payments.save_button"
          disabled={updateSettings.isPending}
          onClick={save}
        >
          {updateSettings.isPending && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          Enregistrer les paramètres
        </Button>
        {saved && (
          <span
            data-ocid="admin.payments.success_state"
            className="flex items-center gap-1.5 text-sm text-primary"
          >
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Paramètres enregistrés.
          </span>
        )}
      </div>
      <MutationError message={updateSettings.error?.message} />
    </div>
  );
}
