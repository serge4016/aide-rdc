import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FOOTER_LINKS, NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Menu, Phone } from "lucide-react";
import { type ReactNode, useState } from "react";

function Logo() {
  return (
    <Link
      to="/"
      data-ocid="nav.logo_link"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="relative grid size-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-sm">
        <Heart className="size-5" aria-hidden="true" />
        <span className="absolute -bottom-0.5 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full flag-ribbon" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight">
          Aide RDC
        </span>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Solidarité Congo
        </span>
      </span>
    </Link>
  );
}

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="Navigation principale" className={className}>
      <ul className="flex items-center gap-1">
        {NAV_LINKS.map((link) => {
          const active =
            link.to === "/"
              ? pathname === "/"
              : pathname === link.to || pathname.startsWith(`${link.to}/`);
          return (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={onNavigate}
                data-ocid={`nav.link.${link.to === "/" ? "accueil" : link.to.slice(1)}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-foreground/75 hover:text-primary",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          data-ocid="nav.mobile_menu_button"
          aria-label="Ouvrir le menu"
          className="lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" data-ocid="nav.mobile_menu">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              data-ocid={`nav.mobile_link.${link.to === "/" ? "accueil" : link.to.slice(1)}`}
              className="rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/faire-un-don"
            onClick={() => setOpen(false)}
            data-ocid="nav.mobile_donate_link"
            className="mt-2 rounded-full bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
          >
            Faire un don
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-subtle backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <NavLinks className="hidden lg:block" />
        <div className="flex items-center gap-2">
          <Button
            asChild
            data-ocid="nav.donate_button"
            className="hidden rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <Link to="/faire-un-don">Faire un don</Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
      <div className="h-1 w-full flag-ribbon" aria-hidden="true" />
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 bg-foreground text-background">
      <div className="h-1.5 w-full flag-ribbon" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-xl font-semibold">Aide RDC</p>
          <p className="mt-3 max-w-xs text-sm text-background/70">
            {SITE.description}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            Navigation
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.slice(0, 5).map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  data-ocid={`footer.link.${link.to === "/" ? "accueil" : link.to.slice(1)}`}
                  className="text-background/75 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            Informations
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  data-ocid={`footer.link.${link.to.slice(1)}`}
                  className="text-background/75 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-background/75">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${SITE.email}`}
                className="transition-colors hover:text-accent"
              >
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{SITE.phone}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{SITE.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/15">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-background/60 sm:flex-row sm:px-6">
          <p>© {year} Aide RDC. Tous droits réservés.</p>
          <p>
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-accent"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1 bg-background">{children}</main>
      <Footer />
    </div>
  );
}
