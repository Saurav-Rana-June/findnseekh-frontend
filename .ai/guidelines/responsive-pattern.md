# FindnSeekh responsive pattern (Home reference)

Canonical reference for how the **Home** page (`home-page.html`) and its sections handle layout, typography, and control density. **Reuse this pattern on every new screen** unless product explicitly needs a different breakpoint map.

Related: [ui-reusability.md](./ui-reusability.md), density tokens in `src/styles/_tokens-density.scss`.

---

## 1. Core idea

| Layer | What changes on small screens | Where it lives |
|--------|--------------------------------|----------------|
| **Density** | Type scale, button/field/pill heights, icons, section rhythm | `:root` overrides in `_tokens-density.scss` at **`max-width: 639px`** |
| **Section shell** | Shared headings and spacing | `styles.scss` → `.section`, `.section-head`, `.section-title`, `.section-lead` |
| **Layout** | Grid columns, hide/show chrome, stack vs row | Per-section `.scss` at **layout breakpoints** (560, 640, 760, 1020, etc.) |
| **Tiles / cards** | Icon size, title/body font pairing | Shared components (`custom-*-card`, step tiles) at **`max-width: 560px`** (card compact tier) |
| **CTAs on mobile** | Unify primary buttons to **md control tokens** | Parent section: `:host ::ng-deep` CSS variables on `app-custom-primary-button` at **639px** |
| **Touch feedback** | No blue tap splash; no sticky hover on tap | `styles.scss` @639 + `@media (hover: hover) and (pointer: fine)` on shared controls/cards |

**Default rule:** Prefer **CSS variables** (`var(--text-sm)`, `var(--control-height-md)`) over raw `rem`/`px`. Add local overrides only when tokens are not enough (e.g. hero search card layout).

---

## 2. Breakpoint ladder

### Primary density breakpoint (use everywhere for type + controls)

```text
≤639px  →  “Mobile compact” (matches token file; gutter 18px, nav-height 64px)
≥640px  →  Desktop / tablet token defaults
```

Sass helper (optional): `@include mixins.below(sm)` → `max-width: 639px` (`$breakpoints.sm: 640px` in `_variables.scss`).

### Layout breakpoints used on Home (do not conflate with density)

| Breakpoint | Typical use on Home |
|------------|---------------------|
| **560px** | Tighter grid gaps; **card title/desc** compact tier on skill + how-it-works tiles |
| **640px** | Featured teachers grid → 1 column (consider aligning new work to **639px** for consistency) |
| **760px** | Hero title/search stack; how-it-works steps → 1 column; step connectors hidden |
| **1020px** | Explore skills 4→2 cols; featured teachers 3→2; hero map column hidden |
| **960px** | Site header → mobile drawer (layout shell, not home feature) |

When adding a new section, pick the **smallest set** of breakpoints you need: usually **639** (density) + one **layout** breakpoint for grids.

---

## 3. Global page structure (every home section follows this)

```html
<section class="section section--{white|cream|tight}" id="…" aria-labelledby="…">
  <div class="page-container">
  <!-- optional -->
    <div class="section-head section-head--center|row">
      <h2 class="section-title">…</h2>
      <p class="section-lead">…</p>
    </div>
    <!-- content: grid, CTA band, etc. -->
  </div>
</section>
```

| Class | Role |
|--------|------|
| `page-container` | Max width + horizontal `var(--gutter)` |
| `section` | Vertical padding via `clamp(var(--section-padding-y-min), …)` (tokens shrink at 639px) |
| `section-head` | Bottom margin via section-head tokens |
| `section-title` | `var(--text-display)`; at **639px** → `var(--text-2xl)` + tight leading (`styles.scss`) |
| `section-lead` | `var(--text-lg)`; at **639px** → `var(--text-lead)`, smaller top margin |

Section-specific SCSS should only add **background modifiers** (`section--white`, `section--cream`) and **layout** (grids, rows). Avoid redefining `.section-title` / `.section-lead` unless the block is **not** using those classes (e.g. become-teacher `h2` inside `.cta`).

---

## 4. Home page section map

Order in `home-page.html`:

