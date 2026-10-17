import type { backendInterface } from "@/backend";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "./router-utils";

import HomePage from "@/pages/HomePage";

type HomeActor = Pick<
  backendInterface,
  | "listPublishedArticles"
  | "listProgrammes"
  | "listTestimonies"
  | "listActiveCampaigns"
>;

function makeActor(overrides: Partial<HomeActor> = {}) {
  const actor = {
    listPublishedArticles: vi.fn<backendInterface["listPublishedArticles"]>(
      async () => [],
    ),
    listProgrammes: vi.fn<backendInterface["listProgrammes"]>(async () => []),
    listTestimonies: vi.fn<backendInterface["listTestimonies"]>(async () => []),
    listActiveCampaigns: vi.fn<backendInterface["listActiveCampaigns"]>(
      async () => [],
    ),
    ...overrides,
  } satisfies HomeActor;
  return actor;
}

describe("HomePage", () => {
  it("renders the French mission hero and the crisis figures", async () => {
    renderWithRouter(<HomePage />, makeActor());

    expect(
      await screen.findByRole("heading", {
        name: /Ensemble, aux côtés des déplacés de l'est de la RDC/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("home.crisis.section")).toBeInTheDocument();
    expect(screen.getByText("≈ 5,3 millions")).toBeInTheDocument();
    expect(
      screen.getByText("personnes déplacées internes"),
    ).toBeInTheDocument();
  });

  it("links the hero call to action to the donation journey", async () => {
    renderWithRouter(<HomePage />, makeActor());

    const donate = await screen.findByTestId("home.hero.donate_button");
    expect(donate).toHaveAttribute("href", "/faire-un-don");
  });
});
