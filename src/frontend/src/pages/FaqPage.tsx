import {
  PageContainer,
  PageHeader,
  SectionBand,
} from "@/components/layout/PageContainer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { Heart, Mail, MessageCircleQuestion } from "lucide-react";

type FaqItem = { question: string; answer: string };

type FaqGroup = { id: string; title: string; items: FaqItem[] };

const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "mission",
    title: "Notre mission et nos actions",
    items: [
      {
        question: "Qui est Aide RDC et que faites-vous concrètement ?",
        answer:
          "Aide RDC est une organisation humanitaire congolaise qui vient en aide aux personnes déplacées par le conflit dans l'est de la République démocratique du Congo. Sur le terrain, nos équipes distribuent de la nourriture, organisent des consultations médicales et installent des abris d'urgence pour les familles qui ont tout perdu.",
      },
      {
        question: "Dans quelles régions intervenez-vous ?",
        answer:
          "Nous concentrons nos actions dans l'est du pays, principalement au Nord-Kivu et au Sud-Kivu, là où les déplacements de population sont les plus importants. Nos équipes travaillent en lien étroit avec les autorités locales et les communautés d'accueil.",
      },
      {
        question:
          "Comment vérifiez-vous que l'aide arrive aux bonnes personnes ?",
        answer:
          "Chaque distribution est enregistrée et suivie par nos équipes locales. Nous identifions les familles les plus vulnérables avec les comités de quartier, puis nous documentons les bénéficiaires afin d'éviter les doublons et de garantir que l'aide atteint réellement ceux qui en ont besoin.",
      },
    ],
  },
  {
    id: "dons",
    title: "Faire un don",
    items: [
      {
        question: "Comment puis-je soutenir Aide RDC ?",
        answer:
          "Vous pouvez faire un don en ligne depuis la page « Faire un don ». Chaque contribution, quelle que soit sa taille, finance directement l'aide alimentaire, la santé et les abris d'urgence pour les familles déplacées.",
      },
      {
        question: "À quoi sert exactement mon don ?",
        answer:
          "Votre don est affecté en priorité aux besoins vitaux : nourriture, soins de santé de base et abris. Nous privilégions les achats locaux afin de soutenir aussi l'économie des communautés qui nous accueillent.",
      },
      {
        question: "Puis-je faire un don régulier chaque mois ?",
        answer:
          "Oui. Un don mensuel nous permet de planifier nos interventions dans la durée et de répondre plus rapidement aux urgences. Vous pouvez choisir cette option au moment de votre don.",
      },
      {
        question: "Mon don est-il déductible des impôts ?",
        answer: `Les modalités fiscales dépendent de votre pays de résidence. Nous vous invitons à nous écrire à ${SITE.email} pour obtenir une attestation ou toute précision sur votre situation.`,
      },
    ],
  },
  {
    id: "transparence",
    title: "Transparence et confiance",
    items: [
      {
        question: "Comment sont utilisés les fonds que vous recevez ?",
        answer:
          "Nous appliquons une gestion rigoureuse : la grande majorité des fonds est consacrée directement aux programmes de terrain. Les dépenses administratives sont maintenues au strict minimum et font l'objet d'un suivi régulier.",
      },
      {
        question: "Puis-je visiter vos actions sur le terrain ?",
        answer:
          "Nous organisons ponctuellement des visites encadrées pour nos partenaires et donateurs, dans le respect de la sécurité et de la dignité des personnes accompagnées. Contactez-nous pour en discuter.",
      },
    ],
  },
  {
    id: "participer",
    title: "S'engager à nos côtés",
    items: [
      {
        question: "Comment devenir bénévole ?",
        answer:
          "Nous accueillons avec joie les personnes souhaitant donner de leur temps, sur le terrain comme à distance. Écrivez-nous en décrivant vos compétences et vos disponibilités, et nous vous recontacterons.",
      },
      {
        question:
          "Comment proposer un partenariat avec mon entreprise ou mon organisation ?",
        answer: `Les partenariats avec les entreprises, les associations et les institutions nous permettent d'amplifier notre impact. Contactez-nous à ${SITE.email} pour construire ensemble une collaboration adaptée à vos valeurs.`,
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <SectionBand tone="cream">
        <PageHeader
          eyebrow="Questions fréquentes"
          title="Vos questions, nos réponses"
          lead="Tout ce qu'il faut savoir sur nos actions, nos dons et la façon de nous soutenir. Vous ne trouvez pas votre réponse ? Écrivez-nous, nous vous répondrons avec plaisir."
        />
      </SectionBand>

      <PageContainer>
        <div className="mx-auto max-w-3xl space-y-12">
          {FAQ_GROUPS.map((group) => (
            <section key={group.id} aria-labelledby={`faq-${group.id}`}>
              <h2
                id={`faq-${group.id}`}
                className="mb-5 flex items-center gap-3 font-display text-2xl font-semibold tracking-tight"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                  <MessageCircleQuestion
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>
                {group.title}
              </h2>
              <Accordion
                type="single"
                collapsible
                className="rounded-2xl border border-border bg-card px-5 shadow-subtle sm:px-6"
              >
                {group.items.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`${group.id}-${index}`}
                    data-ocid={`faq.item.${group.id}.${index + 1}`}
                  >
                    <AccordionTrigger
                      data-ocid={`faq.toggle.${group.id}.${index + 1}`}
                      className="text-left font-body text-base font-semibold leading-snug hover:no-underline"
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </PageContainer>

      <SectionBand tone="cream">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-sm">
            <Heart className="size-7" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Une autre question ?
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              Notre équipe est disponible pour vous répondre et vous accompagner
              dans votre démarche de soutien.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              data-ocid="faq.contact_button"
              className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <Link to="/contact">Nous contacter</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              data-ocid="faq.donate_button"
              className="rounded-full border-border px-6 font-semibold"
            >
              <Link to="/faire-un-don">Faire un don</Link>
            </Button>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4" aria-hidden="true" />
            <a
              href={`mailto:${SITE.email}`}
              className="underline underline-offset-2 transition-colors hover:text-primary"
            >
              {SITE.email}
            </a>
          </p>
        </div>
      </SectionBand>
    </>
  );
}
