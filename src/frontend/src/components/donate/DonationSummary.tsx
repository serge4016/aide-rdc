import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  CURRENCY_LABELS,
  type Currency,
  FREQUENCY_LABELS,
  type Frequency,
  PAYMENT_METHOD_LABELS,
  type PaymentMethod,
} from "@/types";
import type { ReactNode } from "react";

export interface SummaryRow {
  label: string;
  value: ReactNode;
}

/** A labelled definition row used inside the donation recap. */
export function SummaryRowItem({ label, value }: SummaryRow) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

/** Recap of the donation, shared by step 6 and the confirmation page. */
export function DonationSummary({
  amount,
  currency,
  frequency,
  programmeTitle,
  method,
  donorName,
  donorEmail,
  donorPhone,
  className,
}: {
  amount: bigint;
  currency: Currency;
  frequency: Frequency;
  programmeTitle: string | null;
  method: PaymentMethod;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  className?: string;
}) {
  return (
    <Card
      data-ocid="donate.summary"
      className={cn("rounded-lg border-border shadow-none", className)}
    >
      <CardContent className="p-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Montant du don
          </span>
          <span className="font-display text-3xl font-semibold text-primary">
            {formatAmount(amount, currency)}
          </span>
        </div>
        <Separator className="my-4" />
        <dl className="divide-y divide-border">
          <SummaryRowItem label="Devise" value={CURRENCY_LABELS[currency]} />
          <SummaryRowItem
            label="Fréquence"
            value={FREQUENCY_LABELS[frequency]}
          />
          <SummaryRowItem
            label="Affectation"
            value={
              programmeTitle ??
              "Don général — là où les besoins sont les plus urgents"
            }
          />
          <SummaryRowItem
            label="Méthode de paiement"
            value={PAYMENT_METHOD_LABELS[method]}
          />
          <SummaryRowItem label="Donateur" value={donorName} />
          <SummaryRowItem label="E-mail" value={donorEmail} />
          {donorPhone && (
            <SummaryRowItem label="Téléphone" value={donorPhone} />
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
