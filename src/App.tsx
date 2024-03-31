import * as React from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  theme, Container,
} from "@chakra-ui/react"
import Navbar from "./Components/Navbar";
import MainContainer from "./Components/MainContainer";
import {Footer} from "./Components/Footer";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Navbar/>
    <Box textAlign="center" fontSize="xl">
      <Container p={3}>
          <MainContainer/>
      </Container>
    </Box>
      {/*<Footer/>*/}
  </ChakraProvider>
)
