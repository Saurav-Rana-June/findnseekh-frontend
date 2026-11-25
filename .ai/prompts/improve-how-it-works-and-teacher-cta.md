# Prompt: Enrich “How it Works” + “Become a Teacher” (Home only)

Copy everything below the line into the agent when you are ready to implement. **Do not modify any other home sections** (hero, explore skills, featured teachers, header, footer, or other routes).

---

## Your role

You are a **senior product designer + Angular UI engineer** for FindnSeekh. Use the full design toolkit: hierarchy, rhythm, density, color/contrast, depth (subtle shadows and borders), alignment, affordance, motion (respect `prefers-reduced-motion`), and accessibility (WCAG-minded contrast, focus states, semantics).

Deliver a **more substantial, premium, trustworthy** feel for two adjacent blocks that currently read as **sparse and “floating”** on desktop: lots of white canvas, thin dashed connectors, small icon tiles, and a green CTA band with weak visual bridge between copy and button.

---

## Hard constraints (non‑negotiable)

1. **Scope:** Only these files and their shared dependency:
   - `src/app/features/home/presentation/components/how-it-works-section/*`
   - `src/app/features/home/presentation/components/become-teacher-cta/*`
   - `src/app/shared/components/custom-how-it-works-step-tile/*` (extend tile if needed; do not fork a second tile component)
2. **Do not edit:** `home-hero`, `explore-skills-section`, `featured-teachers-section`, `home-page.html` (unless a one-line wrapper class is absolutely required—prefer not), layout shell, global tokens unless a token is missing and **must** be added for these sections only via local SCSS variables.
3. **Follow:** [responsive-pattern.md](../guidelines/responsive-pattern.md) and [ui-reusability.md](../guidelines/ui-reusability.md).
4. **Reuse:** `app-custom-how-it-works-step-tile`, `app-custom-primary-button`—extend via inputs/CSS variables, not duplicate markup.
5. **Mobile:** Density @ **639px**; card/tile compact tier @ **560px** where appropriate; `(hover: hover) and (pointer: fine)` for hover; no WebKit tap splash (global rules already exist).
6. **No new npm packages.** SVG/CSS only for decoration unless an existing shared pattern exists.

---

## Current state (what feels “empty”)

**How it Works** (`#how-it-works`):

- White full-bleed section; centered `section-title` + `section-lead`; 3-column grid with **large horizontal gap** and **long faint dashed connectors**.
- Step tiles are **icon + number badge + title + short desc** with little surface area—no card shell, no progression emphasis, no secondary trust line.
- Large **vertical whitespace** between the step row and the next section.

**Become a Teacher** (`#become-a-teacher`):

- `section--tight` still leaves a **wide white margin** above/below the green `.cta` card.
- CTA is a flat primary green rectangle; decorative rings are **very low contrast**; copy and button feel **disconnected** on wide screens (button isolated on the right).
- Transition from white “steps” section to green band is **abrupt**—no shared rhythm or visual handshake.

Reference screenshot: user provided desktop view showing sparse steps + separated CTA button.

---

## Design goals

### How it Works — make it feel “designed,” not “placeholder”

- Introduce a **contained step experience** (e.g. soft cream/mint panel, subtle border, or elevated row) so steps sit on a **surface**, not infinite white.
- Give each step a **clear card or tile frame** (consistent with Explore Skills energy but not copying skill cards): optional light background, border, **min-height** alignment across three columns.
- **Strengthen progression:** numbered path, clearer connector (brand-tinted dashes or a soft gradient line), or replace connector with **step index pills** on mobile.
- **Typography hierarchy:** keep global `section-title` / `section-lead`; enhance tile title/desc with tokens; optional **one-line micro-stat or hint** per step if data exists in `steps()` entity—if not, improve copy density via layout only.
- **Desktop:** reduce perceived void—tighten grid gap thoughtfully (not cramped); max-width on step cluster if ultra-wide screens feel lost.
- **Mobile (≤760 stack):** vertical timeline feel (left rail or centered stack) with connectors hidden per existing pattern.

### Become a Teacher CTA — make it a hero moment, not a footer strip

- **Tighten section rhythm:** adjust `section--tight` padding only in `become-teacher-cta.scss` so the green band **anchors** the page end without a huge white runway (especially above the CTA).
- **Enrich the green panel:** layered background (primary + primary-700 gradient or mesh), stronger but tasteful `cta__mark`, optional second decorative element (dots, soft blob) using brand cream at low opacity.
- **Layout:** on large screens, consider **copy + supporting bullets or trust chips** (2–3 short lines, e.g. “Free to join”, “Reach local learners”) using existing `app-custom-status-pill` **non-interactive** or simple styled spans—**only inside this section**.
- **Button relationship:** align button with copy baseline group; optional subtle divider or visual grouping so the CTA doesn’t float alone.
- Preserve cream button variant; mobile: full-width button @560px; control tokens @639px per responsive-pattern.

### Bridge the two sections (still scoped to these components only)

- Optional: **shared bottom accent** on how-it-works (e.g. very subtle cream band or downward curve) and matching **top radius/shadow** on CTA so the scroll feels intentional.
- Do **not** change Featured Teachers or Explore Skills to achieve this.

---

## Implementation checklist

- [ ] Read step data in `home.entity` / `how-it-works-section.ts` before adding fields.
- [ ] Prefer SCSS + small HTML structure in section wrappers over bloating the shared tile API.
- [ ] If extending `custom-how-it-works-step-tile`, add inputs only when necessary (`variant`, `showCard`, `density`).
- [ ] Use `var(--text-*)`, `var(--color-primary-*)`, `var(--radius-*)`, `var(--shadow-*)` from `_variables.scss` / `_tokens-density.scss`.
- [ ] Verify desktop (1280px), tablet (768px), mobile (375px); no hover stickiness on touch.
- [ ] Run `ng build` (development config) before finishing.
- [ ] Summarize visual changes with before/after intent; no unrelated refactors.

---

## Acceptance criteria

1. Desktop: user immediately perceives **structure** (surface, steps, path)—not a row of small icons on white.
2. CTA block feels **intentional and premium**; less dead space above/below; button visually tied to message.
3. **Zero** changes outside the allowed file list (verify with `git diff --name-only`).
4. Matches FindnSeekh green/cream brand; accessible text contrast on green panel.
5. Mobile layout remains scannable; no regression to tap highlight or sticky hover.

---

## Suggested agent opening line (optional)

> Improve visual density and hierarchy for **only** `#how-it-works` and `#become-a-teacher` on the home page per `.ai/prompts/improve-how-it-works-and-teacher-cta.md`. Follow responsive-pattern and ui-reusability guidelines. Show me the plan in 3 bullets, then implement.