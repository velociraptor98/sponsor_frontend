import * as React from "react"
import {
  ChakraProvider,
  Box,
  Container,
  Flex,
} from "@chakra-ui/react"
import customTheme from "./theme"
import Navbar from "./Components/Navbar";
import MainContainer from "./Components/MainContainer";
import Footer from "./Components/Footer";

export const App = () => (
  <ChakraProvider theme={customTheme}>
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
