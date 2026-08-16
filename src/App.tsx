import { ChakraProvider, Flex } from "@chakra-ui/react"
import customTheme from "./theme"
import MainContainer from "./Components/MainContainer";
import Footer from "./Components/Footer";

// The app is light-only. Chakra reads the persisted colour mode ahead of the
// theme's `initialColorMode`, so a value left in localStorage from when the
// toggle existed would still put Chakra's own components into their dark
// styles. This manager reports light and never writes, which pins it.
// (Chakra exports the storage-manager values but not its type, so this satisfies
// the `colorModeManager` prop structurally.)
const lightOnly = {
  type: "localStorage" as const,
  ssr: false,
  get: () => "light" as const,
  set: () => undefined,
}

// Full-bleed: the system draws its structure with rules that run edge to edge,
// so there is no centred container and no page gutter — the screens set their
// own padding inside the frame.
export const App = () => (
  <ChakraProvider theme={customTheme} colorModeManager={lightOnly}>
    <Flex direction="column" minH="100vh">
      <MainContainer />
      <Footer />
    </Flex>
  </ChakraProvider>
)
