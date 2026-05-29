import { extendTheme, type ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

// Everforest-derived green scale
const forest = {
  50:  "#f3f6e3",
  100: "#e2edba",
  200: "#cedd8e",
  300: "#b9cd62",
  400: "#a7c080", // dark-mode accent
  500: "#8da101", // light-mode accent
  600: "#6e7d01",
  700: "#505901",
  800: "#313500",
  900: "#131100",
}

// Ambient, blurred accent "orbs" painted on the body. Glass surfaces blur and
// refract this colour, so the effect needs something other than a flat fill
// sitting behind them.
const lightOrbs = `
  radial-gradient(ellipse 85% 55% at 8% -8%, rgba(53, 167, 124, 0.17), transparent 62%),
  radial-gradient(ellipse 78% 55% at 92% 2%, rgba(141, 161, 1, 0.13), transparent 60%),
  radial-gradient(ellipse 100% 72% at 50% 112%, rgba(223, 160, 0, 0.10), transparent 72%)
`
const darkOrbs = `
  radial-gradient(ellipse 80% 55% at 12% -5%, rgba(167, 192, 128, 0.16), transparent 60%),
  radial-gradient(ellipse 70% 55% at 88% 8%, rgba(131, 192, 146, 0.16), transparent 60%),
  radial-gradient(ellipse 95% 70% at 50% 108%, rgba(167, 192, 128, 0.10), transparent 70%)
`

// Shared liquid-glass surface: translucent tint, heavy backdrop blur, a bright
// rim, an inset top highlight and a soft drop shadow. A `_before` sheen adds the
// signature top light; direct children are lifted above it so content stays crisp.
const glassBase = {
  position: "relative" as const,
  overflow: "hidden",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "glass-border",
  boxShadow: "glass",
  backdropFilter: "blur(18px) saturate(180%)",
  "& > *": { position: "relative", zIndex: 1 },
  _before: {
    content: '""',
    position: "absolute",
    insetInline: 0,
    top: 0,
    height: "55%",
    bgGradient: "linear(to-b, glass-sheen, transparent)",
    opacity: 0.7,
    pointerEvents: "none",
    zIndex: 0,
  },
}

const customTheme = extendTheme({
  config,
  styles: {
    global: (props: { colorMode: "light" | "dark" }) => ({
      "*": {
        transition:
          "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
      },
      body: {
        backgroundAttachment: "fixed",
        backgroundImage: props.colorMode === "dark" ? darkOrbs : lightOrbs,
      },
    }),
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
    body:    `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  colors: { forest },
  semanticTokens: {
    colors: {
      "chakra-body-bg": {
        _light: "#fdf6e3",
        _dark:  "#2d353b",
      },
      "chakra-body-text": {
        _light: "#5c6a72",
        _dark:  "#d3c6aa",
      },
      "chakra-border-color": {
        _light: "#e0dcc9",
        _dark:  "#475258",
      },
      "chakra-placeholder-color": {
        _light: "#829181",
        _dark:  "#7a8478",
      },
      "glass-bg": {
        _light: "rgba(245, 247, 226, 0.55)",
        _dark:  "rgba(45, 53, 59, 0.40)",
      },
      "glass-bg-strong": {
        _light: "rgba(248, 250, 232, 0.82)",
        _dark:  "rgba(45, 53, 59, 0.66)",
      },
      "glass-border": {
        _light: "rgba(255, 255, 255, 0.62)",
        _dark:  "rgba(255, 255, 255, 0.10)",
      },
      "glass-sheen": {
        _light: "rgba(255, 255, 255, 0.6)",
        _dark:  "rgba(255, 255, 255, 0.12)",
      },
    },
    shadows: {
      glass: {
        _light:
          "inset 0 1px 1px rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(255, 255, 255, 0.25), 0 12px 30px -12px rgba(74, 88, 52, 0.3)",
        _dark:
          "inset 0 1px 1px rgba(255, 255, 255, 0.12), inset 0 -1px 1px rgba(0, 0, 0, 0.25), 0 14px 34px -10px rgba(0, 0, 0, 0.6)",
      },
    },
  },
  layerStyles: {
    glass: { ...glassBase, bg: "glass-bg" },
    glassStrong: {
      ...glassBase,
      bg: "glass-bg-strong",
      backdropFilter: "blur(26px) saturate(190%)",
    },
  },
  components: {
    Input: {
      defaultProps: { focusBorderColor: "forest.500" },
    },
    Select: {
      defaultProps: { focusBorderColor: "forest.500" },
    },
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "lg",
      },
      variants: {
        glass: {
          bg: "glass-bg",
          borderWidth: "1px",
          borderColor: "glass-border",
          boxShadow: "glass",
          backdropFilter: "blur(14px) saturate(180%)",
          _hover: { bg: "glass-bg-strong", transform: "translateY(-1px)" },
          _active: { transform: "translateY(0)" },
        },
      },
    },
  },
})

export default customTheme
