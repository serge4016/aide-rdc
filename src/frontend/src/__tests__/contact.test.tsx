import type { backendInterface } from "@/backend";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "./router-utils";

import ContactPage from "@/pages/ContactPage";

type ContactActor = Pick<backendInterface, "submitContactMessage">;

function makeActor(overrides: Partial<ContactActor> = {}) {
  const submitContactMessage = vi.fn<backendInterface["submitContactMessage"]>(
    async (name, email, subject, message) => ({
      id: 1n,
      name,
      email,
      subject,
      message,
      receivedAt: 1_700_000_000_000_000_000n,
    }),
  );
  const actor = {
    submitContactMessage,
    ...overrides,
  } satisfies ContactActor;
  return { actor, submitContactMessage };
}

describe("ContactPage", () => {
  it("validates required fields in French before submitting", async () => {
    const { actor, submitContactMessage } = makeActor();
    renderWithRouter(<ContactPage />, actor, {
      initialPath: "/contact",
    });
    const user = userEvent.setup();

    await user.click(await screen.findByTestId("contact.submit_button"));

    expect(screen.getByTestId("contact.name_error")).toBeInTheDocument();
    expect(screen.getByTestId("contact.email_error")).toBeInTheDocument();
    expect(screen.getByTestId("contact.subject_error")).toBeInTheDocument();
    expect(screen.getByTestId("contact.message_error")).toBeInTheDocument();
    expect(submitContactMessage).not.toHaveBeenCalled();
  });

  it("rejects an invalid e-mail address", async () => {
    const { actor, submitContactMessage } = makeActor();
    renderWithRouter(<ContactPage />, actor, {
      initialPath: "/contact",
    });
    const user = userEvent.setup();

    await user.type(await screen.findByTestId("contact.name_input"), "Ada");
    await user.type(screen.getByTestId("contact.email_input"), "not-an-email");
    await user.type(screen.getByTestId("contact.subject_input"), "Bonjour");
    await user.type(
      screen.getByTestId("contact.message_textarea"),
      "Un message assez long.",
    );
    await user.click(screen.getByTestId("contact.submit_button"));

    expect(screen.getByTestId("contact.email_error")).toBeInTheDocument();
    expect(submitContactMessage).not.toHaveBeenCalled();
  });

  it("submits a valid message and shows a confirmation", async () => {
    const { actor, submitContactMessage } = makeActor();
    renderWithRouter(<ContactPage />, actor, {
      initialPath: "/contact",
    });
    const user = userEvent.setup();

    await user.type(
      await screen.findByTestId("contact.name_input"),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByTestId("contact.email_input"),
      "ada@example.com",
    );
    await user.type(screen.getByTestId("contact.subject_input"), "Partenariat");
    await user.type(
      screen.getByTestId("contact.message_textarea"),
      "Nous souhaitons soutenir vos actions.",
    );
    await user.click(screen.getByTestId("contact.submit_button"));

    await waitFor(() => expect(submitContactMessage).toHaveBeenCalledTimes(1));
    expect(submitContactMessage).toHaveBeenCalledWith(
      "Ada Lovelace",
      "ada@example.com",
      "Partenariat",
      "Nous souhaitons soutenir vos actions.",
    );
    expect(
      await screen.findByTestId("contact.success_state"),
    ).toBeInTheDocument();
  });
});
