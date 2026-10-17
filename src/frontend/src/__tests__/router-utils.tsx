import type { backendInterface } from "@/backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { setActorForTest } from "./setup";

/**
 * Render a page inside a real memory-history router so `Link` and
 * `useRouterState` resolve a router context. The route tree mirrors the app's
 * public routes closely enough for navigation assertions.
 */
export function renderWithRouter<K extends keyof backendInterface>(
  ui: ReactElement,
  actor: Pick<backendInterface, K>,
  options: { initialPath?: string; path?: string; search?: boolean } = {},
) {
  setActorForTest(actor);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => ui,
  });
  // Register the page's real path so `useParams({ from })` resolves a match.
  // `validateSearch` keeps the query string parsed into an object, matching the
  // app's own routes that read `location.search`.
  const pageRoute =
    options.path && options.path !== "/"
      ? createRoute({
          getParentRoute: () => rootRoute,
          path: options.path,
          validateSearch: (search: Record<string, unknown>) => search,
          component: () => ui,
        })
      : undefined;
  const catchAll = createRoute({
    getParentRoute: () => rootRoute,
    path: "$",
    validateSearch: (search: Record<string, unknown>) => search,
    component: () => ui,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([
      indexRoute,
      ...(pageRoute ? [pageRoute] : []),
      catchAll,
    ]),
    history: createMemoryHistory({
      initialEntries: [options.initialPath ?? "/"],
    }),
    parseSearch: (searchStr) => {
      const params = new URLSearchParams(searchStr);
      const result: Record<string, string> = {};
      for (const [key, value] of params.entries()) result[key] = value;
      return result;
    },
    stringifySearch: (search) => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(search)) {
        if (value !== undefined) params.set(key, String(value));
      }
      const str = params.toString();
      return str ? `?${str}` : "";
    },
  });

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
    queryClient,
    router,
  };
}
