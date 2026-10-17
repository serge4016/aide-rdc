import type { backendInterface } from "@/backend";
import { Currency, Frequency, PaymentMethod } from "@/types";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithActor } from "./test-utils";

/**
 * The wizard navigates on success. The real router is not mounted here, so the
 * navigation call is captured instead of asserting a route change.
 */
const navigateMock = vi.hoisted(() => vi.fn());
vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  useNavigate: () => navigateMock,
}));

import { DonationWizard } from "@/components/donate/DonationWizard";

const PROGRAMME = {
  id: 7n,
  title: "Aide alimentaire",
  description: "Distribution de vivres aux familles déplacées.",
  objectives: ["Nourrir"],
  actions: ["Distribuer"],
  imageUrl: "",
  displayOrder: 1n,
};

type WizardActor = Pick<backendInterface, "listProgrammes" | "createDonation">;

function makeActor(overrides: Partial<WizardActor> = {}) {
  const listProgrammes = vi.fn<backendInterface["listProgrammes"]>(async () => [
    PROGRAMME,
  ]);
  const createDonation = vi.fn<backendInterface["createDonation"]>(
    async (amount, currency, frequency, programmeId, method, donor) => ({
      id: 42n,
      status: "confirmed" as never,
      method,
      createdAt: 1_700_000_000_000_000_000n,
      transactionNumber: "TXN-42",
      currency,
      frequency,
      programmeId: programmeId ?? undefined,
      amount,
      donor,
    }),
  );
  const actor = {
    listProgrammes,
    createDonation,
    ...overrides,
  } satisfies WizardActor;
  return { actor, listProgrammes, createDonation };
}

async function advanceToMethodStep(user: ReturnType<typeof userEvent.setup>) {
  // Step 1 — amount
  await user.click(screen.getByTestId("donate.preset.25"));
  await user.click(screen.getByTestId("donate.next_button"));
  // Step 2 — frequency
  await user.click(screen.getByTestId("donate.frequency.monthly"));
  await user.click(screen.getByTestId("donate.next_button"));
  // Step 3 — allocation
  await user.click(screen.getByTestId("donate.allocation.general"));
  await user.click(screen.getByTestId("donate.next_button"));
}

