import { extendTheme, type ThemeConfig } from "@chakra-ui/react"

// Light only. App.tsx also pins the colour mode so a stale value in
// localStorage can't flip Chakra's own components into their dark styles.
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

/**
 * Modernist.
 *
 * A flat, high-contrast system: warm-grey ground, near-black ink, one loud
 * vermilion accent, and no rounding anywhere. Structure is carried by rules —
 * 2px for major divisions, 1px hairlines inside lists and tables — rather than
 * by shadow or blur. Archivo does all the talking: 800 for headings and
 * buttons, 400/500/600 for body, and a monospaced voice for labels, counts and
 * anything the eye should read as data.
 *
 *   bg        #f3f2f2   the ground
 *   surface   #eae9e9   fields and inset panels
 *   text      #201e1d   ink
 *   accent    #ec3013   vermilion — actions and the current selection
 *   accent-2  #e15b47   secondary accent
 */

const INK = "#201e1d"

// Tonal ramps, generated in OKLCH on one shared lightness scale, so the same
// step of any role matches the others in visual value.
const neutral = {
  100: "#f8f4f4",
  200: "#eae7e7",
  300: "#d7d3d3",
  400: "#bab6b6",
  500: "#9b9797",
  600: "#7d7979",
  700: "#605d5d",
  800: "#444141",
  900: "#2d2b2b",
}

const accent = {
  100: "#fff2ef",
  200: "#ffe0d9",
  300: "#ffc4b8",
  400: "#ff9783",
  500: "#ff563c",
  600: "#dd2b0f",
  700: "#ae1800",
  800: "#7c1405",
  900: "#4d170e",
}

const accent2 = {
  100: "#fff2ef",
  200: "#ffe0da",
  300: "#ffc4b9",
  400: "#ff9784",
  500: "#ef6853",
  600: "#c94b39",
  700: "#9e3526",
  800: "#71261b",
  900: "#471d16",
}

/** Ink at a given alpha. Every tint in the system is the ink, thinned. */
const ink = (alpha: number) => `rgba(32, 30, 29, ${alpha})`

// Fields sit on the surface behind a hairline; the search bars that lead a
// screen get the full 2px ink edge instead. Both are square.
const fieldStyle = {
  bg: "surface",
  color: "text",
  borderRadius: 0,
  borderWidth: "1px",
  borderColor: "divider",
  caretColor: "var(--chakra-colors-accent)",
  _hover: { borderColor: "ink-45" },
  _focusVisible: { borderColor: "accent", boxShadow: "none" },
  _placeholder: { color: "ink-45" },
}

