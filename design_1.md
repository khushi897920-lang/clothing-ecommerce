---
version: alpha
name: YUGEN-design-system
description: A premium quiet-luxury fashion e-commerce design system for YUGEN. The visual language combines warm ivory editorial surfaces, cinematic campaign photography, thin geometric display typography, refined lightweight sans-serif UI typography, asymmetric fashion-editorial layouts, espresso brown, soft black, butter yellow, matcha green, natural textures, botanical shadows, and extremely restrained interaction design. The website should feel like a luxury fashion campaign and digital lookbook rather than a conventional e-commerce template.

colors:
  canvas: "#F2ECE3"
  canvas-soft: "#F6F1E9"
  surface-ivory: "#ECE4D8"
  surface-cream: "#E6DBCC"
  surface-sand: "#D6C5B0"
  surface-stone: "#B7A58F"

  ink: "#25211D"
  ink-strong: "#171512"
  body: "#494139"
  muted: "#756A5E"
  muted-soft: "#9B8F82"

  hairline: "rgba(70, 54, 39, 0.16)"
  hairline-soft: "rgba(70, 54, 39, 0.09)"
  hairline-on-media: "rgba(247, 243, 236, 0.35)"

  on-media: "#F7F3EC"
  on-dark: "#F7F3EC"

  espresso: "#4B3325"
  cocoa: "#6B4A37"
  soft-black: "#191816"
  charcoal: "#34312D"

  butter-yellow: "#E7D28C"
  pale-butter: "#F1E3AF"

  matcha-green: "#7B8660"
  sage-matcha: "#A3AA88"

  warm-ivory: "#EEE6D9"
  stone-beige: "#B9A58D"

  success: "#657257"
  warning: "#B48B4A"
  error: "#9B4B43"

typography:

  hero-display:
    fontFamily: "Poiret One, Gruppo, Helvetica Neue, sans-serif"
    fontSize: "clamp(56px, 5.2vw, 92px)"
    fontWeight: 300
    lineHeight: 0.95
    letterSpacing: "0.01em"
    textTransform: uppercase

  wordmark:
    fontFamily: "Poiret One, Gruppo, Helvetica Neue, sans-serif"
    fontSize: "clamp(34px, 3vw, 50px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.035em"

  section-display:
    fontFamily: "Inter, Manrope, Helvetica Neue, sans-serif"
    fontSize: "clamp(30px, 2.4vw, 42px)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-0.025em"

  editorial-heading:
    fontFamily: "Inter, Manrope, Helvetica Neue, sans-serif"
    fontSize: "clamp(28px, 2.2vw, 38px)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"

  body-lg:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.55
    letterSpacing: 0

  body-md:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0

  body-sm:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

  eyebrow:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.045em"
    textTransform: uppercase

  nav-link:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.01em"

  cta:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.065em"
    textTransform: uppercase

  product-name:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.035em"
    textTransform: uppercase

  price:
    fontFamily: "Inter, Manrope, sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 3px
  sm: 5px
  md: 8px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
  section-sm: 72px
  section: 96px
  section-lg: 120px
  desktop-gutter: "clamp(28px, 3.5vw, 64px)"
  mobile-gutter: 20px

layout:
  desktop-grid: 12
  content-max-width: 1440px
  women-split: "32% / 68%"
  men-split: "68% / 32%"
  lookbook-split: "45% / 55%"
  product-columns-desktop: 4
  product-columns-tablet: 2
  product-columns-mobile: 2
  value-columns-desktop: 4

motion:
  standard-duration: 300ms
  slow-duration: 700ms
  reveal-duration: 800ms
  hero-slide-duration: 1000ms
  ease-standard: "cubic-bezier(.22, 1, .36, 1)"
  ease-slide: "cubic-bezier(.76, 0, .24, 1)"

