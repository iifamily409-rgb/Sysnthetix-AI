---
name: Synthetix AI Design System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#464554'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#0058be'
  on-tertiary: '#ffffff'
  tertiary-container: '#2170e4'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.025em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-performance, polished, and contemporary aesthetic designed for next-generation conversational AI platforms. The visual character blends refined clarity with subtle futuristic cues—evoking confidence, intellectual capability, and effortless speed.

### Tone & Personality
- **Intelligent & Focused:** Content and interactive dialogue remain paramount. Visual clutter is stripped away to highlight generative output, structured artifacts, and prompt orchestration.
- **Precise & Crafted:** Every boundary, elevation step, and type scale increment is calibrated for sustained daily productivity, echoing the finesse of industry-defining developer and productivity interfaces.
- **Fluid & Atmospheric:** While anchored in crisp functional neutrality, luminous indigo-to-electric-blue gradients and subtle glowing auras evoke computational depth and generative power.

### Aesthetic Direction: Modern Atmospheric SaaS
The design aesthetic pairs an ultra-clean base with targeted atmospheric embellishments. Frosted translucent surfaces provide contextual continuity during scrolling, whisper-thin borders anchor modular panels, and carefully controlled vibrant accents highlight active AI states and primary actions without visual fatigue.

## Colors

The palette employs an architectural balance between pure utility neutrals and dynamic chromatic accents.

### Palette Architecture
- **Primary Accent (`#6366F1` - Indigo):** The foundation for interactive affordances, active execution states, and focal brand moments.
- **Secondary Accent (`#8B5CF6` - Violet):** Deployed in tandem with the primary color to produce generative gradients, subtle backdrops for model reasoning badges, and dynamic aura highlights.
- **Tertiary Accent (`#3B82F6` - Electric Blue):** Reserved for technical indicators, tool executions, live data citations, and streaming status pulses.
- **Canvas & Neutral Surfaces:**
  - Base Background: `#F9FAFB`
  - Subtle Surface / Message Bubbles (User / System): `#F3F4F6`
  - Elevated Container: `#FFFFFF`
  - Structural Divider & Ghost Border: `#E5E7EB`
- **Text & Contrast Hierarchy:**
  - Primary Typographic Surface: `#111827` (maximum legibility)
  - Secondary / Supporting Copy: `#374151`
  - Subdued / Metadata: `#4B5563`
  - Placeholder / Disabled: `#9CA3AF`

### Gradient & Glow Directives
- **Generative Gradient:** Linear gradient from `#6366F1` through `#8B5CF6` to `#3B82F6` at an angle of 135deg. Applied to primary generative action triggers, streaming progress outlines, and AI identity avatars.
- **Atmospheric Glow:** Diffuse radial bursts (`rgba(99, 102, 241, 0.08)` to `rgba(59, 130, 246, 0.04)`) placed behind active prompt bars and assistant reasoning containers.

## Typography

Typography relies on a single, systematic grotesk engine: `Inter`. Neutral, precise, and engineered for high-density rendering on screens, it guarantees uniform clarity across long conversational outputs, dense code snippets, and fine status metadata.

### Typographic Rules
- **Proportional Tracking:** Heading tiers feature negative tracking (`-0.015em` to `-0.025em`) to ensure tight visual cohesion in prompt titles and modal dialogues.
- **Reading Comfort:** Assistant responses use `body-lg` (16px / 26px) or `body-md` (14px / 22px) with comfortable line heights to reduce visual fatigue during comprehensive conversational reading.
- **Technical Readouts:** Badges, token counters, and status tags apply `label-xs` in medium or semibold weights to create instant visual demarcation from streamable prose.

## Layout & Spacing

The structural layout utilizes a persistent conversational canvas designed around strict vertical rhythm and horizontal economy.

### Grid & Composition Architecture
- **Sidebar (Navigation / Thread History):** Fixed width of 260px–300px on desktop with collapsible behavior on tablet and mobile viewports.
- **Central Conversation Column:** Constrained to a max width of 768px (`48rem`) to preserve optimal line lengths for reading and typing, centered within the remaining viewport width.
- **Dynamic Artifact Panel:** When active (code execution, markdown preview, canvas editing), the central column flexibly splits into a dual-pane workboard (50% chat / 50% artifact) separated by a 1px boundary.

### Breakpoints & Adaptivity
- **Desktop (1024px+):** Full multi-pane arrangement. Sidebar persistent; central stream anchored with `margin` (2rem); floating bottom prompt docked with sticky offset.
- **Tablet (768px – 1023px):** Collapsible off-canvas navigation drawer; main stream gutters scale to `gutter-sm` (1rem).
- **Mobile (<768px):** Single-column stack. Prompt box permanently pinned to bottom safe area; sidebar converts to a full-screen drawer overlay; margins tighten to `margin-sm` (1rem).

