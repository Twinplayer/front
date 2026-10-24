---
name: CinemaSync
colors:
  surface: '#10131e'
  surface-dim: '#10131e'
  surface-bright: '#363945'
  surface-container-lowest: '#0b0e18'
  surface-container-low: '#181b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#272935'
  surface-container-highest: '#313440'
  on-surface: '#e0e1f1'
  on-surface-variant: '#e5bdc0'
  inverse-surface: '#e0e1f1'
  inverse-on-surface: '#2d303c'
  outline: '#ac888b'
  outline-variant: '#5c3f42'
  surface-tint: '#ffb2ba'
  primary: '#ffb2ba'
  on-primary: '#670020'
  primary-container: '#ff4f73'
  on-primary-container: '#5a001b'
  inverse-primary: '#bd0042'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9dc'
  primary-fixed-dim: '#ffb2ba'
  on-primary-fixed: '#400011'
  on-primary-fixed-variant: '#910030'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#10131e'
  on-background: '#e0e1f1'
  surface-variant: '#313440'
typography:
  display-hero:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-timestamp:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies an intimate, cinematic digital living room. It connects long-distance couples and co-viewers through synchronized streaming, merging real-time emotional resonance with tactile theater luxury. The interface evokes late-night intimacy, warmth, and seamless connectivity. 

The aesthetic blends **Dark Cinematic Glassmorphism** with **Ambient Romantic Neon**. Deep, warm obsidian and midnight bases reduce visual fatigue during low-light sessions, while vibrant electric accents evoke passion, warmth, and shared presence. Translucent frosted glass planes float above deep cavernous dark backgrounds, anchored by soft inner glows, fine borders, and responsive micro-interactions that signal synchronization (e.g., heartbeat pings, shared scrub heads, synchronized reactions).

## Colors

The color palette captures an atmospheric movie house bathed in ambient projector glow:

- **Primary (`#FF3366` - Crimson Rose):** The core romantic emotional anchor. Used for primary calls-to-action, active synchrony indicators, partner interaction highlights, and playhead handles.
- **Secondary (`#8B5CF6` - Electric Violet):** The secondary ambient dimension. Used for synchronized status beacons, chat threads, secondary buttons, and active tabs.
- **Tertiary (`#F59E0B` - Soft Amber):** Warm cinematic accent for badges, ratings, cozy notification pings, and milestone celebrations.
- **Neutral Palette (`#0D0E15`, `#141722`, `#1B1E2E`):** 
  - Canvas Root: `#0D0E15` (Deep warm obsidian).
  - Surface Glass Base: `#141722` at varying opacities (`0.6` to `0.85`).
  - Elevated Container / Border Glow: `#1B1E2E` to `#262A3F`.
  - Content Text: `#F8FAFC` for high-emphasis, `#94A3B8` for secondary captions, and `#64748B` for placeholders.

## Typography

The typography system pairs geometric, expressive title styling with high-legibility body copy designed for dark screens and rapid chat scanning.

- **Headlines (`Outfit`):** Contemporary, rounded geometric curves that communicate sleek tech and friendly warmth. 
- **Body & Controls (`Plus Jakarta Sans`):** Balanced, open letterforms that remain crisp across diverse screen densities and match naturally with bi-directional and Persian script pairings (such as Vazirmatn or Dana for Persian/RTL context).
- **Timecode & Data (`JetBrains Mono`):** Fixed-width clarity for synchronous playback timecodes, live latency, and audio bitrates.
- **RTL & Persian Alignment:** For Persian/RTL contexts, all text alignments flip to right-aligned with adjusted line heights (+10% on Arabic script line-height to maintain comfortable breathing room for extended ascenders and descenders).

## Layout & Spacing

The layout is built upon a fluid 12-column grid system optimized for video consumption and synchronized social sidebars:

- **Desktop Layout:** 
  - Primary media viewport spans 8 to 9 columns.
  - Collapsible synchronized theater sidebar (live chat, reaction streams, audio/video status) spans the remaining 3 to 4 columns.
  - Margins stay at `2.5rem` with `1.5rem` gutters.