components:

  top-nav:
    position: absolute
    height: "78-88px"
    backgroundColor: transparent
    textColor: "{colors.on-media}"
    typography: "{typography.nav-link}"
    paddingInline: "{spacing.desktop-gutter}"

  hero:
    heightDesktop: "clamp(620px, 70vh, 860px)"
    heightMobile: "85svh"
    textColor: "{colors.on-media}"

  hero-play-control:
    width: 52px
    height: 52px
    border: "1px solid rgba(247,243,236,.65)"
    rounded: "{rounded.full}"
    backgroundColor: transparent

  collection-women:
    columns: "32% 68%"
    backgroundColor: "{colors.surface-ivory}"
    textColor: "{colors.ink}"

  collection-men:
    columns: "68% 32%"
    backgroundColor: "{colors.surface-ivory}"
    textColor: "{colors.ink}"

  values-strip:
    columns: 4
    backgroundColor: "{colors.canvas}"
    borderTop: "{colors.hairline}"
    borderBottom: "{colors.hairline}"

  product-grid:
    columnsDesktop: 4
    columnsTablet: 2
    columnsMobile: 2
    backgroundColor: "{colors.canvas}"

  product-image:
    aspectRatio: "4 / 5"
    rounded: "{rounded.sm}"

  lookbook:
    columns: "45% 55%"
    backgroundColor: "{colors.surface-cream}"

  newsletter:
    backgroundColor: "{colors.canvas-soft}"
    borderTop: "{colors.hairline}"
    borderBottom: "{colors.hairline}"

  footer:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
---

# Overview

YUGEN is a premium fashion e-commerce identity built around **quiet luxury, editorial minimalism, cinematic fashion photography, natural materials, restrained typography, and warm architectural composition**.

The interface should not resemble a conventional online shopping template.

It should feel like a digital extension of a premium fashion campaign: somewhere between an editorial lookbook, seasonal collection film, luxury catalogue, and minimalist fashion house website.

The visual hierarchy is driven primarily by:

1. photography,
2. typography,
3. composition,
4. whitespace,
5. subtle lines,
6. controlled fashion colors.

UI decoration should remain extremely restrained.

The interface itself remains predominantly warm ivory, cream, sand, stone and dark brown-black.

The stronger colors appear primarily in the garments:

- espresso brown,
- soft black,
- butter yellow,
- matcha green.

This prevents the website from becoming monochromatic beige while maintaining the quiet-luxury character.

---

# Brand Personality

YUGEN should communicate:

- timelessness,
- simplicity,
- natural elegance,
- confidence,
- softness,
- craftsmanship,
- calm,
- understated luxury.

The visual experience should never feel loud, playful, futuristic, technological, or overly commercial.

The brand statement is:

**ESSENCE OF SIMPLICITY**

Every visual decision should reinforce this principle.

---

# Color System

## Foundation Surfaces

### Canvas

`{colors.canvas}` — `#F2ECE3`

Primary website background.

This is not pure white.

The slight warm tint is essential because it creates the soft fashion-editorial atmosphere visible throughout the landing page.

Use for:

- product sections,
- value strip,
- footer transitions,
- general page floor.

---

### Canvas Soft

`{colors.canvas-soft}` — `#F6F1E9`

The lightest warm neutral.

Use for:

- newsletter,
- footer,
- lighter content areas,
- subtle surface differentiation.

---

### Surface Ivory

`{colors.surface-ivory}` — `#ECE4D8`

Primary editorial panel color.

Use for:

- Women Collection text panel,
- Men Collection text panel,
- selected informational blocks.

---

### Surface Cream

`{colors.surface-cream}` — `#E6DBCC`

A slightly deeper warm neutral.

Use sparingly for:

- Lookbook areas,
- secondary editorial bands,
- subtle visual separation.

---

### Surface Sand

`{colors.surface-sand}` — `#D6C5B0`

Used primarily as a supporting environmental neutral.

Do not make this the dominant UI surface.

---

# Text Colors

### Ink

`{colors.ink}` — `#25211D`

Primary typography color.

Use for:

- section headings,
- product names,
- major navigation on light backgrounds,
- footer headings.

It should read as warm near-black rather than pure black.

---

### Ink Strong

`{colors.ink-strong}` — `#171512`

Use only where stronger contrast is necessary.

Avoid using pure `#000000`.

---

### Body

`{colors.body}` — `#494139`

Default body text.

---

### Muted

`{colors.muted}` — `#756A5E`

Use for:

- supporting descriptions,
- secondary information,
- footer details,
- fine text.

---

### On Media

