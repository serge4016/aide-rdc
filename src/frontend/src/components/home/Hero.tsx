import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, ShieldCheck } from "lucide-react";

const HERO_IMAGE = "/assets/generated/hero-aide-rdc.dim_1600x1000.jpg";

/** Landing hero: mission statement, dual call to action and a field photo. */
export function Hero() {
  return (
    <section
      data-ocid="home.hero.section"
      className="relative overflow-hidden bg-gradient-subtle"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
            <span
              className="size-2 rounded-full bg-destructive"
              aria-hidden="true"
            />
            Urgence à l'est de la RDC
          </p>
          <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Ensemble, aux côtés des déplacés de l'est de la RDC
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Aide RDC accompagne les familles déplacées par le conflit armé au
            Nord-Kivu, au Sud-Kivu et en Ituri : aide alimentaire, soins de
            santé et abris d'urgence, au plus près des besoins.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              data-ocid="home.hero.donate_button"
              className="rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <Link to="/faire-un-don">
                <Heart className="size-5" aria-hidden="true" />
                Faire un don
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-ocid="home.hero.programmes_button"
              className="rounded-full border-border bg-card px-7 text-base font-semibold transition-transform hover:-translate-y-0.5"
            >
              <Link to="/programmes">
                Découvrir nos actions
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-success" aria-hidden="true" />
            100 % des dons financent directement nos actions sur le terrain.
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-warm opacity-30 blur-2xl"
            aria-hidden="true"
          />
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <img
              src={HERO_IMAGE}
              alt="Une travailleuse humanitaire remet un sac de vivres à une mère portant son enfant dans un camp de déplacés, à l'est de la RDC."
              className="h-full w-full object-cover"
              width={1600}
              height={1000}
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-5 left-4 hidden rounded-xl border border-border bg-card px-5 py-3 shadow-md sm:block">
            <p className="font-display text-2xl font-semibold text-primary">
              5,3 M
            </p>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              personnes déplacées
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
