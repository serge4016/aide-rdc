import { PageContainer } from "@/components/layout/PageContainer";
import { MapPin, TrendingUp, Users } from "lucide-react";
import type { ReactNode } from "react";

interface CrisisStat {
  icon: ReactNode;
  value: string;
  label: string;
  detail: string;
}

const STATS: CrisisStat[] = [
  {
    icon: <Users className="size-6" aria-hidden="true" />,
    value: "≈ 5,3 millions",
    label: "personnes déplacées internes",
    detail:
      "La RDC figure parmi les pays comptant le plus grand nombre de déplacés internes au monde.",
  },
  {
    icon: <TrendingUp className="size-6" aria-hidden="true" />,
    value: "96 %",
    label: "des déplacements dus au conflit armé",
    detail:
      "L'immense majorité des déplacements résulte directement des violences et des affrontements.",
  },
  {
    icon: <MapPin className="size-6" aria-hidden="true" />,
    value: "3 provinces",
    label: "les plus touchées",
    detail:
      "Le Nord-Kivu, le Sud-Kivu et l'Ituri concentrent l'essentiel des besoins humanitaires.",
  },
];

/** Key figures describing the displacement crisis in eastern DRC. */
export function CrisisStats() {
  return (
    <section
      data-ocid="home.crisis.section"
      className="border-y border-border bg-secondary/50"
    >
      <PageContainer>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            L'ampleur de la crise
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Une crise humanitaire d'une ampleur sans précédent
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            À l'est de la République démocratique du Congo, des millions de
            familles ont fui les violences. Derrière chaque chiffre, une vie
            bouleversée et un besoin urgent d'assistance.
          </p>
        </div>

        <dl className="mt-12 grid gap-6 md:grid-cols-3">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              data-ocid={`home.crisis.stat.${index + 1}`}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-7 shadow-sm"
            >
              <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                {stat.icon}
              </span>
              <div>
                <dt className="font-display text-3xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-sm font-semibold uppercase tracking-wider text-primary">
                  {stat.label}
                </dd>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {stat.detail}
              </p>
            </div>
          ))}
        </dl>
      </PageContainer>
    </section>
  );
}