`{colors.on-media}` — `#F7F3EC`

Warm white used over hero photography/video.

Never use harsh pure white unless required for accessibility.

---

# Apparel Color Palette

The product assortment should intentionally introduce controlled fashion color.

## Espresso Brown

`{colors.espresso}` — `#4B3325`

Primary rich brown.

Ideal for:

- linen shirts,
- dresses,
- trousers,
- outerwear,
- editorial lookbook garments.

---

## Cocoa Brown

`{colors.cocoa}` — `#6B4A37`

Softer brown variation.

Use for:

- knitwear,
- lightweight dresses,
- casual shirts.

---

## Soft Black

`{colors.soft-black}` — `#191816`

Primary dark fashion tone.

Use for:

- jackets,
- shirts,
- trousers,
- evening pieces.

Use soft black instead of visually harsh absolute black.

---

## Butter Yellow

`{colors.butter-yellow}` — `#E7D28C`

Premium seasonal accent.

Ideal for:

- tailored blazer,
- dress,
- shirt,
- lightweight summer pieces.

It should be muted and creamy rather than saturated yellow.

---

## Matcha Green

`{colors.matcha-green}` — `#7B8660`

Muted botanical green.

Ideal for:

- premium cotton tee,
- knitwear,
- casual shirt,
- dress,
- light outerwear.

It should feel organic rather than sporty.

---

# Color Distribution

The landing page should roughly maintain:

- 65–75% neutral UI surfaces,
- 10–15% espresso / cocoa / black fashion,
- 5–10% butter yellow,
- 5–10% matcha / sage,
- remaining colors from photography.

The apparel provides controlled variation.

The interface should NOT become brown, green, yellow or black.

---

# Typography

Typography is one of the most important YUGEN brand elements.

There are two distinct typography roles.

---

## Hero Display Typeface

Used for:

**ESSENCE OF  
SIMPLICITY**

and the YUGEN wordmark direction.

The visual character must be:

- thin,
- monoline,
- rounded,
- geometric,
- airy,
- modern,
- understated.

Recommended direction:

`Poiret One`

Fallback:

`Gruppo`

Then:

`Helvetica Neue`

The exact reference typography should be matched visually rather than substituting a generic bold font.

---

## Hero Typography

```css
font-family: "Poiret One", "Gruppo", "Helvetica Neue", sans-serif;

font-size: clamp(56px, 5.2vw, 92px);

font-weight: 300;

line-height: 0.95;

letter-spacing: 0.01em;

text-transform: uppercase;
```

The two lines should sit relatively close together.

Do not increase line-height dramatically.

---

# YUGEN Wordmark

The wordmark should visually relate to the hero display typography.

```css
font-family: "Poiret One", "Gruppo", sans-serif;

font-size: clamp(34px, 3vw, 50px);

font-weight: 400;

letter-spacing: 0.035em;
```

The logo should feel:

* thin,
* modern,
* geometric,
* elegant.

Never replace it with a bold generic sans-serif wordmark.

---

# UI Typography

Use:

`Inter`

or

`Manrope`

for navigation, body text, collection headings, product details and footer.

Weights:

* 300 Light
* 400 Regular
* 500 Medium

Avoid:

* 600 unless necessary,
* 700,
* 800,
* 900.

YUGEN typography should never appear heavy.

---

# Section Heading

Examples:

**Grace in
Every Thread**

**Effortless Style,
Every Day**

```css
font-size: clamp(30px, 2.4vw, 42px);

font-weight: 300;

line-height: 1.08;

letter-spacing: -0.025em;
```

---

# Editorial Heading

Example:

**Quiet Moments,
Timeless Style**

```css
font-size: clamp(28px, 2.2vw, 38px);

font-weight: 300;

line-height: 1.1;

letter-spacing: -0.02em;
```

---

# Eyebrow Labels

Examples:

NEW COLLECTION

WOMEN COLLECTION

MEN COLLECTION

LOOKBOOK

STAY INSPIRED

NEW IN

```css
font-size: 11px;

font-weight: 500;

letter-spacing: 0.045em;

text-transform: uppercase;
```

---

# CTA Typography

Examples:

EXPLORE COLLECTION →

EXPLORE WOMEN →

