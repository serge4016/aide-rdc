import {
  Currency,
  Frequency,
  PAYMENT_METHOD_LABELS,
  PaymentMethod,
} from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  CalendarClock,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
} from "lucide-react";

/** Preset amounts offered for each supported currency. */
export const PRESET_AMOUNTS: Record<Currency, number[]> = {
  [Currency.usd]: [10, 25, 50, 100, 250],
  [Currency.cdf]: [5000, 10000, 25000, 50000, 100000],
};

/** Smallest accepted amount per currency, used for validation. */
export const MIN_AMOUNT: Record<Currency, number> = {
  [Currency.usd]: 1,
  [Currency.cdf]: 500,
};

/** Largest accepted amount per currency, used for validation. */
export const MAX_AMOUNT: Record<Currency, number> = {
  [Currency.usd]: 1_000_000,
  [Currency.cdf]: 500_000_000,
};

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Mobile-money methods require a phone number and a confirmation code. */
  mobile: boolean;
}

/** Ordered payment methods shown in step 4. */
export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  {
    value: PaymentMethod.mpesa,
    label: PAYMENT_METHOD_LABELS[PaymentMethod.mpesa],
    description: "Vodacom — paiement mobile",
    icon: Smartphone,
    mobile: true,
  },
  {
    value: PaymentMethod.orangeMoney,
    label: PAYMENT_METHOD_LABELS[PaymentMethod.orangeMoney],
    description: "Orange — paiement mobile",
    icon: Smartphone,
    mobile: true,
  },
  {
    value: PaymentMethod.airtelMoney,
    label: PAYMENT_METHOD_LABELS[PaymentMethod.airtelMoney],
    description: "Airtel — paiement mobile",
    icon: Smartphone,
    mobile: true,
  },
  {
    value: PaymentMethod.afrimoney,
    label: PAYMENT_METHOD_LABELS[PaymentMethod.afrimoney],
    description: "Africell — paiement mobile",
    icon: Smartphone,
    mobile: true,
  },
  {
    value: PaymentMethod.visa,
    label: PAYMENT_METHOD_LABELS[PaymentMethod.visa],
    description: "Carte bancaire internationale",
    icon: CreditCard,
    mobile: false,
  },
  {
    value: PaymentMethod.mastercard,
    label: PAYMENT_METHOD_LABELS[PaymentMethod.mastercard],
    description: "Carte bancaire internationale",
    icon: CreditCard,
    mobile: false,
  },
];

/** Frequency choices shown in step 2. */
export const FREQUENCY_OPTIONS: {
  value: Frequency;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: Frequency.oneTime,
    label: "Don ponctuel",
    description: "Un versement unique, quand vous le souhaitez.",
    icon: Banknote,
  },
  {
    value: Frequency.monthly,
    label: "Don mensuel",
    description: "Un soutien régulier qui nous aide à planifier nos actions.",
    icon: CalendarClock,
  },
];

/** Currency choices shown in step 1. */
export const CURRENCY_OPTIONS: {
  value: Currency;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: Currency.usd,
    label: "Dollar américain",
    description: "USD — devise de référence",
    icon: Landmark,
  },
  {
    value: Currency.cdf,
    label: "Franc congolais",
    description: "CDF — devise locale",
    icon: Wallet,
  },
];

/** The six ordered steps of the donation journey. */
export const DONATION_STEPS = [
  { id: "montant", label: "Montant" },
  { id: "frequence", label: "Fréquence" },
  { id: "affectation", label: "Affectation" },
  { id: "methode", label: "Paiement" },
  { id: "coordonnees", label: "Coordonnées" },
  { id: "recapitulatif", label: "Récapitulatif" },
] as const;

export type DonationStepId = (typeof DONATION_STEPS)[number]["id"];
