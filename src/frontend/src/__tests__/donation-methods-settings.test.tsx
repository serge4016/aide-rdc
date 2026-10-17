import type {
  MethodSettings,
  PaymentSettings,
  backendInterface,
} from "@/backend";
import { Currency, PaymentMethod } from "@/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithActor } from "./test-utils";

import { DonationWizard } from "@/components/donate/DonationWizard";

const navigateMock = vi.hoisted(() => vi.fn());
vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  useNavigate: () => navigateMock,
}));

const DISABLED: MethodSettings = { enabled: false, apiKey: "", apiSecret: "" };
const ENABLED: MethodSettings = { enabled: true, apiKey: "", apiSecret: "" };

function makeSettings(
  enabled: Partial<Record<PaymentMethod, boolean>>,
): PaymentSettings {
  return {
    mpesa: enabled[PaymentMethod.mpesa] ? ENABLED : DISABLED,
    orangeMoney: enabled[PaymentMethod.orangeMoney] ? ENABLED : DISABLED,
    airtelMoney: enabled[PaymentMethod.airtelMoney] ? ENABLED : DISABLED,
    afrimoney: enabled[PaymentMethod.afrimoney] ? ENABLED : DISABLED,
    visa: enabled[PaymentMethod.visa] ? ENABLED : DISABLED,
    mastercard: enabled[PaymentMethod.mastercard] ? ENABLED : DISABLED,
    acceptedCurrencies: [Currency.usd, Currency.cdf],
    testMode: true,
    webhookUrl: "",
  };
}

type SettingsActor = Pick<
  backendInterface,
  "listProgrammes" | "getPaymentSettings"
>;

function makeActor(settings: PaymentSettings) {
  const getPaymentSettings = vi.fn<backendInterface["getPaymentSettings"]>(
    async () => settings,
  );
  const actor = {
    listProgrammes: vi.fn<backendInterface["listProgrammes"]>(async () => []),
    getPaymentSettings,
  } satisfies SettingsActor;
  return { actor, getPaymentSettings };
}

async function advanceToMethodStep(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId("donate.preset.25"));
  await user.click(screen.getByTestId("donate.next_button"));
  await user.click(screen.getByTestId("donate.frequency.oneTime"));
  await user.click(screen.getByTestId("donate.next_button"));
  await user.click(screen.getByTestId("donate.allocation.general"));
  await user.click(screen.getByTestId("donate.next_button"));
}

describe("DonationWizard payment methods follow admin settings", () => {
  it("offers only the methods the administrator enabled", async () => {
    const { actor, getPaymentSettings } = makeActor(
      makeSettings({
        [PaymentMethod.mpesa]: true,
        [PaymentMethod.visa]: true,
      }),
    );
    renderWithActor(<DonationWizard />, actor);
    const user = userEvent.setup();

    await advanceToMethodStep(user);

    expect(getPaymentSettings).toHaveBeenCalled();
    expect(screen.getByTestId("donate.method.mpesa")).toBeInTheDocument();
    expect(screen.getByTestId("donate.method.visa")).toBeInTheDocument();
    // Disabled methods are not offered.
    expect(
      screen.queryByTestId("donate.method.orangeMoney"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("donate.method.airtelMoney"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("donate.method.afrimoney"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("donate.method.mastercard"),
    ).not.toBeInTheDocument();
  });

  it("shows a French empty state when no method is enabled", async () => {
    const { actor } = makeActor(makeSettings({}));
    renderWithActor(<DonationWizard />, actor);
    const user = userEvent.setup();

    await advanceToMethodStep(user);

    expect(
      await screen.findByTestId("donate.method.empty_state"),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("donate.method.mpesa")).not.toBeInTheDocument();
  });
});