| # | Component | Layout notes | Mobile density / behavior |
|---|-----------|--------------|---------------------------|
| 1 | `app-home-hero` | 2-col → 1-col @1020; map hidden | Search stacks @760; popular pills smaller; Find Teachers uses `--control-*` + `--icon-size-md` in submit area |
| 2 | `app-explore-skills-section` | 4→2 @1020; gap @560 | Uses global `section-title` / `section-lead`; cards compact @560 via `app-custom-skill-category-card` |
| 3 | `app-featured-teachers-section` | 3→2 @1020; 1 col @640 | Browse CTA: hide in header @639, show `section-foot__browse`; button tokens @639 |
| 4 | `app-how-it-works-section` | 3→1 @760 | Global section head; tiles compact @560 (match skill card type scale) |
| 5 | `app-become-teacher-cta` | Flex wrap CTA band | `h2` → `--text-2xl`; body → `--text-sm` @639; full-width button @560; CTA tokens @639 |

---

## 5. Token cheat sheet (≤639px)

Source: `src/styles/_tokens-density.scss`.

**Typography (most used on Home)**

- `--text-2xl`, `--text-lead`, `--text-sm`, `--text-xs`
- `--text-hero`, `--text-display` (clamps shrink automatically)

**Controls (unified mobile CTAs)**

- `--control-height-md` (40px)
- `--control-padding-x-md`, `--control-font-md`, `--control-gap`
- `--icon-size-md` (16px) on trailing icons

**Section rhythm**

- `--section-padding-y-min` / `--max` (48px / 80px)
- `--section-head-margin-min` / `--max` (24px / 40px)

---

## 6. Mobile primary button pattern (copy-paste)

Use for **Find Teachers**, **Become a Teacher**, **Browse all teachers**, **View Profile**, and any new section CTA on phone.

Template (wrap selector to the button host class you use):

```scss
@media (max-width: 639px) {
  :host ::ng-deep .YOUR_WRAPPER app-custom-primary-button,
  :host ::ng-deep .YOUR_WRAPPER {
    --cp-btn-min-height: var(--control-height-md);
    --cp-btn-padding-x: var(--control-padding-x-md);
    --cp-btn-font-size: var(--control-font-md);
    --cp-btn-gap: var(--control-gap);
  }

  :host ::ng-deep .YOUR_WRAPPER .cp-btn__icon {
    width: var(--icon-size-md);
    height: var(--icon-size-md);
  }
}
```

Keep **HTML** `size="lg"` or `size="md"` for desktop; mobile appearance is driven by these variables, not duplicate buttons.

---

## 7. Shared card / tile typography (560px tier)

**Skill category card** and **how-it-works step tile** share the same mobile **label + description** scale:

| Element | ≤560px |
|---------|--------|
| Title / name | `0.95rem`, font-weight ~550 |
| Description | `var(--text-xs)`, `line-height: 1.45` |
| Icon container | Smaller fixed box + smaller SVG |

Put this compact tier in the **shared component** SCSS, not in every feature section.

**Teacher card** uses **`max-width: 640px`** for a broader mobile layout (banner height, chips, footer stack) and sets `--cp-btn-*` on `&__cta` to the same control tokens as above.

---

## 8. Progressive disclosure (mobile-only UI)

Pattern from **Featured teachers**:

- Desktop: action in `section-head--row` (e.g. Browse).
- Mobile @639: hide `.section-head__browse--desktop`; show `.section-foot__browse` centered below the list.
- Button: not full width (`width: auto`) unless a separate rule requires full width (become-teacher @560).

Reuse this for any “header action that crowds the title on narrow screens.”

---

## 9. Touch feedback on mobile (no tap splash)

On phones, WebKit/Chromium show a **blue or grey flash** on tap (`-webkit-tap-highlight-color`) and may leave **`:hover` styles stuck** after touch. Home buttons and clickable cards should not flash or “pop” on tap.

### Global (already in `styles.scss` @639px)

Apply once; do not duplicate per section.

```scss
@media (max-width: 639px) {
  a,
  button,
  summary,
  [role='button'],
  input,
  textarea,
  select,
  label {
    -webkit-tap-highlight-color: transparent;
  }

  a:focus:not(:focus-visible),
  button:focus:not(:focus-visible),
  summary:focus:not(:focus-visible),
  [role='button']:focus:not(:focus-visible) {
    outline: none;
  }
}
```

