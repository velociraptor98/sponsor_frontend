import { extendTheme, type ThemeConfig } from "@chakra-ui/react"

// Light only. App.tsx also pins the colour mode so a stale value in
// localStorage can't flip Chakra's own components into their dark styles.
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

/**
 * Design language v1.
 *
 * Six base colours are given by the design document; everything below is
 * derived from them by holding chroma and hue and moving lightness, so the
 * ramps stay inside the warm, low-saturation family it asks for.
 *
 *   paper    oklch(0.962 0.012 86)   primary surface      -> ink.50
 *   ink      oklch(0.305 0.020 64)   headings & wordmark  -> ink.700
 *   ink soft oklch(0.470 0.022 64)   body & captions      -> ink.500
 *   clay     oklch(0.605 0.078 52)   the accent           -> clay.500
 *   sage     oklch(0.605 0.058 148)  secondary accent     -> sage.500
 *   espresso oklch(0.262 0.022 60)   deepest ground       -> ink.800
 */

// Warm neutral ramp. The four named neutrals sit at fixed stops (see above) so
// they can be referenced either by brand name or by scale position.
const ink = {
  50:  "oklch(0.962 0.012 86)", // paper
  100: "oklch(0.930 0.014 78)",
  200: "oklch(0.880 0.016 72)",
  300: "oklch(0.800 0.018 68)",
  400: "oklch(0.640 0.020 64)",
  500: "oklch(0.470 0.022 64)", // ink soft
  600: "oklch(0.395 0.021 64)",
  700: "oklch(0.305 0.020 64)", // ink
  800: "oklch(0.262 0.022 60)", // espresso
  900: "oklch(0.200 0.018 60)",
}

// Clay is reserved for the accent, so it always means "this is alive".
const clay = {
  50:  "oklch(0.965 0.012 52)",
  100: "oklch(0.930 0.022 52)",
  200: "oklch(0.870 0.038 52)",
  300: "oklch(0.795 0.054 52)",
  400: "oklch(0.700 0.068 52)",
  500: "oklch(0.605 0.078 52)", // clay
  600: "oklch(0.530 0.072 52)",
  700: "oklch(0.450 0.060 52)",
  800: "oklch(0.370 0.046 52)",
  900: "oklch(0.300 0.034 52)",
}

const sage = {
  50:  "oklch(0.965 0.010 148)",
  100: "oklch(0.930 0.018 148)",
  200: "oklch(0.870 0.030 148)",
  300: "oklch(0.795 0.042 148)",
  400: "oklch(0.700 0.052 148)",
  500: "oklch(0.605 0.058 148)", // sage
  600: "oklch(0.530 0.053 148)",
  700: "oklch(0.450 0.044 148)",
  800: "oklch(0.370 0.034 148)",
  900: "oklch(0.300 0.026 148)",
}

// Two very soft washes of clay and sage, fixed to the viewport. They exist so
// the glass surfaces have something to refract — flat paper would blur into
// nothing. Kept far below the accent's strength so the page stays quiet.
const ambientWash = `
  radial-gradient(ellipse 80% 55% at 10% -6%, oklch(0.605 0.078 52 / 0.18), transparent 62%),
  radial-gradient(ellipse 75% 55% at 92% 4%, oklch(0.605 0.058 148 / 0.15), transparent 60%),
  radial-gradient(ellipse 95% 65% at 55% 108%, oklch(0.605 0.078 52 / 0.12), transparent 70%)
`

// Paper held up to the light: translucent, gently blurred, with a bright rim
// and a soft highlight along the top edge. Restrained — a hint of the material,
// not the frosted slab.
const glassBase = {
  position: "relative" as const,
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "glass-border",
  backdropFilter: "blur(16px) saturate(140%)",
  boxShadow: "glass",
  // The sheen sits behind content, so text stays crisp on top of it.
  "& > *": { position: "relative", zIndex: 1 },
  _before: {
    content: '""',
    position: "absolute",
    insetInline: 0,
    top: 0,
    // Kept short: a long near-white ramp bands visibly across a tall panel.
    height: "88px",
    bgGradient: "linear(to-b, glass-sheen, transparent)",
    pointerEvents: "none",
    zIndex: 0,
  },
}

// Shared by Input and Select: paper field, hairline edge, clay focus ring.
const fieldStyle = {
  bg: "surface-raised",
  borderColor: "border",
  color: "text",
  _hover: { borderColor: "border-strong" },
  _focusVisible: {
    borderColor: "accent",
    boxShadow: "0 0 0 1px var(--chakra-colors-accent)",
  },
}

