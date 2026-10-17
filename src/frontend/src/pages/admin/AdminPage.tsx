import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { AdminGate } from "./AdminGate";
import { ADMIN_NAV, AdminLayout, type AdminSectionId } from "./AdminLayout";
import { ArticlesAdmin } from "./ArticlesAdmin";
import { CampaignsAdmin } from "./CampaignsAdmin";
import { DonationsAdmin } from "./DonationsAdmin";
import { GalleryAdmin } from "./GalleryAdmin";
import { PaymentSettingsAdmin } from "./PaymentSettingsAdmin";
import { ProgrammesAdmin } from "./ProgrammesAdmin";
import { TestimoniesAdmin } from "./TestimoniesAdmin";

function Overview({ onSelect }: { onSelect: (id: AdminSectionId) => void }) {
  const sections = ADMIN_NAV.filter((item) => item.id !== "apercu");
  return (
    <div className="space-y-6" data-ocid="admin.overview.panel">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Bienvenue dans votre espace
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Gérez ici l'ensemble du contenu publié sur le site Aide RDC.
          Choisissez une section pour commencer.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              type="button"
              data-ocid={`admin.overview.card.${section.id}`}
              onClick={() => onSelect(section.id)}
              className="group text-left"
            >
              <Card className="h-full rounded-2xl border-border shadow-subtle transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                <CardContent className="flex items-center gap-4 pt-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{section.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Ouvrir la section
                    </span>
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AdminWorkspace() {
  const [section, setSection] = useState<AdminSectionId>("apercu");

  return (
    <AdminLayout active={section} onSelect={setSection}>
      {section === "apercu" && <Overview onSelect={setSection} />}
      {section === "articles" && <ArticlesAdmin />}
      {section === "programmes" && <ProgrammesAdmin />}
      {section === "temoignages" && <TestimoniesAdmin />}
      {section === "galerie" && <GalleryAdmin />}
      {section === "campagnes" && <CampaignsAdmin />}
      {section === "paiements" && <PaymentSettingsAdmin />}
      {section === "dons" && <DonationsAdmin />}
    </AdminLayout>
  );
}

/** Entry point for the /admin route: sign-in gate, admin check, then the workspace. */
export function AdminPage() {
  return (
    <AdminGate>
      <AdminWorkspace />
    </AdminGate>
  );
}