const customTheme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: "bg",
        color: "text",
        fontSize: "15px",
        lineHeight: 1.55,
        fontWeight: 400,
      },
      "*::selection": { bg: "accent-200" },
      // The system's focus ring: the accent, offset, never a glow.
      "*:focus-visible": {
        outline: "2px solid var(--chakra-colors-accent)",
        outlineOffset: "2px",
        boxShadow: "none !important",
      },
    },
  },
  fonts: {
    heading: `'Archivo', system-ui, -apple-system, sans-serif`,
    body: `'Archivo', system-ui, -apple-system, sans-serif`,
    mono: `ui-monospace, Menlo, Monaco, 'Courier New', monospace`,
  },
  // Nothing in the system is rounded. `full` is kept only so Chakra internals
  // that assume a pill (the Spinner's track) still render as circles.
  radii: {
    none: "0",
    sm: "0",
    base: "0",
    md: "0",
    lg: "0",
    xl: "0",
    "2xl": "0",
    "3xl": "0",
    full: "9999px",
  },
  colors: { neutral, accent, "accent-2": accent2 },
  semanticTokens: {
    // Single-mode, but kept as semantic tokens so they compile to the
    // `--chakra-colors-*` custom properties the table library reads.
    colors: {
      bg: "#f3f2f2",
      surface: "#eae9e9",
      text: INK,

      // Ink, thinned. `divider` is the system's rule colour; `rule` is the
      // hairline used between rows inside a block.
      divider: ink(0.4),
      rule: ink(0.14),
      "ink-70": ink(0.7),
      "ink-60": ink(0.6),
      "ink-55": ink(0.55),
      "ink-50": ink(0.5),
      "ink-45": ink(0.45),
      "ink-12": ink(0.12),
      "ink-07": ink(0.07),
      "ink-04": ink(0.04),

      accent: "#ec3013",
      "accent-hover": "accent.600",
      "accent-active": "accent.700",
      "accent-2": "#e15b47",
      "text-on-accent": "#f3f2f2",

      "chakra-body-bg": "#f3f2f2",
      "chakra-body-text": INK,
      "chakra-border-color": ink(0.4),
      "chakra-placeholder-color": ink(0.45),
    },
    shadows: {
      "elev-sm": "0 1px 2px rgba(45, 43, 43, 0.14)",
      "elev-md": "0 3px 10px rgba(45, 43, 43, 0.16)",
      "elev-lg": "0 12px 32px rgba(45, 43, 43, 0.22)",
    },
  },
  textStyles: {
    // The system voice: section labels, kickers, column heads.
    kicker: {
      fontFamily: "mono",
      fontSize: "10px",
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "ink-50",
    },
    // Data read as data: counts, ranges, dates, page numbers.
    data: {
      fontFamily: "mono",
      fontSize: "12px",
      color: "ink-55",
    },
    // The wordmark, at whatever size it is used.
    wordmark: {
      fontFamily: "heading",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      lineHeight: 1,
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 800,
        color: "text",
        lineHeight: 1.12,
        letterSpacing: "-0.015em",
      },
    },
    Button: {
      // Buttons are set in the heading face at heading weight, matching the
      // 14px inputs they stand beside in search rows.
      baseStyle: {
        fontFamily: "heading",
        fontWeight: 800,
        borderRadius: 0,
        lineHeight: 1.2,
        _disabled: { opacity: 0.45 },
      },
      sizes: {
        sm: { fontSize: "12px", h: "32px", px: 3 },
        md: { fontSize: "14px", h: "36px", px: "14px" },
        lg: { fontSize: "15px", h: "56px", px: 6 },
      },
      variants: {
        primary: {
          bg: "accent",
          color: "text-on-accent",
          _hover: { bg: "accent-hover", _disabled: { bg: "accent" } },
          _active: { bg: "accent-active" },
        },
        secondary: {
          bg: "transparent",
          color: "text",
          borderWidth: "1px",
          borderColor: "divider",
          _hover: { bg: "ink-07" },
          _active: { bg: "ink-12" },
        },
        ghost: {
          color: "accent",
          px: 1,
          _hover: { bg: "accent.100" },
          _active: { bg: "accent.200" },
        },
      },
      defaultProps: { variant: "secondary", size: "md" },
    },
    Input: {
      sizes: {
        md: { field: { h: "36px", fontSize: "14px", px: "10px" } },
        lg: { field: { h: "48px", fontSize: "15px", px: 4 } },
      },
      variants: {
        outline: { field: fieldStyle },
        // Leads a screen: the full 2px ink edge, on the ground rather than
        // the surface, so the rule reads as the frame around the whole row.
        lead: {
          field: {
            ...fieldStyle,
            bg: "bg",
            borderWidth: "2px",
            borderColor: "text",
            _hover: { borderColor: "text" },
            _focusVisible: { borderColor: "accent" },
          },
        },
        // Sits inside a 2px frame drawn by its container, so it draws none.
        bare: {
          field: {
            ...fieldStyle,
            bg: "bg",
            borderWidth: 0,
            _hover: { borderColor: "transparent" },
            _focusVisible: { borderColor: "transparent" },
          },
        },
      },
      defaultProps: { variant: "outline" },
    },
    Select: {
      variants: { outline: { field: fieldStyle } },
      defaultProps: { variant: "outline" },
    },
    FormLabel: {
      baseStyle: {
        fontFamily: "mono",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "ink-50",
        mb: 2,
      },
    },
    Tag: {
      baseStyle: {
        container: {
          borderRadius: 0,
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.02em",
          px: "10px",
          py: "3px",
          minH: "auto",
        },
      },
      variants: {
        accent: { container: { bg: "accent.100", color: "accent.800" } },
        "accent-2": {
          container: { bg: "accent-2.100", color: "accent-2.800" },
        },
        neutral: { container: { bg: "neutral.100", color: "neutral.800" } },
        outline: {
          container: {
            bg: "transparent",
            color: "accent",
            border: "1px solid",
            borderColor: "accent",
            boxShadow: "none",
          },
        },
      },
      defaultProps: { variant: "neutral" },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "surface",
          color: "text",
          borderRadius: 0,
          boxShadow: "elev-lg",
        },
        header: {
          fontFamily: "heading",
          fontWeight: 800,
          fontSize: "20px",
          color: "text",
        },
        overlay: { bg: "rgba(45, 43, 43, 0.5)" },
        closeButton: { borderRadius: 0, top: 3, insetEnd: 3 },
      },
    },
  },
})

export default customTheme
