import {
  PageContainer,
  PageHeader,
  SectionBand,
} from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  HandHeart,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

/** A single value that guides the organisation's work. */
interface Value {
  icon: ReactNode;
  title: string;
  description: string;
}

const VALUES: Value[] = [
  {
    icon: <HeartHandshake className="size-6" aria-hidden="true" />,
    title: "Dignité avant tout",
    description:
      "Chaque personne déplacée est accueillie avec respect. Nous écoutons avant d'agir et nous adaptons notre aide à ce que les familles expriment elles-mêmes comme besoin.",
  },
  {
    icon: <ShieldCheck className="size-6" aria-hidden="true" />,
    title: "Transparence",
    description:
      "Nous publions nos actions, nos résultats et l'usage des ressources reçues. La confiance de nos donateurs se construit par la clarté, pas par les promesses.",
  },
  {
    icon: <Users className="size-6" aria-hidden="true" />,
    title: "Proximité",
    description:
      "Nos équipes vivent et travaillent au Nord-Kivu et au Sud-Kivu. Nous agissons avec les communautés locales, jamais à leur place.",
  },
  {
    icon: <BookOpen className="size-6" aria-hidden="true" />,
    title: "Durabilité",
    description:
      "Au-delà de l'urgence, nous soutenons la reconstruction : accès à l'école, relance des activités économiques et retour volontaire dans la sécurité.",
  },
];

/** A member of the Aide RDC team. */
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Espérance Mwamba",
    role: "Directrice générale",
    bio: "Humanitaire depuis quinze ans, elle a coordonné des opérations d'urgence à Goma et Bukavu avant de fonder Aide RDC en 2022.",
    initials: "EM",
  },
  {
    name: "Jean-Baptiste Kambale",
    role: "Responsable des programmes",
    bio: "Ingénieur agronome, il pilote l'aide alimentaire et les projets de relance agricole auprès des familles déplacées du Nord-Kivu.",
    initials: "JK",
  },
  {
    name: "Dr. Nadine Bahati",
    role: "Coordinatrice santé",
    bio: "Médecin de formation, elle supervise les cliniques mobiles et les campagnes de vaccination dans les sites de déplacés.",
    initials: "NB",
  },
  {
    name: "Patrick Ilunga",
    role: "Responsable logistique",
    bio: "Il organise l'acheminement des abris d'urgence et des vivres vers les zones les plus difficiles d'accès de l'est du pays.",
    initials: "PI",
  },
];

/** A milestone in the organisation's history. */
interface Milestone {
  year: string;
  title: string;
  description: string;
}

const TIMELINE: Milestone[] = [
  {
    year: "2022",
    title: "Naissance d'Aide RDC",
    description:
      "Un collectif de soignants et de travailleurs sociaux de Goma se structure pour répondre à l'afflux de familles déplacées.",
  },
  {
    year: "2024",
    title: "L'escalade du conflit",
    description:
      "La reprise des combats provoque des déplacements massifs. Nos équipes ouvrent des points d'accueil d'urgence et distribuent vivres et eau potable.",
  },
  {
    year: "2025",
    title: "La chute de Goma",
    description:
      "Face à la crise, nous élargissons nos opérations aux sites de déplacés autour de la ville et accompagnons les premiers retours volontaires.",
  },
  {
    year: "Aujourd'hui",
    title: "Reconstruire et accompagner",
    description:
      "Nous soutenons plus de 40 000 personnes : aide alimentaire, santé, abris, scolarisation et appui à la reprise des activités.",
  },
];

function ValueCard({ value }: { value: Value }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-6 shadow-subtle transition-transform hover:-translate-y-1">
      <span className="grid size-12 place-items-center rounded-full bg-secondary text-primary">
        {value.icon}
      </span>
      <h3 className="font-display text-lg font-semibold">{value.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {value.description}
      </p>
    </article>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-subtle">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-primary font-display text-lg font-semibold text-primary-foreground"
        >
          {member.initials}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold">
            {member.name}
          </h3>
          <p className="text-sm font-medium text-primary">{member.role}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {member.bio}
      </p>
    </article>
  );
}

