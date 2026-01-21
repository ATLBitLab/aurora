# Aurora - Prism Project Design Token Structure

This document summarizes the design token structure from the Figma design system for the Aurora - Prism Project.

## Overview

The design system is organized into several main categories: Colors, Typography, Spacing, Radius, and Effects. Each category contains semantic tokens that map to specific use cases within the application.

---

## Color Tokens

### Base Color Palettes

The design system includes comprehensive color palettes with scales from 50 (lightest) to 950 (darkest):

#### Primary Color Palettes
- **Red**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **Yellow**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **Green**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **Violet**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **Greys**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

#### Gradient Tokens
- **Gradient - Fill**: Primary gradient fill
- **Gradient - Hover**: Hover state gradient
- **Gradient - Stroke**: Stroke gradient
- **Gradient - Blue**: Blue gradient variant

### Semantic Color Tokens

#### Backgrounds
- `Background / Elevated`: Elevated background surface
- `Background / Default`: Default background surface

#### Surfaces
- `Surface / Subtle`: Subtle surface variant
- `Surface / Default`: Default surface
- `Surface / Disabled`: Disabled state surface
- `Surface / Gradient-Primary`: Primary gradient surface
- `Surface / Gradient-Secondary`: Secondary gradient surface
- `Surface / Elevated lv.1`: First level elevated surface
- `Surface / Elevated lv.2`: Second level elevated surface

#### Borders
- `Border / Default`: Default border color
- `Border / Disabled`: Disabled border color
- `Border / Darker`: Darker border variant
- `Border / Active`: Active state border
- `Border / Secondary`: Secondary border
- `Border / tertiary`: Tertiary border

#### Text/Icon/Symbols
- `Text / Title`: Title text color
- `Text / Body`: Body text color
- `Text / Subtitle`: Subtitle text color
- `Text / Icon / primary`: Primary icon/text color
- `Text / Icon / darker`: Darker icon/text variant
- `Text / Icon / white`: White icon/text variant

#### Semantics
- `Semantic / primary`: Primary semantic color
- `Semantic / darker`: Darker semantic variant
- `Semantic / white`: White semantic variant

---

## Typography Tokens

### Type Scale

The typography system includes the following text styles with multiple weight variants:

#### Headings
- **H1**: Bold, Regular, Light
  - Size: 61px (3.813rem)
- **H2**: Bold, Regular, Light
  - Size: 49px (3.063rem)
- **H3**: Bold, Regular, Light
  - Size: 39px (2.438rem)
- **H4**: Bold, Regular, Light
  - Size: 31px (1.938rem)
- **H5**: Bold, Regular, Light
  - Size: 24px (1.563rem)

#### Other Text Styles
- **Headline**: Bold, Regular, Light
  - Size: 20px (1.250rem)
- **Body**: Bold, Regular, Light
  - Size: 16px (1.000rem)
- **Subtitle**: Bold, Regular
  - Size: 13px (0.813rem)
- **Caption**: Bold, Regular
  - Size: 10px (0.625rem)
- **Footnote**: Bold, Regular
  - Size: 8px (0.500rem)

### Font Weights
- **Bold**: Heavy weight for emphasis
- **Regular**: Standard weight for body text
- **Light**: Light weight for subtle text

---

## Spacing & Number Scale

The spacing system uses a consistent numerical scale:

### Spacing Values
- `2` (2px)
- `4` (4px)
- `6` (6px)
- `8` (8px)
- `12` (12px)
- `16` (16px)
- `20` (20px)
- `24` (24px)
- `32` (32px)
- `40` (40px)
- `999` (999px - likely for full-width/max values)
- `Full` (100% width)

---

## Radius Tokens

Border radius values for rounded corners:

- **S** (Small): Minimal rounding
- **M** (Medium): Standard rounding
- **L** (Large): Large rounding
- **XL** (Extra Large): Extra large rounding
- **Full**: Fully rounded (circular/pill shape)

---

## Effects Tokens

### Blur
- **Background Blur**: Blur effect for background elements

---

## Icon Tokens

### Navigation & UI Icons

These icons should be used across all screens for consistency. Each icon has default (white), green (active), and dark variants where available.

- **Dashboard**
  - Default: https://www.figma.com/api/mcp/asset/7ea22fe7-76f3-4dcd-be2a-27584735bf3e
  - Green: https://www.figma.com/api/mcp/asset/46fe45e5-90ae-4730-b5f5-6775c3ea68b7
  - Dark: https://www.figma.com/api/mcp/asset/a4ec5af4-7202-4a2c-af55-4f15dddc4549