## Elevation & Depth

Visual hierarchy combines low-contrast borders with translucent planes and ambient light, eschewing heavy drop shadows for modern visual agility.

### Elevation Architecture
1. **Level 0 (Canvas Surface):** Clean, non-elevated `#F9FAFB` surface. Provides a quiet, non-distracting background for long working sessions.
2. **Level 1 (Card & Sub-Panel Surface):** Solid white `#FFFFFF` paired with an ultra-subtle border (`1px solid #E5E7EB`). Used for prompt recommendation chips, model parameter menus, and user speech bubbles.
3. **Level 2 (Floating Overlays & Prompt Bar):** Elevated input modules and popovers use `rgba(255, 255, 255, 0.85)` with a backdrop blur of `16px`, anchored by a soft ambient shadow: `0 8px 30px rgba(17, 24, 39, 0.04)`.
4. **Level 3 (Modal & Focus Drawers):** High-priority panels feature crisp borders alongside a twin ambient falloff: `0 20px 40px rgba(17, 24, 39, 0.08)`.

### Glassmorphism & Atmospheric Accents
Translucent glass surfaces are strictly functional: they allow underlying message histories to softly bleed through floating headers and bottom prompt inputs. Active generative runs introduce a diffuse outer aura (`box-shadow: 0 0 20px rgba(99, 102, 241, 0.15)`) around the floating composer.

## Shapes

The design uses roundedness level `2`, creating a comfortable, tactile shape language that feels approachable yet disciplined.

### Curvature System
- **Base Rounding (`rounded-md` / 0.5rem):** Standard interactive elements such as code snippets, input buttons, menu items, and pill selectors.
- **Container Rounding (`rounded-lg` / 1rem):** Used for message bubbles, prompt input containers, settings cards, and floating dialogs.
- **Surface Rounding (`rounded-xl` / 1.5rem):** Reserved for wide modal shells, active workspace panels, and hero onboarding cards.
- **Full Pill (`rounded-full`):** Strictly used for small metadata badges, conversational action chips ("Continue", "Explain code"), user avatars, and status pills.

## Components

### Buttons
- **Primary (Generative Action):** Linear gradient background (`#6366F1` to `#8B5CF6`), text `#FFFFFF`, font weight 500, padding `0.625rem 1.25rem`, border radius 0.5rem. Hover state triggers a subtle brightness lift and an ambient indigo glow.
- **Secondary / Ghost:** Transparent or `#FFFFFF` background with `1px solid #E5E7EB`, text `#374151`. Hover produces `#F3F4F6` background with text `#111827`.
- **Icon / Utility Buttons:** 36x36px square with 0.5rem radius, centered SVG icon, subdued neutral fill (`#4B5563`), transitioning to `#111827` on hover.

### Prompt Input Bar
- Floating container docked at the bottom of the conversation stream with backdrop blur (`rgba(255, 255, 255, 0.9)`), bordered with `#E5E7EB`, and rounded with `1rem` radius.
- Includes expandable multiline auto-resizing textarea, nested file attachment pills, dynamic model picker badge, and a circular gradient submit trigger.

### Message Bubbles
- **User Prompt:** Compact container aligned to the right or visually anchored with a soft background (`#F3F4F6`), subtle border (`#E5E7EB`), text `#111827`, rounded with `1rem` radius (bottom-right edge slightly tapered).
- **Assistant Response:** Clean, unbordered left-aligned surface directly integrated on `#F9FAFB` canvas. Responses begin with an AI model indicator badge (gradient spark icon + model designation). Code blocks nested within assistant responses feature a crisp `#111827` or `#FFFFFF` wrapper with copy actions docked in the upper right.

### Chips & Suggestion Pills
- Pill-shaped (`rounded-full`), padding `0.375rem 0.875rem`, border `1px solid #E5E7EB`, background `#FFFFFF`.
- Typography is `label-md` in `#374151`. Hover transitions border to `#6366F1` and text to `#6366F1`.

### Form Controls (Inputs, Checkboxes, Toggles)
- **Input Fields:** Flat white surface `#FFFFFF`, `1px solid #E5E7EB`, focus ring `2px solid rgba(99, 102, 241, 0.35)` with border color `#6366F1`.
- **Toggle Switches:** Track dimensions 40x24px, rounded-full. Inactive state `#E5E7EB`, active state filled with `#6366F1`. Pure white handle sliding with spring transition.
- **Checkboxes:** 18x18px box, radius 0.25rem. Inactive border `#D1D5DB`, active fill `#6366F1` with white checkmark.

### Cards & Artifact Panels
- Self-contained working artifacts (such as generated charts, code sandboxes, or document summaries) sit in white cards with `1px solid #E5E7EB`, rounded with `1rem`, elevated by subtle ambient shadow. Header contains tabbed breadcrumbs, runtime metrics, and export actions.