EXPLORE MEN →

VIEW ALL →

EXPLORE LOOKBOOK →

SUBSCRIBE →

```css
font-size: 11px;

font-weight: 500;

letter-spacing: 0.065em;

text-transform: uppercase;
```

---

# Layout Philosophy

YUGEN uses **editorial full-width composition**.

Do NOT put every section inside a centered `max-width: 1200px` container.

Campaign imagery should reach section boundaries.

The page should feel architectural.

Use a conceptual **12-column grid**.

---

# Desktop Alignment

Main horizontal gutter:

```css
padding-inline: clamp(28px, 3.5vw, 64px);
```

Important elements sharing this alignment:

* logo,
* hero content,
* New In heading,
* product grid,
* newsletter,
* footer.

---

# Hero Section

The hero is the strongest visual area of the landing page.

It uses the supplied Women and Men campaign videos.

Desktop height:

```css
height: clamp(620px, 70vh, 860px);
```

Mobile:

```css
height: 85svh;
min-height: 650px;
```

---

# Hero Video

```css
width: 100%;
height: 100%;
object-fit: cover;
```

HTML behavior:

```html
autoplay
muted
playsinline
preload="metadata"
```

Pause the inactive campaign video.

Do not load unnecessary duplicates.

---

# Hero Composition

The text sits in approximately the left 35–40% of the screen.

Recommended position:

```css
left: 3.5vw;
top: 28%;
```

Hero content order:

NEW COLLECTION

ESSENCE OF
SIMPLICITY

Timeless pieces crafted for everyday elegance.
Natural fabrics. Minimal designs. Maximum comfort.

EXPLORE COLLECTION →

01 ───── 02

---

# Hero Navigation

Navigation sits absolutely over the hero.

Height:

`78–88px`

Background:

`transparent`

Left:

YUGEN

Center:

New In
Women
Men
Collections
Lookbook
About

Right:

Search
Account
Cart (0)

Use thin outline icons.

Recommended icon size:

`14–17px`

Recommended stroke:

`1.25–1.5`

No navigation pills.

No floating navigation container.

No blurred glass background.

---

# Hero Campaign Control

Lower-right composition:

○ PLAY CAMPAIGN FILM →

Circle:

`48–56px`

Border:

```css
1px solid rgba(247,243,236,.65)
```

Background:

transparent.

Use a thin Play icon.

---

# Hero Slider

Women and Men videos transition horizontally.

Animation:

```text
current slide → left
next slide ← from right
```

Duration:

`1 second`

Easing:

```css
cubic-bezier(.76,0,.24,1)
```

Do not use:

* cube animation,
* bounce,
* elastic transition,
* glitch,
* black transition frame,
* extreme zoom.

The animation should feel like a premium fashion campaign.

---

# Women Collection

Desktop composition:

```text
32% TEXT | 68% IMAGE
```

Target height:

`230–280px`

Text:

WOMEN COLLECTION

Grace in
Every Thread

—

EXPLORE WOMEN →

The text panel uses:

`{colors.surface-ivory}`

Photography should use a warm desert/sand composition.

The garment should introduce richer color such as:

* espresso brown,
* cocoa,
* black,
* butter,
* matcha.

---

# Men Collection

Desktop composition:

```text
68% IMAGE | 32% TEXT
```

Content:

MEN COLLECTION

Effortless Style,
Every Day

—

EXPLORE MEN →

Photography direction:

* soft-black or dark brown shirt,
* ivory trousers,
* pale sky,
* muted mountain environment.

Women and Men sections should touch directly.

Do not create card gaps between them.

---

# Values Strip

Immediately below the collections.

Four equal columns.

---

## Sustainable

SUSTAINABLE

Eco-friendly fabrics
Better for the planet.

---

## Timeless Design

TIMELESS DESIGN

Minimal. Elegant.
Made to last.

---

## Crafted With Care

CRAFTED WITH CARE

Thoughtful details in
every piece.

---

## Worldwide Shipping

WORLDWIDE SHIPPING

Delivering elegance
to your door.

---

# Values Styling

Approximate height:

`90–110px`

Use:

* thin brown line icons,
* 28–34px icons,
* vertical separators,
* warm background,
* fine top/bottom border.