- **Tablet Layout:** 
  - Dynamic split layout where the video switches to 16:9 top container, with collaborative modules seated directly beneath in 2 customizable columns.
- **Mobile Layout:** 
  - Video pinned to the top edge (0 margin) in landscape or compact 16:9 top card. The interaction panel shifts to an overlay bottom-sheet or horizontal swipe tab pane.
- **RTL Behavior:** Grid columns reverse order (`col-start-1` anchors right). Lateral margins invert automatically for RTL directional flows.

## Elevation & Depth

Visual hierarchy is crafted through translucent depth tiers and layered backdrops:

- **Backdrop Blur Layers:** Glass components use `backdrop-filter: blur(16px)` with surface fills of `rgba(20, 23, 34, 0.65)` to let underlying cinematic colors glow through gently.
- **Ghost Borders:** Cards and popovers utilize ultra-fine 1px borders colored with `rgba(255, 255, 255, 0.08)` to define perimeter lines without heavy contrast.
- **Romantic Ambient Glow:**
  - Standard floating panels: `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.45)`.
  - Focused interactive elements: Subtle neon back-glow using `box-shadow: 0 0 24px -4px rgba(255, 51, 102, 0.35)`.
  - Active synchronized state: A delicate dual-perimeter halo (`rgba(139, 92, 246, 0.25)` and `rgba(255, 51, 102, 0.25)`).
- **Z-Index Tiers:**
  - Base: Canvas Video / Background (`z-0`).
  - Mid: Content cards, lists, and chat stream (`z-10`).
  - Elevated: Media overlay controls and floating reactions (`z-20`).
  - Overlays: Dialogs, partner video overlays, and notifications (`z-40`).

## Shapes

The interface embraces organic curvature (`0.5rem` base, `1rem` on container cards, and `1.5rem` on modal sheets). Video containers and glass cards feature smooth, pillowed borders that make dark screens feel cozy rather than rigid. Interactive micro-elements (pill badges, playback tags, user avatars, sync heartbeats) utilize full pill contours (`rounded-full`) to emphasize approachability and tactile comfort.

## Components

- **Buttons:**
  - *Primary (Love Sync):* Solid `#FF3366` with a gentle radial hover shine, white text, and a soft glow shadow on hover (`rgba(255, 51, 102, 0.4)`).
  - *Secondary (Vibe):* Semi-transparent `#8B5CF6` with 20% opacity background, solid `#8B5CF6` text, and a 1px border.
  - *Floating Control Button:* Glassmorphic circular icon buttons with `backdrop-filter: blur(12px)`, `rgba(255,255,255,0.06)` background, scaling to `1.05` on active hover.

- **Chips & Badges:**
  - Compact rounded pills for playback resolution (`4K HDR`), audio channels, and latency status (`Synced: 4ms`).
  - Status indicators feature an animated glowing beacon dot in the lead position.

- **Video Player Controls:**
  - Floating translucent bottom dock over the video layer with auto-hide logic.
  - Dual scrubbing bar: Displays user's scrub cursor alongside partner's synchronized scrub preview avatar to prevent accidental desynchronization.
  - One-tap "Sync With Partner" floating pill button that pulses when timeline drift exceeds 250ms.

- **Interactive Chat & Reaction Stream:**
  - Bubbles with rounded corners (`1rem`), with sender messages highlighted in a subtle rose glass gradient and partner messages in soft violet glass.
  - Quick-fire romantic emoji reaction bar (hearts, popcorn, teary-eyed, gasp) floating directly above the input, triggering buoyant canvas floating micro-animations across the video screen.

- **Input Fields:**
  - Glass dark surfaces (`rgba(27, 30, 46, 0.6)`) with 1px border `rgba(255, 255, 255, 0.1)`. Focus states illuminate the border with `#FF3366` and a soft 4px perimeter bloom.
  - Support for bi-directional text direction automatically detected based on the input script.

- **Cards:**
  - High-depth movie cards featuring dynamic backdrop poster art with dark vertical gradients fading into `#141722`.
  - Hover state elevates the card by `-4px` and activates a soft ambient edge highlight.