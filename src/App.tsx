import { ChakraProvider, Box, Container, Flex } from "@chakra-ui/react"
import customTheme from "./theme"
import Navbar from "./Components/Navbar";
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

export const App = () => (
  <ChakraProvider theme={customTheme} colorModeManager={lightOnly}>
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box flex="1">
        <Container maxW="container.xl" py={8} px={6}>
          <MainContainer />
        </Container>
      </Box>
      <Footer />
    </Flex>
  </ChakraProvider>
)
