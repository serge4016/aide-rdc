import { RequireSignIn, SignInButton } from "@/components/InternetIdentity";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { useIsCallerAdmin } from "./useAdminAccess";

function AdminLoading() {
  return (
    <div
      data-ocid="admin.loading_state"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground"
    >
      <Loader2
        className="size-6 animate-spin text-primary"
        aria-hidden="true"
      />
      <p className="text-sm">Vérification de vos droits d'accès…</p>
    </div>
  );
}

function NotAuthorized() {
  const { clear } = useInternetIdentity();
  return (
    <div
      data-ocid="admin.denied_state"
      className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <span className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="size-7" aria-hidden="true" />
      </span>
      <h1 className="font-display text-2xl font-semibold">
        Accès non autorisé
      </h1>
      <p className="text-sm text-muted-foreground">
        Votre compte est bien connecté, mais il ne dispose pas des droits
        d'administration. Contactez un responsable de l'équipe Aide RDC pour
        obtenir l'accès.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          data-ocid="admin.sign_out_button"
          onClick={() => clear()}
        >
          Se déconnecter
        </Button>
        <Button asChild className="rounded-full">
          <Link to="/" data-ocid="admin.back_home_link">
            Retour au site
          </Link>
        </Button>
      </div>
    </div>
  );
}

function AdminAccessBoundary({ children }: { children: ReactNode }) {
  const { data: isAdmin, isLoading, isError, refetch } = useIsCallerAdmin();

  if (isLoading) return <AdminLoading />;

  if (isError) {
    return (
      <div
        data-ocid="admin.error_state"
        className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <span className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-7" aria-hidden="true" />
        </span>
        <h1 className="font-display text-2xl font-semibold">
          Impossible de vérifier vos droits
        </h1>
        <p className="text-sm text-muted-foreground">
          Une erreur est survenue lors de la vérification de votre accès
          administrateur.
        </p>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          data-ocid="admin.retry_button"
          onClick={() => void refetch()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (!isAdmin) return <NotAuthorized />;

  return <>{children}</>;
}

/**
 * Protects the whole administration area: Internet Identity sign-in first,
 * then an explicit administrator check against the backend.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  return (
    <RequireSignIn
      fallback={
        <section
          aria-label="Connexion administrateur"
          data-ocid="admin.sign_in_panel"
          className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center gap-5 px-6 text-center"
        >
          <span className="grid size-16 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="size-8" aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold">
              Espace d'administration
            </h1>
            <p className="text-muted-foreground">
              Connectez-vous avec Internet Identity pour gérer le contenu du
              site Aide RDC. Seuls les administrateurs autorisés peuvent accéder
              à cet espace.
            </p>
          </div>
          <SignInButton className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60" />
        </section>
      }
    >
      <AdminAccessBoundary>{children}</AdminAccessBoundary>
    </RequireSignIn>
  );
}