describe("DonationWizard", () => {
  it("offers every required payment method", async () => {
    const { actor } = makeActor();
    renderWithActor(<DonationWizard />, actor);
    const user = userEvent.setup();

    await advanceToMethodStep(user);

    for (const method of [
      PaymentMethod.mpesa,
      PaymentMethod.orangeMoney,
      PaymentMethod.airtelMoney,
      PaymentMethod.afrimoney,
      PaymentMethod.visa,
      PaymentMethod.mastercard,
    ]) {
      expect(screen.getByTestId(`donate.method.${method}`)).toBeInTheDocument();
    }
  });

  it("shows card fields for a card method and mobile fields for mobile money", async () => {
    const { actor } = makeActor();
    renderWithActor(<DonationWizard />, actor);
    const user = userEvent.setup();

    await advanceToMethodStep(user);

    await user.click(screen.getByTestId("donate.method.visa"));
    await user.click(screen.getByTestId("donate.next_button"));

    expect(screen.getByTestId("donate.card_number_input")).toBeInTheDocument();
    expect(screen.getByTestId("donate.card_expiry_input")).toBeInTheDocument();
    expect(screen.getByTestId("donate.card_cvv_input")).toBeInTheDocument();
    expect(screen.getByTestId("donate.card_holder_input")).toBeInTheDocument();
    expect(
      screen.getByTestId("donate.billing_address_input"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("donate.mobile_confirmation_input"),
    ).not.toBeInTheDocument();
  });

  it("shows phone, operator and confirmation code for mobile money", async () => {
    const { actor } = makeActor();
    renderWithActor(<DonationWizard />, actor);
    const user = userEvent.setup();

    await advanceToMethodStep(user);

    await user.click(screen.getByTestId("donate.method.mpesa"));
    await user.click(screen.getByTestId("donate.next_button"));

    expect(screen.getByTestId("donate.donor_phone_input")).toBeInTheDocument();
    expect(
      screen.getByTestId("donate.mobile_operator_input"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("donate.mobile_confirmation_input"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("donate.card_number_input"),
    ).not.toBeInTheDocument();
  });

  it("blocks an empty amount with a French validation message", async () => {
    const { actor } = makeActor();
    renderWithActor(<DonationWizard />, actor);
    const user = userEvent.setup();

    await user.click(screen.getByTestId("donate.next_button"));

    expect(screen.getByText("Indiquez un montant.")).toBeInTheDocument();
    // Still on step 1: the frequency step heading is not shown.
    expect(
      screen.queryByText("À quelle fréquence souhaitez-vous donner ?"),
    ).not.toBeInTheDocument();
  });

  it("completes a card donation and submits the chosen values", async () => {
    const { actor, createDonation } = makeActor();
    renderWithActor(<DonationWizard />, actor);
    const user = userEvent.setup();

    // Step 1 — free amount in CDF
    await user.click(screen.getByTestId("donate.currency.cdf"));
    await user.type(screen.getByTestId("donate.amount_input"), "25000");
    await user.click(screen.getByTestId("donate.next_button"));
    // Step 2 — monthly
    await user.click(screen.getByTestId("donate.frequency.monthly"));
    await user.click(screen.getByTestId("donate.next_button"));
    // Step 3 — specific programme
    await user.click(screen.getByTestId("donate.allocation.7"));
    await user.click(screen.getByTestId("donate.next_button"));
    // Step 4 — Visa
    await user.click(screen.getByTestId("donate.method.visa"));
    await user.click(screen.getByTestId("donate.next_button"));
    // Step 5 — donor + card details
    await user.type(
      screen.getByTestId("donate.donor_name_input"),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByTestId("donate.donor_email_input"),
      "ada@example.com",
    );
    await user.type(
      screen.getByTestId("donate.card_number_input"),
      "4242424242424242",
    );
    await user.type(screen.getByTestId("donate.card_expiry_input"), "12/30");
    await user.type(screen.getByTestId("donate.card_cvv_input"), "123");
    await user.type(
      screen.getByTestId("donate.card_holder_input"),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByTestId("donate.billing_address_input"),
      "12 avenue de la Paix, Goma",
    );
    await user.click(screen.getByTestId("donate.next_button"));

    // Step 6 — recap shows the chosen values
    expect(screen.getByTestId("donate.summary")).toBeInTheDocument();
    expect(screen.getByText("Don mensuel")).toBeInTheDocument();
    expect(screen.getByText("Aide alimentaire")).toBeInTheDocument();
    expect(screen.getByText("Visa")).toBeInTheDocument();

    await user.click(screen.getByTestId("donate.submit_button"));

    await waitFor(() => expect(createDonation).toHaveBeenCalledTimes(1));
    expect(createDonation).toHaveBeenCalledWith(
      25000n,
      Currency.cdf,
      Frequency.monthly,
      7n,
      PaymentMethod.visa,
      { name: "Ada Lovelace", email: "ada@example.com", phone: undefined },
    );
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/don/confirmation",
        search: { id: "42" },
      }),
    );
  });

  it("surfaces a French error when the donation cannot be recorded", async () => {
    const { actor, createDonation } = makeActor();
    createDonation.mockRejectedValueOnce(new Error("boom"));
    renderWithActor(<DonationWizard />, actor);
    const user = userEvent.setup();

    await advanceToMethodStep(user);
    await user.click(screen.getByTestId("donate.method.mpesa"));
    await user.click(screen.getByTestId("donate.next_button"));
    await user.type(
      screen.getByTestId("donate.donor_name_input"),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByTestId("donate.donor_email_input"),
      "ada@example.com",
    );
    await user.type(
      screen.getByTestId("donate.donor_phone_input"),
      "+243810000000",
    );
    await user.type(
      screen.getByTestId("donate.mobile_confirmation_input"),
      "123456",
    );
    await user.click(screen.getByTestId("donate.next_button"));
    await user.click(screen.getByTestId("donate.submit_button"));

    expect(await screen.findByTestId("donate.error_state")).toBeInTheDocument();
  });
});
