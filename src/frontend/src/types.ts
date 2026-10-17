import { Currency, DonationStatus, Frequency, PaymentMethod } from "@/backend";
import type {
  Article,
  Campaign,
  ContactMessage,
  Donation,
  DonorInfo,
  Id,
  MethodSettings,
  PaymentSettings,
  Photo,
  Programme,
  Testimony,
  Timestamp,
} from "@/backend";

export { Currency, DonationStatus, Frequency, PaymentMethod };

export type {
  Article,
  Campaign,
  ContactMessage,
  Donation,
  DonorInfo,
  Id,
  MethodSettings,
  PaymentSettings,
  Photo,
  Programme,
  Testimony,
  Timestamp,
};

/** A programme paired with its optional donation target. */
export interface ProgrammeWithCampaign {
  programme: Programme;
  campaign: Campaign | null;
}

/** Human-readable French labels for the payment method variants. */
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.mpesa]: "M-Pesa",
  [PaymentMethod.orangeMoney]: "Orange Money",
  [PaymentMethod.airtelMoney]: "Airtel Money",
  [PaymentMethod.afrimoney]: "Afrimoney",
  [PaymentMethod.visa]: "Visa",
  [PaymentMethod.mastercard]: "Mastercard",
};

/** Human-readable French labels for the donation status variants. */
export const DONATION_STATUS_LABELS: Record<DonationStatus, string> = {
  [DonationStatus.pending]: "En attente",
  [DonationStatus.confirmed]: "Confirmé",
  [DonationStatus.failed]: "Échoué",
};

/** Human-readable French labels for the currency variants. */
export const CURRENCY_LABELS: Record<Currency, string> = {
  [Currency.usd]: "USD",
  [Currency.cdf]: "CDF",
};

/** Human-readable French labels for the donation frequency variants. */
export const FREQUENCY_LABELS: Record<Frequency, string> = {
  [Frequency.oneTime]: "Don ponctuel",
  [Frequency.monthly]: "Don mensuel",
};
