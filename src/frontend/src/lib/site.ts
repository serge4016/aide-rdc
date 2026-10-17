/** Static site identity and contact details for Aide RDC. */
export const SITE = {
  name: "Aide RDC",
  tagline: "Ensemble, aux côtés des déplacés de l'est de la RDC",
  description:
    "Aide RDC soutient les personnes déplacées par le conflit dans l'est de la République démocratique du Congo : aide alimentaire, santé et abris d'urgence.",
  email: "contact@aiderdc.org",
  phone: "+243 81 000 00 00",
  address: "Avenue de la Paix 12, Goma, Nord-Kivu, RDC",
} as const;

/** Primary navigation shown in the header and footer. */
export const NAV_LINKS = [
  { label: "Accueil", to: "/" },
  { label: "À propos", to: "/a-propos" },
  { label: "Programmes", to: "/programmes" },
  { label: "Actualités", to: "/actualites" },
  { label: "Témoignages", to: "/temoignages" },
  { label: "Galerie", to: "/galerie" },
  { label: "Contact", to: "/contact" },
] as const;

/** Secondary links shown in the footer. */
export const FOOTER_LINKS = [
  { label: "FAQ", to: "/faq" },
  { label: "Mentions légales", to: "/mentions-legales" },
  { label: "Politique de confidentialité", to: "/confidentialite" },
] as const;
