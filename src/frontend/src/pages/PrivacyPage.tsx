import {
  PageContainer,
  PageHeader,
  SectionBand,
} from "@/components/layout/PageContainer";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

function PrivacySection({
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

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Minimisation",
    text: "Nous ne collectons que les données strictement nécessaires au fonctionnement du site et au traitement de votre soutien.",
  },
  {
    icon: Lock,
    title: "Sécurité",
    text: "Vos informations sont protégées et accessibles uniquement aux personnes habilitées au sein de notre organisation.",
  },
  {
    icon: Mail,
    title: "Transparence",
    text: "Vous pouvez à tout moment nous demander quelles données nous détenons et exercer vos droits.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SectionBand tone="cream">
        <PageHeader
          eyebrow="Vos données"
          title="Politique de confidentialité"
          lead="Nous attachons une grande importance au respect de votre vie privée. Cette page explique quelles données nous collectons, pourquoi, et comment vous pouvez exercer vos droits."
        />
      </SectionBand>

      <PageContainer>
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="grid gap-4 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-subtle"
              >
                <span className="grid size-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
                  <principle.icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold">
                  {principle.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {principle.text}
                </p>
              </div>
            ))}
          </div>

          <PrivacySection id="collecte" title="Données que nous collectons">
            <p>Nous pouvons collecter les catégories de données suivantes :</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                les informations que vous nous transmettez volontairement via le
                formulaire de contact ou lors d'un don (nom, adresse e-mail,
                message) ;
              </li>
              <li>
                les données techniques nécessaires au bon fonctionnement du
                site, telles que le type de navigateur et les pages consultées.
              </li>
            </ul>
          </PrivacySection>

          <PrivacySection
            id="finalites"
            title="Pourquoi nous utilisons vos données"
          >
            <p>Vos données sont utilisées uniquement pour :</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>répondre à vos questions et demandes de contact ;</li>
              <li>traiter et suivre votre soutien à nos programmes ;</li>
              <li>
                améliorer la qualité et la sécurité de notre site et de nos
                services.
              </li>
            </ul>
            <p>
              Nous n'utilisons jamais vos données à des fins de prospection
              commerciale et nous ne les vendons à aucun tiers.
            </p>
          </PrivacySection>

          <PrivacySection id="conservation" title="Durée de conservation">
            <p>
              Vos données sont conservées pendant la durée nécessaire aux
              finalités décrites ci-dessus, puis supprimées ou anonymisées. Les
              échanges liés à un don sont conservés le temps requis par nos
              obligations de suivi et de transparence.
            </p>
          </PrivacySection>

          <PrivacySection id="partage" title="Partage des données">
            <p>
              Vos données ne sont partagées qu'avec les membres habilités de
              notre équipe et, lorsque cela est indispensable, avec nos
              prestataires techniques agissant pour notre compte et soumis à des
              obligations de confidentialité.
            </p>
          </PrivacySection>

          <PrivacySection id="droits" title="Vos droits">
            <p>
              Vous disposez d'un droit d'accès, de rectification, de suppression
              et d'opposition concernant vos données personnelles. Pour exercer
              ces droits, écrivez-nous à{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
              >
                {SITE.email}
              </a>
              . Nous vous répondrons dans les meilleurs délais.
            </p>
          </PrivacySection>

          <PrivacySection id="cookies" title="Cookies">
            <p>
              Ce site n'utilise pas de cookies publicitaires ni de traceurs à
              des fins de suivi commercial. Seuls les éléments techniques
              nécessaires au fonctionnement du site peuvent être utilisés.
            </p>
          </PrivacySection>

          <PrivacySection id="contact" title="Nous contacter">
            <p>
              Pour toute question relative à cette politique ou au traitement de
              vos données, vous pouvez nous joindre à l'adresse{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
              >
                {SITE.email}
              </a>{" "}
              ou consulter nos{" "}
              <Link
                to="/mentions-legales"
                data-ocid="privacy.legal_link"
                className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
              >
                mentions légales
              </Link>
              .
            </p>
          </PrivacySection>

          <p className="border-t border-border pt-6 text-sm text-muted-foreground">
            Dernière mise à jour : {new Date().getFullYear()}.
          </p>
        </div>
      </PageContainer>
    </>
  );
}
