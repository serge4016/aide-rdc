import type { backendInterface } from "@/backend";
import { Currency } from "@/types";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "./router-utils";

import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";

const ARTICLE = {
  id: 3n,
  title: "Distribution de vivres à Goma",
  category: "Terrain",
  author: "Espérance Mwamba",
  imageUrl: "",
  content:
    "Nos équipes ont distribué des vivres.\n\nPlus de 2 000 familles aidées.",
  published: true,
  publishedAt: 1_700_000_000_000_000_000n,
};

const OTHER = {
  ...ARTICLE,
  id: 4n,
  title: "Clinique mobile au Nord-Kivu",
  category: "Santé",
};

type BlogActor = Pick<backendInterface, "listPublishedArticles" | "getArticle">;

function makeActor(overrides: Partial<BlogActor> = {}) {
  const actor = {
    listPublishedArticles: vi.fn<backendInterface["listPublishedArticles"]>(
      async () => [ARTICLE, OTHER],
    ),
    getArticle: vi.fn<backendInterface["getArticle"]>(async (id) =>
      id === 3n ? ARTICLE : null,
    ),
    ...overrides,
  } satisfies BlogActor;
  return actor;
}

describe("BlogPage", () => {
  it("filters articles by category and keeps the filter in the URL", async () => {
    const { router } = renderWithRouter(<BlogPage />, makeActor());
    const user = userEvent.setup();

    expect(
      await screen.findByText("Distribution de vivres à Goma"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Clinique mobile au Nord-Kivu"),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("blog.filter.tab.santé"));

    await waitFor(() =>
      expect(
        screen.queryByText("Distribution de vivres à Goma"),
      ).not.toBeInTheDocument(),
    );
    expect(
      screen.getByText("Clinique mobile au Nord-Kivu"),
    ).toBeInTheDocument();
    expect(router.state.location.search).toEqual({ categorie: "Santé" });
  });

  it("restores the category filter from the URL on load", async () => {
    renderWithRouter(<BlogPage />, makeActor(), {
      initialPath: "/actualites?categorie=Santé",
    });

    expect(
      await screen.findByText("Clinique mobile au Nord-Kivu"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Distribution de vivres à Goma"),
    ).not.toBeInTheDocument();
  });
});

describe("BlogPostPage", () => {
  it("shows the article detail with category, date and author", async () => {
    renderWithRouter(<BlogPostPage />, makeActor(), {
      initialPath: "/actualites/3",
      path: "/actualites/$id",
    });

    expect(
      await screen.findByRole("heading", {
        name: "Distribution de vivres à Goma",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Terrain")).toBeInTheDocument();
    expect(screen.getByText("Espérance Mwamba")).toBeInTheDocument();
    expect(screen.getByText(/14 novembre 2023/)).toBeInTheDocument();
  });

  it("shows a not-found state for an unknown article", async () => {
    renderWithRouter(<BlogPostPage />, makeActor(), {
      initialPath: "/actualites/999",
      path: "/actualites/$id",
    });

    expect(await screen.findByTestId("blog.not_found")).toBeInTheDocument();
  });
});
