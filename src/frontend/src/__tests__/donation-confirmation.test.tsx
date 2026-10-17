import type { backendInterface } from "@/backend";
import { Currency, DonationStatus, Frequency, PaymentMethod } from "@/types";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "./router-utils";

import DonationConfirmationPage from "@/pages/DonationConfirmationPage";

const DONATION = {
  id: 42n,
  status: DonationStatus.confirmed,
  method: PaymentMethod.visa,
  createdAt: 1_700_000_000_000_000_000n,
  transactionNumber: "TXN-2024-00042",
  currency: Currency.usd,
  frequency: Frequency.monthly,
  programmeId: 7n,
  amount: 50n,
  donor: { name: "Ada Lovelace", email: "ada@example.com" },
};

const PROGRAMME = {
  id: 7n,
  title: "Aide alimentaire",
  description: "Distribution de vivres.",
  objectives: [],
  actions: [],
  imageUrl: "",
  displayOrder: 1n,
};

type ConfirmationActor = Pick<
  backendInterface,
  "getDonation" | "listProgrammes"
>;

function makeActor(overrides: Partial<ConfirmationActor> = {}) {
  const actor = {
    getDonation: vi.fn<backendInterface["getDonation"]>(async (id) =>
      id === 42n ? DONATION : null,
    ),
    listProgrammes: vi.fn<backendInterface["listProgrammes"]>(async () => [
      PROGRAMME,
    ]),
    ...overrides,
  } satisfies ConfirmationActor;
  return actor;
}

describe("DonationConfirmationPage", () => {
  it("shows the receipt with the unique transaction number", async () => {
    renderWithRouter(<DonationConfirmationPage />, makeActor(), {
      initialPath: "/don/confirmation?id=42",
    });

    expect(await screen.findByTestId("donate.receipt")).toBeInTheDocument();
    expect(screen.getByTestId("donate.transaction_number")).toHaveTextContent(
      "TXN-2024-00042",
    );
    expect(screen.getByText("Don mensuel")).toBeInTheDocument();
    expect(screen.getByText("Aide alimentaire")).toBeInTheDocument();
    expect(screen.getByText("Visa")).toBeInTheDocument();
  });

  it("shows a not-found state when the donation is unknown", async () => {
    renderWithRouter(<DonationConfirmationPage />, makeActor(), {
      initialPath: "/don/confirmation?id=999",
    });

    expect(
      await screen.findByTestId("donate.not_found_state"),
    ).toBeInTheDocument();
  });
});