No individual cards.

No shadows.

No rounded boxes.

---

# New In

Header:

```text
NEW IN ───                                  VIEW ALL →
```

Desktop:

```css
grid-template-columns: repeat(4, minmax(0,1fr));
gap: clamp(14px,1.5vw,24px);
```

---

# Product Photography

Ratio:

```css
aspect-ratio: 4 / 5;
```

Radius:

`4–6px`

Shadow:

none.

Background:

warm neutral studio.

Photography should feel like the same campaign universe.

---

# Product Color Story

The first row should intentionally demonstrate YUGEN's broader palette.

### Product 01

RELAXED LINEN SHIRT

Primary garment:

**Espresso Brown**

---

### Product 02

LIGHT COTTON JACKET

Primary garment:

**Soft Black**

---

### Product 03

SOFT TAILORED BLAZER

Primary garment:

**Butter Yellow**

---

### Product 04

PREMIUM COTTON TEE

Primary garment:

**Matcha Green**

---

# Product Swatches

Diameter:

`9–11px`

Gap:

`6px`

Available palette:

```css
--espresso: #4B3325;
--black: #191816;
--butter: #E7D28C;
--matcha: #7B8660;
--ivory: #EEE6D9;
--stone: #B9A58D;
```

Selected state:

* thin outer ring,
* approximately 2px separation.

Do not use large swatches.

---

# Lookbook

Desktop:

```text
45% TEXT | 55% IMAGE
```

Content:

LOOKBOOK

Quiet Moments,
Timeless Style

Discover pieces that move with you,
through every season of life.

EXPLORE LOOKBOOK →

Visual direction:

* warm plaster wall,
* botanical shadow,
* golden sunlight,
* espresso/dark garment,
* seated editorial model.

The image should feel like an editorial campaign photograph rather than a product card.

---

# Newsletter

Eyebrow:

STAY INSPIRED

Heading:

Join the YUGEN Circle

Copy:

Receive early access to new collections,
exclusive offers, and more.

Desktop structure:

```text
BOTANICAL ART | COPY | EMAIL + SUBSCRIBE
```

---

# Newsletter Input

Do NOT use a rounded input box.

Use:

```css
background: transparent;
border: 0;
border-bottom: 1px solid var(--yugen-line);
```

Placeholder:

Enter your email

CTA:

SUBSCRIBE →

Fine privacy copy sits underneath.

---

# Footer

The footer remains warm and light.

Never introduce a black/dark footer.

Columns:

### Brand

YUGEN

Essence of simplicity.
Made to be lived in.

Social icons.

---

### Shop

New In
Women
Men
Collections

---

### About

Our Story
Sustainability
Lookbook
Journal

---

### Customer Care

Contact Us
Shipping
Returns
FAQ

---

### Legal

Terms & Conditions
Privacy Policy
Cookie Policy

---

# Footer Bottom Row

Left:

© 2024 YUGEN. All rights reserved.

Center/right:

Worldwide Shipping

Designed with purpose.

Use a fine top divider.

---

# CTA Interaction

Text CTAs remain transparent.

Example:

```text
EXPLORE WOMEN →
```

Hover:

```css
.arrow {
  transition: transform 300ms ease;
}

.link:hover .arrow {
  transform: translateX(4px);
}
```

Optional subtle underline expansion is acceptable.

Do not convert these into filled buttons.

---

# Motion System

YUGEN animation should feel:

* slow,
* elegant,
* cinematic,
* controlled,
* almost invisible.

---

## Section Reveal

```js
initial: {
  opacity: 0,
  y: 16
}

animate: {
  opacity: 1,
  y: 0
}

transition: {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1]
}
```

---

## Image Hover

```css
transform: scale(1.015);

transition:
  transform 700ms cubic-bezier(.22,1,.36,1);
```

Keep image overflow hidden.

---

# Borders

Standard:

```css
border: 1px solid rgba(70,54,39,.16);
```

Soft:

```css
border-color: rgba(70,54,39,.09);
```

Hero:

```css
border-color: rgba(247,243,236,.35);
```

---

# Shadows

Default:

```css
box-shadow: none;
```

Only if necessary:

