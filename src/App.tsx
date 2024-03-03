import * as React from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  theme, Container,
} from "@chakra-ui/react"
import Navbar from "./Components/Navbar";
import MainContainer from "./Components/MainContainer";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Navbar/>
    <Box textAlign="center" fontSize="xl">
      <Container minH="100vh" p={3}>
          <MainContainer/>
        <VStack spacing={8}>
        </VStack>
      </Container>
    </Box>
  </ChakraProvider>
)
