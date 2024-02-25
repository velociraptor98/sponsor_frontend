import * as React from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  theme, Container,
} from "@chakra-ui/react"
import Navbar from "./Components/Navbar";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Navbar/>
    <Box textAlign="center" fontSize="xl">
      <Container minH="100vh" p={3}>
        <VStack spacing={8}>
        </VStack>
      </Container>
    </Box>
  </ChakraProvider>
)
