import type { backendInterface } from "@/backend";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "./router-utils";
import { setIdentityForTest } from "./setup";

import { AdminPage } from "@/pages/admin/AdminPage";

type AdminActor = Pick<backendInterface, "isCallerAdmin">;

function makeActor(overrides: Partial<AdminActor> = {}) {
  const isCallerAdmin = vi.fn<backendInterface["isCallerAdmin"]>(
    async () => false,
  );
  const actor = {
    isCallerAdmin,
    ...overrides,
  } satisfies AdminActor;
  return { actor, isCallerAdmin };
}

describe("AdminPage", () => {
  it("shows the sign-in panel to an anonymous visitor", async () => {
    const { actor, isCallerAdmin } = makeActor();
    renderWithRouter(<AdminPage />, actor, { initialPath: "/admin" });

    expect(
      await screen.findByTestId("admin.sign_in_panel"),
    ).toBeInTheDocument();
    // The admin workspace is not reachable without sign-in.
    expect(
      screen.queryByTestId("admin.overview.panel"),
    ).not.toBeInTheDocument();
    expect(isCallerAdmin).not.toHaveBeenCalled();
  });

  it("denies a signed-in non-administrator", async () => {
    const { actor, isCallerAdmin } = makeActor();
    isCallerAdmin.mockResolvedValue(false);
    setIdentityForTest({
      identity: {
        getPrincipal: () => ({
          isAnonymous: () => false,
          toText: () => "user",
        }),
      } as never,
    });
    renderWithRouter(<AdminPage />, actor, { initialPath: "/admin" });

    expect(await screen.findByTestId("admin.denied_state")).toBeInTheDocument();
    expect(
      screen.queryByTestId("admin.overview.panel"),
    ).not.toBeInTheDocument();
  });

  it("shows the workspace to an administrator", async () => {
    const { actor, isCallerAdmin } = makeActor();
    isCallerAdmin.mockResolvedValue(true);
    setIdentityForTest({
      identity: {
        getPrincipal: () => ({
          isAnonymous: () => false,
          toText: () => "admin",
        }),
      } as never,
    });
    renderWithRouter(<AdminPage />, actor, { initialPath: "/admin" });

    expect(
      await screen.findByTestId("admin.overview.panel"),
    ).toBeInTheDocument();
  });
});
