import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatAmount, formatDate } from "@/lib/format";
import { SITE } from "@/lib/site";
import {
  CURRENCY_LABELS,
  type Currency,
  FREQUENCY_LABELS,
  type Frequency,
  PAYMENT_METHOD_LABELS,
  type PaymentMethod,
} from "@/types";
import { Download, Heart } from "lucide-react";

export interface ReceiptData {
  transactionNumber: string;
  amount: bigint;
  currency: Currency;
  frequency: Frequency;
  method: PaymentMethod;
  programmeTitle: string | null;
  donorName: string;
  donorEmail: string;
  createdAt: bigint;
}

/** Build a plain-text receipt and trigger a browser download. */
function downloadReceipt(data: ReceiptData) {
  const lines = [
    `${SITE.name} — Reçu de don`,
    "========================================",
    `Numéro de transaction : ${data.transactionNumber}`,
    `Date : ${formatDate(data.createdAt)}`,
    "",
    `Montant : ${formatAmount(data.amount, data.currency)}`,
    `Devise : ${CURRENCY_LABELS[data.currency]}`,
    `Fréquence : ${FREQUENCY_LABELS[data.frequency]}`,
    `Affectation : ${data.programmeTitle ?? "Don général"}`,
    `Méthode de paiement : ${PAYMENT_METHOD_LABELS[data.method]}`,
    "",
    `Donateur : ${data.donorName}`,
    `E-mail : ${data.donorEmail}`,
    "",
    "Merci pour votre générosité. Votre don soutient directement",
    "les personnes déplacées dans l'est de la République démocratique du Congo.",
    "",
    `${SITE.email} — ${SITE.phone}`,
    SITE.address,
  ];

  const blob = new Blob([lines.join("\n")], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `recu-${data.transactionNumber}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** Downloadable donation receipt with the unique transaction number. */
export function DonationReceipt({ data }: { data: ReceiptData }) {
  return (
    <Card
      data-ocid="donate.receipt"
      className="overflow-hidden rounded-lg border-border shadow-none"
    >
      <div className="h-1.5 w-full flag-ribbon" aria-hidden="true" />
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-gradient-primary text-primary-foreground">
              <Heart className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">{SITE.name}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Reçu de don
              </p>
            </div>
          </div>
          <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
            Confirmé
          </span>
        </div>

        <Separator className="my-6" />

        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Numéro de transaction
            </dt>
            <dd
              data-ocid="donate.transaction_number"
              className="mt-1 font-mono text-sm font-semibold text-foreground"
            >
              {data.transactionNumber}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Date
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {formatDate(data.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Montant
            </dt>
            <dd className="mt-1 font-display text-xl font-semibold text-primary">
              {formatAmount(data.amount, data.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Fréquence
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {FREQUENCY_LABELS[data.frequency]}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Affectation
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {data.programmeTitle ?? "Don général"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Méthode de paiement
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {PAYMENT_METHOD_LABELS[data.method]}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              Donateur
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {data.donorName}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              E-mail
            </dt>
            <dd className="mt-1 break-all text-sm font-medium text-foreground">
              {data.donorEmail}
            </dd>
          </div>
        </dl>

        <Separator className="my-6" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            Conservez ce reçu. Il atteste de votre don auprès de {SITE.name}.
          </p>
          <Button
            type="button"
            onClick={() => downloadReceipt(data)}
            data-ocid="donate.download_receipt_button"
            className="rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <Download className="size-4" aria-hidden="true" />
            Télécharger le reçu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
