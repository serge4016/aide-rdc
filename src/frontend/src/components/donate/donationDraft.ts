import { Currency, Frequency, PaymentMethod } from "@/types";
import { MAX_AMOUNT, MIN_AMOUNT } from "./donationOptions";

/** The full in-progress donation draft owned by the wizard. */
export interface DonationDraft {
  amount: string;
  currency: Currency;
  frequency: Frequency;
  programmeId: string | null;
  method: PaymentMethod | null;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardHolder: string;
  billingAddress: string;
  mobileOperator: string;
  mobileConfirmation: string;
}

export const INITIAL_DRAFT: DonationDraft = {
  amount: "",
  currency: Currency.usd,
  frequency: Frequency.oneTime,
  programmeId: null,
  method: null,
  donorName: "",
  donorEmail: "",
  donorPhone: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
  cardHolder: "",
  billingAddress: "",
  mobileOperator: "",
  mobileConfirmation: "",
};

export type FieldErrors = Partial<Record<keyof DonationDraft, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Parse a user-entered amount into a whole number, or null when invalid. */
export function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[\s\u00a0.]/g, "").replace(",", ".");
  if (cleaned === "") return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  return Math.round(value);
}

/** Validate step 1 — amount and currency. */
export function validateAmount(draft: DonationDraft): FieldErrors {
  const errors: FieldErrors = {};
  const value = parseAmount(draft.amount);
  if (value === null) {
    errors.amount = "Indiquez un montant.";
  } else if (value < MIN_AMOUNT[draft.currency]) {
    errors.amount = `Le montant minimum est de ${MIN_AMOUNT[draft.currency]}.`;
  } else if (value > MAX_AMOUNT[draft.currency]) {
    errors.amount = "Le montant saisi est trop élevé.";
  }
  return errors;
}

/** Validate step 4 — payment method selection. */
export function validateMethod(draft: DonationDraft): FieldErrors {
  const errors: FieldErrors = {};
  if (!draft.method) {
    errors.method = "Choisissez une méthode de paiement.";
  }
  return errors;
}

/** Validate step 5 — donor details and payment details. */
export function validateDetails(draft: DonationDraft): FieldErrors {
  const errors: FieldErrors = {};

  if (draft.donorName.trim().length < 2) {
    errors.donorName = "Indiquez votre nom complet.";
  }
  if (!EMAIL_PATTERN.test(draft.donorEmail.trim())) {
    errors.donorEmail = "Indiquez une adresse e-mail valide.";
  }

  const isCard =
    draft.method === PaymentMethod.visa ||
    draft.method === PaymentMethod.mastercard;

  if (isCard) {
    const digits = draft.cardNumber.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) {
      errors.cardNumber = "Le numéro de carte doit comporter 13 à 19 chiffres.";
    }
    if (!/^\d{2}\/\d{2}$/.test(draft.cardExpiry.trim())) {
      errors.cardExpiry = "Format attendu : MM/AA.";
    } else {
      const [month] = draft.cardExpiry.split("/").map(Number);
      if (month < 1 || month > 12) {
        errors.cardExpiry = "Mois invalide.";
      }
    }
    if (!/^\d{3,4}$/.test(draft.cardCvv.trim())) {
      errors.cardCvv = "Le CVV comporte 3 ou 4 chiffres.";
    }
    if (draft.cardHolder.trim().length < 2) {
      errors.cardHolder = "Indiquez le nom du titulaire.";
    }
    if (draft.billingAddress.trim().length < 5) {
      errors.billingAddress = "Indiquez l'adresse de facturation.";
    }
  } else {
    if (draft.donorPhone.replace(/\D/g, "").length < 8) {
      errors.donorPhone = "Indiquez un numéro de téléphone valide.";
    }
    if (draft.mobileOperator.trim().length < 2) {
      errors.mobileOperator = "Précisez l'opérateur.";
    }
    if (!/^\d{4,6}$/.test(draft.mobileConfirmation.trim())) {
      errors.mobileConfirmation = "Saisissez le code de confirmation reçu.";
    }
  }

  return errors;
}

/** True when the draft holds no validation errors for the given step. */
export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