export function AboutPage() {
  return (
    <>
      <PageContainer>
        <PageHeader
          eyebrow="À propos"
          title="Notre mission, notre histoire, notre équipe"
          lead="Aide RDC est une organisation humanitaire congolaise qui vient en aide aux personnes déplacées par le conflit dans l'est de la République démocratique du Congo."
        />
      </PageContainer>

      <SectionBand tone="cream">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Le contexte : une crise oubliée à l'est de la RDC
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Depuis 2024, le conflit dans l'est de la République démocratique
              du Congo connaît une escalade sans précédent. Les affrontements
              entre groupes armés et les opérations militaires ont poussé des
              centaines de milliers de familles à fuir leurs villages du
              Nord-Kivu et du Sud-Kivu.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              En 2025, la chute de Goma a marqué un tournant : la ville, qui
              accueillait déjà d'immenses sites de déplacés, s'est retrouvée au
              cœur de la crise. Des millions de personnes vivent aujourd'hui
              dans des conditions précaires, sans accès garanti à la nourriture,
              à l'eau potable, aux soins ou à un abri décent.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Aujourd'hui, la situation reste fragile. Si certaines zones
              connaissent des retours progressifs, beaucoup de familles ne
              peuvent pas rentrer chez elles en sécurité. Notre rôle est de
              répondre à l'urgence immédiate tout en accompagnant, pas à pas,
              les communautés qui souhaitent reconstruire leur vie.
            </p>
          </div>
          <aside className="rounded-lg border border-border bg-card p-6 shadow-subtle">
            <h3 className="font-display text-lg font-semibold">
              La crise en chiffres
            </h3>
            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-sm text-muted-foreground">
                  Personnes accompagnées
                </dt>
                <dd className="font-display text-3xl font-semibold text-primary">
                  40 000+
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Sites de déplacés soutenus
                </dt>
                <dd className="font-display text-3xl font-semibold text-primary">
                  18
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Provinces d'intervention
                </dt>
                <dd className="font-display text-3xl font-semibold text-primary">
                  2
                </dd>
              </div>
            </dl>
            <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Nord-Kivu et Sud-Kivu, République démocratique du Congo
            </p>
          </aside>
        </div>
      </SectionBand>

      <SectionBand tone="plain">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Notre mission
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Apporter une aide humanitaire digne et efficace aux personnes
            déplacées par le conflit dans l'est de la RDC, et les accompagner
            vers la reconstruction de leur vie : se nourrir, se soigner, se
            loger, retourner à l'école et retrouver un moyen de subsistance.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <ValueCard key={value.title} value={value} />
          ))}
        </div>
      </SectionBand>

      <SectionBand tone="cream">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          Notre histoire
        </h2>
        <ol className="mt-10 space-y-8 border-l-2 border-border pl-6 sm:pl-8">
          {TIMELINE.map((milestone) => (
            <li key={milestone.year} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.9rem] top-1.5 size-3 rounded-full bg-accent ring-4 ring-secondary sm:-left-[2.4rem]"
              />
              <p className="font-mono text-sm font-semibold uppercase tracking-wider text-primary">
                {milestone.year}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">
                {milestone.title}
              </h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                {milestone.description}
              </p>
            </li>
          ))}
        </ol>
      </SectionBand>

      <SectionBand tone="plain">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Notre équipe
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Une équipe congolaise, ancrée dans les communautés qu'elle sert.
            Soignants, logisticiens et travailleurs sociaux unissent leurs
            compétences pour agir vite et bien, au plus près des besoins.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {TEAM.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </SectionBand>

      <SectionBand tone="cream">
        <div
          className={cn(
            "flex flex-col items-start gap-6 rounded-lg border border-border bg-card p-8 shadow-subtle sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <HandHeart className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold">
                Soutenez notre action
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Votre don finance directement l'aide alimentaire, la santé et
                les abris d'urgence pour les familles déplacées.
              </p>
            </div>
          </div>
          <Button
            asChild
            data-ocid="about.donate_button"
            className="shrink-0 rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <Link to="/faire-un-don">
              Faire un don
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </SectionBand>
    </>
  );
}