- **Keep** keyboard access: global `::focus-visible` (green ring) is unchanged.
- **Do not** set `outline: none` on `:focus-visible`.

### Hover only for real pointers

Wrap **lift / color / shadow hover** on tappable UI so touch devices do not inherit hover after tap:

```scss
@media (hover: hover) and (pointer: fine) {
  .your-card:hover,
  .your-btn:hover:not(:disabled) {
    /* hover styles */
  }
}
```

**Applied on Home-related shared UI:**

| Component | What to guard |
|-----------|----------------|
| `custom-skill-category-card` | Card lift, ring/icon hover; optional `&:active { transform: none; }` on the button card |
| `custom-teacher-card` | Card lift + avatar hover |
| `custom-primary-button` | `.cp-btn:hover` fill/outline swap |
| `custom-status-pill` | `.cp-pill.is-interactive:hover` (keep `.is-active` outside the media query) |

When adding a **new clickable card or button**, use the same hover media query. If you only add global tap-highlight rules without guarding hover, taps can still look like a bad “splash.”

---

## 10. Layout shell (header / footer)

Not in `home-page.html`, but the same **639px density** idea applies:

- **Header:** smaller logo/toggle/icons @639; mobile nav links `--text-sm`; drawer actions use control tokens.
- **Footer:** brand `--text-sm`; column headings `--text-xs`; links/contact `--text-xs` @639.

---

## 11. Checklist for a new screen / section

1. **HTML:** `section` → `page-container` → optional `section-head` with `section-title` + `section-lead`.
2. **Desktop:** Use token vars for type and controls; grids with `minmax(0, 1fr)` and `> li { min-width: 0 }`.
3. **639px:** Rely on global tokens + `styles.scss` section-head rules; override CTAs with `--cp-btn-*` pattern.
4. **Layout breakpoint:** Add one media query for grid column collapse (prefer 1020 / 760 / 560 based on Home precedent).
5. **Cards:** Extract repeated tile UI to `shared/components`; put **560px** title/desc/icon rules there.
6. **Avoid:** Duplicating `section-lead` font rules in every section (global rules already apply); new raw `font-size: 0.9rem` without a token justification.
7. **Align:** New breakpoints at **639** for density; use **640** only when matching an existing grid rule (or migrate to 639 when touching the file).
8. **Touch:** Rely on global tap-highlight + `focus:not(:focus-visible)` @639; guard new card/button hovers with `(hover: hover) and (pointer: fine)`.

---

## 12. File reference

| Concern | Path |
|---------|------|
| Density tokens | `src/styles/_tokens-density.scss` |
| Section shell | `src/styles/styles.scss` |
| Breakpoints / gutter | `src/styles/_variables.scss` |
| Mixins `below(sm)` | `src/styles/_mixins.scss` |
| Home composition | `src/app/features/home/presentation/pages/home-page/home-page.html` |
| Hero | `.../home-hero/home-hero.scss` |
| Explore skills | `.../explore-skills-section/` |
| Featured teachers | `.../featured-teachers-section/` |
| How it works | `.../how-it-works-section/` + `shared/.../custom-how-it-works-step-tile/` |
| Become teacher CTA | `.../become-teacher-cta/` |
| Skill card | `shared/.../custom-skill-category-card/` |
| Teacher card | `shared/.../custom-teacher-card/` |
| Primary button | `shared/.../custom-primary-button/` |
| Status pill | `shared/.../custom-status-pill/` |
| Mobile tap feedback | `src/styles/styles.scss` (@639 block) |

---

## 13. Mental model (one diagram)

```text
                    ┌─────────────────────────────────────┐
                    │  :root tokens (@639 density)        │
                    │  text · control · icon · section    │
                    └─────────────────┬───────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
   styles.scss                 section .scss                  shared card
   .section-title              grid @1020/760/640             compact @560
   .section-lead               hide/show CTAs                 title/desc pair
   tap-highlight @639          hide/show CTAs                 hover @ pointer:fine
          │                           │
          └───────────┬───────────────┘
                      ▼
              ::ng-deep --cp-btn-* @639
              (section-level CTAs only)
```

This is the pattern established on Home; extend it app-wide before inventing new one-off mobile styles.