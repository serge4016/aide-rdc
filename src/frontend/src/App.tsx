import { Layout } from "@/components/layout/Layout";
import { AboutPage } from "@/pages/AboutPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ContactPage from "@/pages/ContactPage";
import DonatePage from "@/pages/DonatePage";
import DonationConfirmationPage from "@/pages/DonationConfirmationPage";
import FaqPage from "@/pages/FaqPage";
import GalleryPage from "@/pages/GalleryPage";
import HomePage from "@/pages/HomePage";
import LegalPage from "@/pages/LegalPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ProgramDetailPage from "@/pages/ProgramDetailPage";
import ProgramsPage from "@/pages/ProgramsPage";
import TestimonialsPage from "@/pages/TestimonialsPage";
import { AdminPage } from "@/pages/admin/AdminPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aProposRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/a-propos",
  component: AboutPage,
});

const programmesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/programmes",
  component: ProgramsPage,
});

const programmeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/programmes/$id",
  component: ProgramDetailPage,
});

const actualitesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/actualites",
  validateSearch: (
    search: Record<string, unknown>,
  ): { categorie?: string } => ({
    categorie:
      typeof search.categorie === "string" && search.categorie !== ""
        ? search.categorie
        : undefined,
  }),
  component: BlogPage,
});

const articleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/actualites/$id",
  component: BlogPostPage,
});

const temoignagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/temoignages",
  component: TestimonialsPage,
});

const galerieRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/galerie",
  component: GalleryPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FaqPage,
});

const mentionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mentions-legales",
  component: LegalPage,
});

const confidentialiteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/confidentialite",
  component: PrivacyPage,
});

const donRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faire-un-don",
  component: DonatePage,
});

const donConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/don/confirmation",
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id:
      typeof search.id === "string" && search.id !== "" ? search.id : undefined,
  }),
  component: DonationConfirmationPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aProposRoute,
  programmesRoute,
  programmeDetailRoute,
  actualitesRoute,
  articleDetailRoute,
  temoignagesRoute,
  galerieRoute,
  contactRoute,
  faqRoute,
  mentionsRoute,
  confidentialiteRoute,
  donRoute,
  donConfirmationRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
