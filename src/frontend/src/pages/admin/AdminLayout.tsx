import { SignInButton } from "@/components/InternetIdentity";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  HandCoins,
  Heart,
  Images,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings,
  Target,
} from "lucide-react";
import type { ReactNode } from "react";

export type AdminSectionId =
  | "apercu"
  | "articles"
  | "programmes"
  | "temoignages"
  | "galerie"
  | "campagnes"
  | "paiements"
  | "dons";

interface AdminNavItem {
  id: AdminSectionId;
  label: string;
  icon: typeof FileText;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { id: "apercu", label: "Aperçu", icon: LayoutDashboard },
  { id: "articles", label: "Articles", icon: FileText },
  { id: "programmes", label: "Programmes", icon: Target },
  { id: "temoignages", label: "Témoignages", icon: MessageSquareQuote },
  { id: "galerie", label: "Galerie", icon: Images },
  { id: "campagnes", label: "Campagnes", icon: HandCoins },
  { id: "paiements", label: "Paiements", icon: Settings },
  { id: "dons", label: "Dons reçus", icon: Heart },
];

export function AdminLayout({
  active,
  onSelect,
  children,
}: {
  active: AdminSectionId;
  onSelect: (id: AdminSectionId) => void;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Administration
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            Gestion du contenu
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            data-ocid="admin.view_site_link"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Voir le site
          </Link>
          <SignInButton className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <nav
          aria-label="Sections d'administration"
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active;
              return (
                <li key={item.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    data-ocid={`admin.nav.${item.id}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/75 hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-muted-foreground lg:flex">
            <LogOut className="size-3.5 shrink-0" aria-hidden="true" />
            Utilisez « Se déconnecter » en haut pour quitter.
          </div>
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
