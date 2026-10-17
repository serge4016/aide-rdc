import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";

const REASSURANCES = [
  {
    icon: <ShieldCheck className="size-5" aria-hidden="true" />,
    text: "Paiement sécurisé",
  },
  {
    icon: <Sparkles className="size-5" aria-hidden="true" />,
    text: "Mobile Money & carte bancaire",
  },
  {
    icon: <Heart className="size-5" aria-hidden="true" />,
    text: "Don ponctuel ou mensuel",
  },
];

/** Full-width call to action inviting visitors to support the mission. */
export function DonationBanner() {
  return (
    <section
      data-ocid="home.donation.section"
      className="relative overflow-hidden bg-gradient-primary text-primary-foreground"
    >
      <div className="h-1.5 w-full flag-ribbon" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 sm:py-20">
        <span className="grid size-14 place-items-center rounded-full bg-primary-foreground/15">
          <Heart className="size-7" aria-hidden="true" />
        </span>
        <div className="max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Votre don change une vie aujourd'hui
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-primary-foreground/85">
            Chaque contribution finance directement l'aide alimentaire, les
            soins de santé et les abris d'urgence pour les familles déplacées de
            l'est de la RDC.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          data-ocid="home.donation.donate_button"
          className="rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-md transition-transform hover:-translate-y-0.5"
        >
          <Link to="/faire-un-don">
            <Heart className="size-5" aria-hidden="true" />
            Faire un don maintenant
          </Link>
        </Button>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-primary-foreground/85">
          {REASSURANCES.map((item) => (
            <li key={item.text} className="flex items-center gap-2">
              {item.icon}
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