const customTheme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: "surface",
        color: "text-body",
        backgroundImage: ambientWash,
        backgroundAttachment: "fixed",
      },
      "*::selection": {
        bg: "clay.100",
        color: "ink.800",
      },
    },
  },
  fonts: {
    // Two voices: Quicksand is the brand voice, Space Mono the system voice.
    heading: `'Quicksand', -apple-system, BlinkMacSystemFont, sans-serif`,
    body:    `'Quicksand', -apple-system, BlinkMacSystemFont, sans-serif`,
    mono:    `'Space Mono', ui-monospace, SFMono-Regular, monospace`,
  },
  colors: { ink, clay, sage },
  semanticTokens: {
    // Single-mode, but kept as semantic tokens so they compile to the
    // `--chakra-colors-*` custom properties the table library reads.
    colors: {
      surface: "ink.50",
      "surface-raised": "oklch(0.985 0.008 86)",
      "surface-sunken": "oklch(0.940 0.014 84)",

      text: "ink.700",
      "text-body": "ink.500",
      "text-muted": "ink.400",

      // Hairlines, never heavy rules.
      border: "oklch(0.895 0.014 76)",
      "border-strong": "oklch(0.830 0.018 70)",

      accent: "clay.500",
      "accent-hover": "clay.600",
      "accent-soft": "oklch(0.605 0.078 52 / 0.10)",
      // Clay darkened enough to carry small text on the ground.
      "accent-strong": "clay.700",
      // Reversed out of clay.
      "text-on-accent": "ink.50",

      "accent-secondary": "sage.500",

      // Zebra striping: a breath of ink on paper, nothing more.
      "row-alt": "oklch(0.305 0.020 64 / 0.028)",

      // Glass: a translucent sheet of paper, its rim catching the light.
      "glass-bg": "oklch(0.985 0.008 86 / 0.55)",
      "glass-bg-strong": "oklch(0.985 0.008 86 / 0.78)",
      "glass-border": "oklch(1 0 0 / 0.65)",
      "glass-sheen": "oklch(1 0 0 / 0.45)",

      "chakra-body-bg": "ink.50",
      "chakra-body-text": "ink.500",
      "chakra-border-color": "oklch(0.895 0.014 76)",
      "chakra-placeholder-color": "ink.400",
    },
    shadows: {
      // Soft and low — paper resting on paper.
      "paper-sm": "0 1px 2px oklch(0.305 0.020 64 / 0.05)",
      paper:
        "0 2px 4px oklch(0.305 0.020 64 / 0.04), 0 8px 20px -12px oklch(0.305 0.020 64 / 0.14)",
      "paper-lg":
        "0 4px 8px oklch(0.305 0.020 64 / 0.05), 0 16px 36px -16px oklch(0.305 0.020 64 / 0.20)",
      // The same soft drop, plus the inset highlight that sells the material.
      glass:
        "inset 0 1px 1px oklch(1 0 0 / 0.7), 0 2px 4px oklch(0.305 0.020 64 / 0.04), 0 10px 26px -14px oklch(0.305 0.020 64 / 0.20)",
    },
  },
  layerStyles: {
    // A sheet of paper: flat fill, hairline edge, soft shadow.
    panel: {
      bg: "surface-raised",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "border",
      boxShadow: "paper",
    },
    // The same sheet, translucent and lit.
    glass: { ...glassBase, bg: "glass-bg" },
    // For surfaces that sit over content and need to stay legible.
    glassStrong: {
      ...glassBase,
      bg: "glass-bg-strong",
      backdropFilter: "blur(22px) saturate(150%)",
    },
  },
  textStyles: {
    // The system voice: labels, captions, metadata.
    meta: {
      fontFamily: "mono",
      fontSize: "xs",
      fontWeight: 400,
      letterSpacing: "0.12em",
      color: "text-muted",
    },
    label: {
      fontFamily: "mono",
      fontSize: "xs",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "text-muted",
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 600,
        color: "text",
        letterSpacing: "-0.005em",
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 600,
        borderRadius: "lg",
      },
      variants: {
        // The one loud-ish element in the system, and it is clay.
        breath: {
          bg: "accent",
          color: "text-on-accent",
          _hover: {
            bg: "accent-hover",
            _disabled: { bg: "accent" },
          },
          _active: { bg: "accent-hover" },
        },
        quiet: {
          bg: "transparent",
          color: "text",
          borderWidth: "1px",
          borderColor: "border-strong",
          _hover: { bg: "accent-soft", borderColor: "accent" },
          _active: { bg: "accent-soft" },
        },
        ghost: {
          color: "text-body",
          _hover: { bg: "accent-soft", color: "text" },
          _active: { bg: "accent-soft" },
        },
      },
      defaultProps: { variant: "quiet" },
    },
    // Overriding the `outline` variant replaces Chakra's built-in one, which is
    // what would normally apply `focusBorderColor` — so the focus ring has to be
    // declared here explicitly, or it falls back to black.
    Input: {
      variants: { outline: { field: fieldStyle } },
    },
    Select: {
      variants: { outline: { field: fieldStyle } },
    },
    FormLabel: {
      baseStyle: {
        fontFamily: "mono",
        fontSize: "xs",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "text-muted",
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          ...glassBase,
          bg: "glass-bg-strong",
          backdropFilter: "blur(22px) saturate(150%)",
          borderRadius: "xl",
          color: "text-body",
          overflow: "hidden",
        },
        header: { fontWeight: 600, color: "text" },
        overlay: { bg: "oklch(0.262 0.022 60 / 0.30)" },
      },
    },
    Tag: {
      baseStyle: {
        container: {
          fontFamily: "mono",
          fontWeight: 700,
          letterSpacing: "0.12em",
        },
      },
    },
  },
})

export default customTheme