```css
box-shadow:
0 8px 30px rgba(45,34,24,.05);
```

Heavy shadows are a system violation.

---

# Border Radius

Use extremely restrained radius.

```text
0px — campaign sections
3px — tiny UI
5px — product photography
8px — functional UI maximum
50% — circular controls
```

Avoid:

* 16px cards,
* 24px cards,
* 32px cards,
* giant pills.

---

# Responsive System

## Desktop

`>= 1200px`

* full navigation,
* full cinematic hero,
* Women 32/68,
* Men 68/32,
* four value columns,
* four product columns,
* horizontal newsletter,
* multi-column footer.

---

## Tablet

`768px–1199px`

* reduce hero typography,
* tighten navigation,
* values may become 2×2,
* product grid becomes two columns,
* collection split may remain where space permits.

---

## Mobile

`<768px`

Header:

```text
YUGEN                         MENU
```

Hero:

`80–90svh`

Campaign:

horizontal swipe.

Collections:

stack image/text vertically.

Products:

2 columns.

Values:

2 columns or stacked.

Newsletter:

stacked.

Footer:

compact responsive groups.

Do not simply shrink the desktop design.

Preserve the editorial hierarchy.

---

# Media Cropping

Hero:

```css
object-fit: cover;
```

Suggested initial positioning:

```css
.women-video {
  object-position: 60% center;
}

.men-video {
  object-position: 55% center;
}
```

Tune according to the actual supplied footage.

Never accidentally crop:

* faces,
* garment silhouette,
* important hand positions,
* key negative space.

---

# Accessibility

* Use semantic HTML.
* All interactive elements keyboard accessible.
* Provide meaningful image alt text.
* Decorative botanicals use `alt=""`.
* Respect `prefers-reduced-motion`.
* Video must not contain essential information unavailable elsewhere.
* Maintain readable text contrast.
* Keep adequate touch targets even when controls appear visually minimal.

---

# Performance

Hero video:

```html
muted
playsinline
preload="metadata"
```

Only the active campaign should play.

Below-fold photography should lazy load.

Reserve image dimensions to prevent layout shift.

Prioritize only above-fold campaign assets.

Avoid duplicate media requests.

---

# Iconography

Use simple outline icons.

Recommended visual language:

* Lucide-style,
* 1.25–1.5px stroke,
* no filled icons,
* no colored icon circles.

Typical icons:

* Search
* User
* Shopping Bag
* Play
* Arrow Right
* Leaf
* Craft / Textile
* Hand Heart
* Package
* Globe
* Social icons

Icons should never overpower typography.

---

# Photography Direction

Photography is responsible for most of the visual richness.

All campaign imagery should share:

* warm golden sunlight,
* natural shadows,
* plaster/stone environments,
* restrained scenery,
* premium fabric texture,
* subtle grain,
* natural skin tones,
* muted skies,
* botanical shadows,
* warm neutral grading.

Avoid:

* neon studios,
* cool blue lighting,
* oversaturated fashion photography,
* busy urban backgrounds,
* artificial gradients,
* glossy commercial catalog lighting.

---

# Product Photography Direction

The product grid should maintain a consistent studio language.

Background:

warm ivory / beige.

Model framing:

full or three-quarter fashion portrait.

Lighting:

soft warm directional studio lighting.

The background stays neutral so apparel color becomes the visual differentiator.

---

# Apparel Balance

Do not generate four beige products in a row.

Preferred product rhythm:

```text
BROWN → BLACK → BUTTER → MATCHA
```

Then introduce:

```text
IVORY → ESPRESSO → SAGE → CHARCOAL
```

Neutral pieces are still allowed, but they should not dominate every row.

---

# Whitespace Philosophy

Whitespace is an active design element.

Do not fill empty areas simply because space exists.

Campaign compositions should contain negative space around:

* models,
* headings,
* CTA links,
* botanical shadows.

This is essential to YUGEN's premium character.

---

# Do's

* Use warm ivory rather than pure white.
* Keep YUGEN typography thin.
* Keep photography cinematic.
* Maintain editorial asymmetry.
* Use espresso, black, butter and matcha garments.
* Keep UI surfaces neutral.
* Use fine hairlines.
* Use subtle botanical details.
* Keep CTAs textual.
* Keep icons thin.
* Keep animations slow.
* Keep footer light.
* Preserve full-width imagery.
* Preserve generous negative space.