- **Prisms**
  - Default: https://www.figma.com/api/mcp/asset/344137cd-61ab-4c91-80d3-746b4b1078ef
  - Green: https://www.figma.com/api/mcp/asset/6c56fea7-8bb6-4c02-be2c-fa73a3c6e210
  - Dark: https://www.figma.com/api/mcp/asset/e9890cf3-3675-49e7-8a57-e15013aed9d5
- **Contacts**
  - Default: https://www.figma.com/api/mcp/asset/db895cc0-2873-4f73-a16f-71332b53de60
  - Green: https://www.figma.com/api/mcp/asset/af5bddfe-c935-4178-a465-7b22f4a480c5
  - Dark: https://www.figma.com/api/mcp/asset/425d7d31-b102-4dfd-98bd-6e9f84ab25b0
- **Notifications**
  - Default: https://www.figma.com/api/mcp/asset/9bef6dcd-9734-44fa-b3c8-fda66e0a8bb7
  - Green: https://www.figma.com/api/mcp/asset/7023b275-ef0d-485b-846e-a823595fab0c
  - Dark: https://www.figma.com/api/mcp/asset/efde19ab-cd3c-4d42-a31a-827179fc0433
- **Settings**
  - Default: https://www.figma.com/api/mcp/asset/f1c526ef-385e-49c0-95f7-2ee7831d0d1f
  - Variant2: https://www.figma.com/api/mcp/asset/6d2b67c0-1f7e-4a36-b5b3-20fb8eaede33
  - Variant3: https://www.figma.com/api/mcp/asset/55e572ed-04e4-47ca-9149-5815e4f6e3e9
- **Wallet**
  - Default: https://www.figma.com/api/mcp/asset/9b443623-e832-4d0e-a38c-850d8be7a35e
  - Green: https://www.figma.com/api/mcp/asset/f5bfa230-d75d-46fe-a700-2bab54cd9fee
- **Finance**
  - Default: https://www.figma.com/api/mcp/asset/89d6edc7-18cd-4d29-97b3-db4116db9ed0
  - Variant2: https://www.figma.com/api/mcp/asset/22c366a9-5a17-4eb7-9da8-248d0a7a4e76
  - Variant3: https://www.figma.com/api/mcp/asset/6bd0f1ab-4945-47da-bf52-f72129f762d9
- **Vector**
  - Default: https://www.figma.com/api/mcp/asset/0ca23d71-1965-41a9-b1bb-42fc1827f05a
  - Variant2: https://www.figma.com/api/mcp/asset/329bbee7-c73b-433d-97e4-dd2a7179ee28
  - Variant3: https://www.figma.com/api/mcp/asset/45f3e1e8-dce4-4de1-904a-9cbda44f996e

---

## Token Organization Structure

The design tokens are organized hierarchically:

```
Design Tokens
├── Colors
│   ├── Base Palettes (Red, Yellow, Green, Violet, Greys)
│   ├── Gradients
│   └── Semantic Tokens
│       ├── Backgrounds
│       ├── Surfaces
│       ├── Borders
│       ├── Text/Icon/Symbols
│       └── Semantics
├── Typography
│   ├── Headings (H1-H5)
│   └── Text Styles (Headline, Body, Subtitle, Caption, Footnote)
├── Spacing
│   └── Number Scale (2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 999, Full)
├── Radius
│   └── Size Variants (S, M, L, XL, Full)
└── Effects
    └── Blur
```

---

## Usage Notes

1. **Color Tokens**: Use semantic tokens (e.g., `Text / Title`) rather than raw color values to ensure consistency and maintainability.

2. **Typography**: Each text style has multiple weight variants. Choose the appropriate weight based on hierarchy and emphasis.

3. **Spacing**: The number scale provides consistent spacing throughout the application. Use these values for padding, margins, and gaps.

4. **Radius**: Apply radius tokens consistently to maintain visual harmony across rounded elements.

5. **Gradients**: Use gradient tokens for surfaces and backgrounds that require depth and visual interest.

---

## Implementation Recommendations

When implementing these tokens in code:

1. **CSS Variables**: Map tokens to CSS custom properties for easy theming
2. **Type Safety**: Create TypeScript interfaces for token names
3. **Documentation**: Keep this document updated as tokens evolve
4. **Naming Convention**: Follow the semantic naming structure (e.g., `surface-default`, `text-title`)
5. **Accessibility**: Ensure color contrast ratios meet WCAG guidelines when using text tokens

---

*Last updated: Based on Figma file structure analysis*
*Figma File: [Aurora - Prism Project](https://www.figma.com/design/eTUcSLVwAKhRIQxMqBqo8v/Aurora---Prism-Project?node-id=2825-3977)*

