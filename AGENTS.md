# Project Guidance

## User Preferences

- Site entièrement en français
- Design moderne, chaleureux et professionnel, responsive, avec navigation claire
- Identité visuelle humanitaire aux couleurs du drapeau congolais : bleu ciel, jaune, rouge

## Accepted Requirements

[Filled after each deployed build — what the user asked for and the build delivered]

## Verified Commands

- **typecheck**: `mops check --fix`
- **fix**: `pnpm fix`
- **build**: `mops build`

## Learnings

- Backend enum variants must be value-imported and value-re-exported from src/frontend/src/types.ts so components can compare against them at runtime.
- AboutPage is the only named page export in src/frontend/src/pages; every other page uses a default export.
- Keep social meta tags in src/frontend/index.html and keep og:title identical to <title>.
- Dispatch prompts are strict YAML: use folded >- scalars for any text containing a colon-space or a hash, and never nest a mapping inside a compact mapping.
- The flag-ribbon utility in src/frontend/src/index.css carries the Congolese flag accent used across the site.
