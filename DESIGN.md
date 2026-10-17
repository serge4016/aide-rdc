# Design Brief

## Direction

Solidarité Congo — a warm, trustworthy humanitarian aid site for people displaced by the armed conflict in eastern DRC, built on the Congolese flag identity.

## Tone

Warm editorial humanism — cream paper surfaces, serif headlines and generous whitespace make an aid organization feel human and credible rather than institutional or clinical.

## Differentiation

A recurring three-band "flag ribbon" (sky blue / gold / red) acts as the site's signature: it marks section headings, tops cards, and becomes the step progress indicator in the multi-step donation flow.

## Color Palette

| Token      | OKLCH         | Role                                          |
| ---------- | ------------- | --------------------------------------------- |
| background | 0.975 0.012 85 | Warm cream page canvas                        |
| foreground | 0.22 0.03 250  | Deep blue-ink body text                       |
| card       | 0.995 0.006 85 | Near-white raised surfaces                    |
| primary    | 0.5 0.14 235   | Sky blue — trust, primary actions, "Faire un don" |
| accent     | 0.78 0.15 78   | Warm gold — hope, highlights, active states   |
| muted      | 0.94 0.018 85  | Soft cream section alternation                |
| destructive | 0.53 0.2 27   | Flag red — urgency, crisis figures, errors    |

## Typography

- Display: Fraunces — hero headlines, section titles, key figures (warm serif, human)
- Body: General Sans — paragraphs, navigation, UI labels, buttons
- Mono: Geist Mono — statistics, amounts, donation references
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base md:text-lg`

## Elevation & Depth

Flat cream base with layered card surfaces; depth comes from `shadow-subtle` on cards and `shadow-elevated` on hover/active, plus soft gradient washes — never heavy drop shadows.

## Structural Zones

| Zone    | Background          | Border   | Notes                                                        |
| ------- | ------------------- | -------- | ------------------------------------------------------------ |
| Header  | card + backdrop blur | border-b | Sticky; logo + FR nav + prominent "Faire un don" button       |
| Content | background / muted  | —        | Alternate `bg-background` and `bg-muted/40` per section       |
| Footer  | 0.22 0.03 250 (ink) | border-t | Dark blue-ink footer, flag ribbon top edge, links + contact   |

## Spacing & Rhythm

Sections use `py-16 md:py-24` with `container` gutters; content groups sit on a 4/8/12 spacing scale with `gap-6` grids and `space-y-4` inside cards.

## Component Patterns

- Buttons: pill-shaped, primary = sky blue with `shadow-warm`; secondary = gold outline; hover lifts with `-translate-y-0.5` + `shadow-elevated`
- Cards: `rounded-2xl`, `bg-card`, `border`, `shadow-subtle`, hover to `shadow-elevated`
- Badges: small pill, `bg-accent/15 text-accent-foreground`, uppercase tracking-wide

## Motion

- Entrance: `animate-fade-up` staggered per section, 0.5s cubic-bezier(0.4,0,0.2,1)
- Hover: 0.3s `transition-smooth` lift + shadow on cards and buttons
- Decorative: `animate-float-slow` on hero illustration accents, `animate-pulse-soft` on live crisis counters

## Constraints

- Entirely in French; all copy, labels, and error states in French
- Mobile-first responsive; navigation collapses to a drawer under `md`
- No real mobile-money payment integration, no donation email receipt, no donation stats dashboard
- Semantic tokens only — no raw hex/rgb in components; AA+ contrast in both modes

## Signature Detail

The flag ribbon as a structural motif — a three-band blue/gold/red rule that doubles as the donation flow's step progress bar.
