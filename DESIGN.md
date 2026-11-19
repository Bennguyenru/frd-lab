# FRD Lab Hub design system

The site uses the University of Greenwich palette on a calm, learning-app dashboard. All styles live in the `<style>` block of `index.html`; every value below is a CSS custom property there. Light and dark themes come from `light-dark()`, so a token always has both values.

## Tokens

### Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--brand` (`--g`) | #0058aa | #61ccf3 | Primary buttons, active navigation, links on hover, focus of attention |
| `--brand-soft` (`--gT`) | #e1ecf7 | brand at 25% | Active nav background, pressed filters |
| `--info` (`--b`) | #1d6a87 | #3abff0 | Informational badges, meeting chips |
| `--success` (`--y`) | #1a6d60 | #89e9d7 | Done, present, achievements, "in lab" counts |
| `--danger` (`--bad`) | #c62828 | #ff8a80 | Late, errors, destructive confirmation |
| `--ink` | #00033d | #eef2fb | Headings and strong text |
| `--text` | #2e2e2e | #d9deef | Body text |
| `--mute` | #62626b | #9ba6c9 | Secondary text (5.6:1 on the page background) |
| `--bg`, `--card`, `--soft`, `--soft2`, `--line` | | | Page, surfaces, quiet fills and borders |
| `--navy`, `--blue`, `--sky`, `--teal` | | | Raw Greenwich colours, used only inside gradients |
| `--grad-brand` | | | Progress bars |

Text tokens on their soft background meet WCAG AA (4.5:1) for small text: info 5.3:1, success 5.4:1, danger 4.6:1, brand 5.9:1.

### Type

Inter, 15px body (`--fs-base`), line height 1.55. Scale: `--fs-xs` 12 (badges, captions), `--fs-sm` 13 (notes, meta), `--fs-md` 14 (dense UI), `--fs-base` 15, `--fs-lg` 17 (card titles); page titles use `clamp(24px, 3vw, 30px)`. Weights: 400 body, 600 labels and buttons, 700 headings and numbers.

### Shape and depth

Radius: `--r-xs` 6 (badges), `--r-sm` 8 (buttons, inputs), `--r-md` 10 (rows, nav items), `--r-lg` 12 (cards), `--r-xl` 16 (hero, dialogs), `--r-pill` (filters, progress). Shadow: `--sh-1` resting cards on boards, `--sh-2` dragged items and the sign-in card, `--sh-3` dialogs. Spacing follows a 4px grid; cards use 20px by 22px padding and 18px gaps.

## Components

| Component | Class | Variants | States | Notes |
|---|---|---|---|---|
| Button | `.btn` | `.pri` (one per view), `.dark`, `.sm` | hover, `:disabled` (busy), focus ring | Min height 42px (36px for `.sm`) |
| Text link | `.link` | `.sm` | hover turns brand | For navigation inside a card |
| Filter pill | `.f` | | `aria-pressed=true` | Groups of views or filters |
| Badge | `.badge` | `.ok`, `.ac`, `.bad` | | Status only, never a button |
| Card | `.card` | | | One topic per card, `h2` title, optional `.bar-head` actions |
| Row | `.prow`, `.row` | | hover | Icon, two lines of text, one action |
| Stat tile | `.stat` | icon colour `.g .b .y .p .r` | | Number first, label second |
| Quick actions | `.qas` / `.qa` | `.pri` | hover | Directly under the stats, at most four |
| Hero action | `.hbtn` (button), `.hdone` (status) | | hover | One action inside the welcome banner, e.g. Check in now / Checked in at 10:18 |
| Text clamp | `.clamp1`, `.clamp2` | | | Long titles: board cards clamp at 3 lines, project cards at 2; full text in `title` |
| Progress | `.bar > i` | | | Width is the percentage |
| Dialog | `.ov > .dlg` | | Escape closes | Built by `modal()`; focus moves to the first field |
| Toast | `#toast` | | | `role=status`, one short sentence |
| Kanban | `.kb > .kcol > .kcards > .kc` | `.kc.hi` (high priority), `.kc.done` | drag (`.drag`, `.kghost`, `.kph`), focus | Cards are `role=button`; Enter opens |
| Timeline | `.gwrap > .gt > .grw` | `.gb.done`, `.gb.late`, `.gb.proj` | | Sticky first column, today line `.gtoday` |
| Navigation | `.side > .nav` | mobile `.side.open` | `aria-current=page` | Under 900px it collapses behind the Menu button |

## Rules of thumb

1. One primary (`.pri`) action per screen; everything else is a plain `.btn`.
2. Use the semantic colour names in new code (`--success`, not `--y`). The short names stay as aliases.
3. No new hex values outside `:root`. Add a token instead.
4. Secondary text uses `.mute` (and `.note` for 13px notes), not inline `style="font-size"`.
5. Every interactive element needs a visible focus ring (`:focus-visible` already provides one) and a 36px or larger target.