---

# Don'ts

* Don't create beige-only product collections.
* Don't use glassmorphism.
* Don't use neon.
* Don't use colorful gradients.
* Don't use large floating cards.
* Don't use giant pill buttons.
* Don't use heavy shadows.
* Don't use generic SaaS UI.
* Don't use dashboard styling.
* Don't use bold 800/900 typography.
* Don't center the entire page.
* Don't use excessive animations.
* Don't add decorative blobs.
* Don't make the footer dark.
* Don't make large UI sections match the product accent colors.
* Don't add sections unrelated to the approved landing page.
* Don't change typography from section to section.
* Don't introduce inconsistent image color grading.

---

# Visual QA Priority

When comparing implementation against the approved reference, fix differences in this order:

1. Overall composition
2. Hero height
3. Hero media crop
4. YUGEN wordmark
5. Hero typography
6. Hero text placement
7. Warm color temperature
8. Women Collection proportions
9. Men Collection proportions
10. Horizontal alignment
11. Section heights
12. Product image proportions
13. Apparel color distribution
14. Values strip
15. Lookbook composition
16. Newsletter
17. Footer
18. Borders
19. Icons
20. Micro-motion

Do not spend time polishing animation while the layout is still visually inaccurate.

---

# Implementation Contract

This design system becomes the visual source of truth for YUGEN.

Future customer-facing pages must inherit the same:

* color system,
* typography,
* spacing,
* alignment,
* image treatment,
* icon style,
* border system,
* CTA language,
* motion,
* fashion palette,
* responsive philosophy.

This applies to:

* Landing Page
* New In
* Women
* Men
* Collections
* Product Listing
* Product Detail
* Search
* Wishlist
* Cart
* Checkout
* Sign In
* Sign Up
* Account
* Orders
* Addresses
* Lookbook
* About
* Contact
* Legal pages

The layouts may change according to functionality, but the visual language must remain unmistakably YUGEN.

---

# Quick CSS Tokens

```css
:root {

  /* FOUNDATION */

  --yugen-canvas: #F2ECE3;
  --yugen-canvas-soft: #F6F1E9;
  --yugen-ivory: #ECE4D8;
  --yugen-cream: #E6DBCC;
  --yugen-sand: #D6C5B0;
  --yugen-stone: #B7A58F;


  /* TYPOGRAPHY */

  --yugen-ink: #25211D;
  --yugen-ink-strong: #171512;
  --yugen-body: #494139;
  --yugen-muted: #756A5E;
  --yugen-muted-soft: #9B8F82;
  --yugen-on-media: #F7F3EC;


  /* LINES */

  --yugen-line:
    rgba(70,54,39,.16);

  --yugen-line-soft:
    rgba(70,54,39,.09);

  --yugen-line-media:
    rgba(247,243,236,.35);


  /* FASHION COLORS */

  --yugen-espresso: #4B3325;
  --yugen-cocoa: #6B4A37;

  --yugen-soft-black: #191816;
  --yugen-charcoal: #34312D;

  --yugen-butter: #E7D28C;
  --yugen-pale-butter: #F1E3AF;

  --yugen-matcha: #7B8660;
  --yugen-sage-matcha: #A3AA88;

  --yugen-warm-ivory: #EEE6D9;
  --yugen-stone-beige: #B9A58D;


  /* RADII */

  --radius-xs: 3px;
  --radius-sm: 5px;
  --radius-md: 8px;


  /* MOTION */

  --ease-yugen:
    cubic-bezier(.22,1,.36,1);

  --ease-yugen-slide:
    cubic-bezier(.76,0,.24,1);

}
```

---

# Final Design Principle

YUGEN does not achieve luxury through decoration.

It achieves luxury through:

**composition + photography + typography + materials + whitespace + restraint.**

The interface remains quiet.

The fashion introduces controlled color.

The photography introduces atmosphere.

The typography introduces identity.

The spacing introduces luxury.

Every future implementation decision should preserve the core YUGEN statement:

# ESSENCE OF SIMPLICITY
