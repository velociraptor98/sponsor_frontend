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

const customTheme = extendTheme({
  config,
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
    },
  },
})

export default customTheme
