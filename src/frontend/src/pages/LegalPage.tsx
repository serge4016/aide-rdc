import {
  PageContainer,
  PageHeader,
  SectionBand,
} from "@/components/layout/PageContainer";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";

function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24">
      <h2
        id={id}
        className="font-display text-2xl font-semibold tracking-tight"
      >
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function LegalPage() {
  return (
    <>
      <SectionBand tone="cream">
        <PageHeader
          eyebrow="Informations légales"
          title="Mentions légales"
          lead="Informations relatives à l'édition du site et à l'organisation Aide RDC, conformément aux obligations d'information applicables."
        />
      </SectionBand>

      <PageContainer>
        <div className="mx-auto max-w-3xl space-y-12">
          <LegalSection id="editeur" title="Éditeur du site">
            <p>
              Le présent site est édité par <strong>Aide RDC</strong>,
              organisation humanitaire à but non lucratif engagée aux côtés des
              personnes déplacées dans l'est de la République démocratique du
              Congo.
            </p>
            <ul className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-subtle">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <span className="font-medium text-foreground">Siège :</span>{" "}
                  {SITE.address}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <span className="font-medium text-foreground">E-mail :</span>{" "}
                  <a
                    href={`mailto:${SITE.email}`}
                    className="underline underline-offset-2 transition-colors hover:text-primary"
                  >
                    {SITE.email}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <span className="font-medium text-foreground">
                    Téléphone :
                  </span>{" "}
                  {SITE.phone}
                </span>
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="objet" title="Objet du site">
            <p>
              Ce site a pour objet de présenter la mission, les programmes et
              les actions d'Aide RDC, de partager des actualités et des
              témoignages du terrain, et de permettre au public de soutenir nos
              interventions par un don ou en devenant bénévole.
            </p>
          </LegalSection>

          <LegalSection id="propriete" title="Propriété intellectuelle">
            <p>
              L'ensemble des contenus présents sur ce site — textes, éléments
              graphiques, logos, photographies et illustrations — est protégé
              par le droit de la propriété intellectuelle. Toute reproduction,
              représentation ou diffusion, totale ou partielle, sans
              autorisation écrite préalable d'Aide RDC est interdite.
            </p>
            <p>
              Les photographies de terrain sont publiées dans le respect de la
              dignité et du consentement des personnes représentées.
            </p>
          </LegalSection>

          <LegalSection
            id="responsabilite"
            title="Limitation de responsabilité"
          >
            <p>
              Aide RDC s'efforce d'assurer l'exactitude et la mise à jour des
              informations diffusées sur ce site. Elle ne saurait toutefois être
              tenue responsable des erreurs, omissions ou indisponibilités
              temporaires du service.
            </p>
            <p>
              Les liens vers des sites tiers ne sauraient engager la
              responsabilité d'Aide RDC quant au contenu de ces sites.
            </p>
          </LegalSection>

          <LegalSection id="donnees" title="Données personnelles">
            <p>
              Le traitement des données personnelles collectées via ce site est
              décrit dans notre{" "}
              <Link
                to="/confidentialite"
                data-ocid="legal.privacy_link"
                className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection id="droit" title="Droit applicable">
            <p>
              Le présent site et les présentes mentions légales sont soumis au
              droit en vigueur en République démocratique du Congo. Tout litige
              relatif à l'utilisation du site relève des juridictions
              compétentes.
            </p>
          </LegalSection>

          <p className="border-t border-border pt-6 text-sm text-muted-foreground">
            Dernière mise à jour : {new Date().getFullYear()}.
          </p>
        </div>
      </PageContainer>
    </>
  );
}
