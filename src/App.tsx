import * as React from "react"
import {
  ChakraProvider,
  Box,
  theme,
  Container,
  Flex,
} from "@chakra-ui/react"
import Navbar from "./Components/Navbar";
import MainContainer from "./Components/MainContainer";
import Footer from "./Components/Footer";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box flex="1" fontSize="xl">
        <Container maxW="container.xl" p={6}>
          <MainContainer />
        </Container>
      </Box>
      <Footer />
    </Flex>
  </ChakraProvider>
)
