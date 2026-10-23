import { extendTheme, type ThemeConfig } from "@chakra-ui/react"

// Light only. App.tsx also pins the colour mode so a stale value in
// localStorage can't flip Chakra's own components into their dark styles.
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

const INK = "#0d1117"

const lime = {
  50: "#f6fde8",
  100: "#ecfacc",
  200: "#ddf6a3",
  300: "#c6f36b",
  400: "#b2e64a",
  500: "#96cc2b",
  600: "#74a31c",
  700: "#557a17",
  800: "#3d5a14",
  900: "#283b10",
}

const fieldStyle = {
  bg: "subtle",
  color: "text",
  borderRadius: "md",
  borderWidth: "1px",
  borderColor: "transparent",
  transition: "border-color 120ms, background 120ms, box-shadow 120ms",
  _hover: { bg: "#e8ebef" },
  _focusVisible: {
    bg: "surface",
    borderColor: "text",
    boxShadow: "0 0 0 3px var(--chakra-colors-lime-200)",
  },
  _placeholder: { color: "faint" },
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
        WebkitFontSmoothing: "antialiased",
      },
      "*::selection": { bg: "lime.200" },
      "*:focus-visible": {
        outline: "2px solid var(--chakra-colors-text)",
        outlineOffset: "2px",
      },
    },
  },
  fonts: {
    heading: `'Bricolage Grotesque', system-ui, -apple-system, sans-serif`,
    body: `'Geist', system-ui, -apple-system, sans-serif`,
    mono: `'Geist Mono', ui-monospace, Menlo, monospace`,
  },
  radii: {
    sm: "6px",
    base: "8px",
    md: "10px",
    lg: "14px",
    xl: "20px",
    "2xl": "28px",
  },
  colors: { lime },
  semanticTokens: {
    // Kept as semantic tokens so they compile to `--chakra-colors-*` custom
    // properties that can be referenced from raw CSS strings.
    colors: {
      bg: "#f4f5f7",
      surface: "#ffffff",
      subtle: "#eef0f3",
      text: INK,
      muted: "#5b6270",
      faint: "#8a909c",
      border: "#e3e6eb",
      "border-strong": "#cfd4db",

      accent: "lime.300",
      "accent-soft": "lime.100",
      "accent-text": "lime.800",

      "chakra-body-bg": "#f4f5f7",
      "chakra-body-text": INK,
      "chakra-border-color": "#e3e6eb",
      "chakra-placeholder-color": "#8a909c",
    },
    shadows: {
      card: "0 1px 2px rgba(13, 17, 23, 0.04), 0 1px 1px rgba(13, 17, 23, 0.02)",
      raised:
        "0 1px 2px rgba(13, 17, 23, 0.06), 0 8px 24px -6px rgba(13, 17, 23, 0.12)",
      pop: "0 24px 48px -12px rgba(13, 17, 23, 0.25)",
    },
  },
  layerStyles: {
    card: {
      bg: "surface",
      border: "1px solid",
      borderColor: "border",
      borderRadius: "lg",
      boxShadow: "card",
    },
  },
  textStyles: {
    label: {
      fontSize: "12px",
      fontWeight: 600,
      color: "muted",
    },
    num: {
      fontVariantNumeric: "tabular-nums",
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 700,
        color: "text",
        lineHeight: 1.1,
        letterSpacing: "-0.025em",
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 600,
        borderRadius: "md",
        lineHeight: 1.2,
        _disabled: { opacity: 0.4 },
      },
      sizes: {
        sm: { fontSize: "13px", h: "32px", px: 3 },
        md: { fontSize: "14px", h: "38px", px: 4 },
        lg: { fontSize: "15px", h: "48px", px: 6, borderRadius: "md" },
      },
      variants: {
        primary: {
          bg: "text",
          color: "white",
          _hover: { bg: "#262c36", _disabled: { bg: "text" } },
          _active: { bg: "#383f4b" },
        },
        secondary: {
          bg: "surface",
          color: "text",
          borderWidth: "1px",
          borderColor: "border",
          boxShadow: "card",
          _hover: { bg: "subtle", _disabled: { bg: "surface" } },
          _active: { bg: "#e5e8ec" },
        },
        ghost: {
          color: "muted",
          _hover: { bg: "subtle", color: "text" },
          _active: { bg: "#e5e8ec" },
        },
      },
      defaultProps: { variant: "secondary", size: "md" },
    },
    Input: {
      sizes: {
        sm: { field: { h: "32px", fontSize: "13px", px: 3, borderRadius: "base" } },
        md: { field: { h: "38px", fontSize: "14px", px: 3 } },
        lg: { field: { h: "48px", fontSize: "15px", px: 4 } },
      },
      variants: {
        filled: { field: fieldStyle },
        // For inputs inside a container that draws its own frame.
        bare: {
          field: {
            bg: "transparent",
            color: "text",
            border: "none",
            _placeholder: { color: "faint" },
            _focusVisible: { outline: "none" },
          },
        },
      },
      defaultProps: { variant: "filled" },
    },
    Select: {
      variants: {
        filled: {
          field: {
            ...fieldStyle,
            bg: "surface",
            borderColor: "border",
            _hover: { borderColor: "border-strong" },
          },
        },
      },
      defaultProps: { variant: "filled" },
    },
    Tag: {
      baseStyle: {
        container: {
          borderRadius: "full",
          fontSize: "12px",
          fontWeight: 500,
          px: "10px",
          py: "4px",
          minH: "auto",
        },
      },
      variants: {
        chip: {
          container: {
            bg: "surface",
            color: "text",
            border: "1px solid",
            borderColor: "border",
            transition: "all 120ms",
            _hover: { borderColor: "text" },
          },
        },
        selected: {
          container: { bg: "text", color: "white" },
        },
        ratingA: {
          container: {
            bg: "#e3f5e8",
            color: "#17633a",
            fontWeight: 600,
            px: "8px",
            py: "2px",
          },
        },
        ratingB: {
          container: {
            bg: "#fdf0d3",
            color: "#8a5300",
            fontWeight: 600,
            px: "8px",
            py: "2px",
          },
        },
      },
      defaultProps: { variant: "chip" },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "surface",
          color: "text",
          borderRadius: "xl",
          boxShadow: "pop",
        },
        header: {
          fontFamily: "heading",
          fontWeight: 700,
          fontSize: "20px",
        },
        overlay: { bg: "rgba(13, 17, 23, 0.45)", backdropFilter: "blur(4px)" },
        closeButton: { top: 3, insetEnd: 3 },
      },
    },
  },
})

export default customTheme
