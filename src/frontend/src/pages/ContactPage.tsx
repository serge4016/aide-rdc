import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContactMessage } from "@/hooks/useQueries";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { type FormEvent, useState } from "react";

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) {
    errors.name = "Veuillez indiquer votre nom.";
  }
  if (!values.email.trim()) {
    errors.email = "Veuillez indiquer votre adresse e-mail.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Cette adresse e-mail semble invalide.";
  }
  if (!values.subject.trim()) {
    errors.subject = "Veuillez préciser le sujet de votre message.";
  }
  if (!values.message.trim()) {
    errors.message = "Veuillez écrire votre message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Votre message doit contenir au moins 10 caractères.";
  }
  return errors;
}

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: "Adresse",
    value: SITE.address,
    href: undefined,
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: SITE.phone,
    href: `tel:${SITE.phone.replace(/\s/g, "")}`,
  },
  {
    icon: Mail,
    label: "E-mail",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
] as const;

function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const mutation = useSubmitContactMessage();

  function update<K extends keyof FormValues>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    };

    setValues(EMPTY_FORM);
    setSubmitted(false);
    mutation.mutate(payload, {
      onSuccess: () => setSubmitted(true),
      onError: () => setValues(payload),
    });
  }

  if (submitted) {
    return (
      <Card
        data-ocid="contact.success_state"
        className="border-success/40 bg-success/5 shadow-subtle"
      >
        <CardContent className="flex flex-col items-start gap-4 p-8">
          <span className="grid size-12 place-items-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Merci, votre message est bien envoyé
            </h2>
            <p className="mt-2 text-muted-foreground">
              Notre équipe vous répondra dans les meilleurs délais. Votre
              soutien compte énormément pour les familles déplacées.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            data-ocid="contact.send_another_button"
            className="rounded-full"
            onClick={() => setSubmitted(false)}
          >
            Envoyer un autre message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-subtle">
      <CardContent className="p-6 sm:p-8">
        <form
          noValidate
          onSubmit={handleSubmit}
          data-ocid="contact.form"
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Nom complet</Label>
              <Input
                id="contact-name"
                name="name"
                data-ocid="contact.name_input"
                autoComplete="name"
                placeholder="Votre nom"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "contact-name-error" : undefined
                }
                onChange={(event) => update("name", event.target.value)}
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  data-ocid="contact.name_error"
                  className="text-sm font-medium text-destructive"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Adresse e-mail</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                data-ocid="contact.email_input"
                autoComplete="email"
                placeholder="vous@exemple.com"
                value={values.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
                onChange={(event) => update("email", event.target.value)}
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  data-ocid="contact.email_error"
                  className="text-sm font-medium text-destructive"
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-subject">Sujet</Label>
            <Input
              id="contact-subject"
              name="subject"
              data-ocid="contact.subject_input"
              placeholder="Partenariat, bénévolat, question…"
              value={values.subject}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={
                errors.subject ? "contact-subject-error" : undefined
              }
              onChange={(event) => update("subject", event.target.value)}
            />
            {errors.subject && (
              <p
                id="contact-subject-error"
                data-ocid="contact.subject_error"
                className="text-sm font-medium text-destructive"
              >
                {errors.subject}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              name="message"
              data-ocid="contact.message_textarea"
              rows={6}
              placeholder="Écrivez votre message ici…"
              value={values.message}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
              onChange={(event) => update("message", event.target.value)}
            />
            {errors.message && (
              <p
                id="contact-message-error"
                data-ocid="contact.message_error"
                className="text-sm font-medium text-destructive"
              >
                {errors.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p
              data-ocid="contact.error_state"
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
            >
              L'envoi a échoué. Vérifiez votre connexion puis réessayez.
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Vos informations restent confidentielles.
            </p>
            <Button
              type="submit"
              data-ocid="contact.submit_button"
              disabled={mutation.isPending}
              className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <Send className="size-4" aria-hidden="true" />
              {mutation.isPending ? "Envoi en cours…" : "Envoyer le message"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ContactDetails() {
  return (
    <div className="space-y-6">
      <Card className="shadow-subtle">
        <CardContent className="space-y-5 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">
            Nos coordonnées
          </h2>
          <ul className="space-y-5">
            {CONTACT_DETAILS.map((detail) => (
              <li key={detail.label} className="flex items-start gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                  <detail.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {detail.label}
                  </p>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="break-words text-base font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="break-words text-base font-medium text-foreground">
                      {detail.value}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-start gap-3.5 border-t border-border pt-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <Clock className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Horaires
              </p>
              <p className="text-base font-medium text-foreground">
                Lundi – vendredi, 8h – 17h (heure de Goma)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-subtle">
        <div
          data-ocid="contact.map"
          role="img"
          aria-label={`Carte de localisation : ${SITE.address}`}
          className="relative h-64 w-full bg-gradient-subtle"
        >
          <svg
            viewBox="0 0 400 260"
            className="h-full w-full"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width="400" height="260" className="fill-secondary/40" />
            <g className="stroke-border" strokeWidth="1.5" fill="none">
              <path d="M0 70 H400" />
              <path d="M0 150 H400" />
              <path d="M0 210 H400" />
              <path d="M80 0 V260" />
              <path d="M200 0 V260" />
              <path d="M320 0 V260" />
            </g>
            <path
              d="M0 190 C90 150 150 230 240 180 C310 140 360 175 400 150"
              className="stroke-primary/40"
              strokeWidth="6"
              fill="none"
            />
            <path
              d="M120 0 C150 80 90 140 130 260"
              className="stroke-accent/50"
              strokeWidth="5"
              fill="none"
            />
          </svg>
          <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20">
            <MapPin className="size-6" aria-hidden="true" />
          </span>
          <span className="absolute bottom-3 left-3 rounded-full bg-card/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
            Goma, Nord-Kivu
          </span>
        </div>
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground">
            Nos bureaux se trouvent au cœur de Goma, à proximité des quartiers
            d'accueil des familles déplacées.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ContactPage() {
  return (
    <PageContainer data-ocid="contact.page">
      <PageHeader
        eyebrow="Contact"
        title="Parlons de votre engagement"
        lead="Une question, un partenariat, une proposition de bénévolat ? Écrivez-nous : notre équipe vous répond avec attention."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <ContactForm />
        <ContactDetails />
      </div>
    </PageContainer>
  );
}
