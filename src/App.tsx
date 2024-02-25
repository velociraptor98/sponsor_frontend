import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme, Heading, HStack, Container,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import Navbar from "./Components/Navbar";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Navbar/>
    <Box textAlign="center" fontSize="xl">
      <Container minH="100vh" p={3}>
        <HStack><ColorModeSwitcher justifySelf="flex-end" />
          <Heading>Sponsor List Viewer</Heading>
        </HStack>

        <VStack spacing={8}>

        </VStack>
      </Container>
    </Box>
  </ChakraProvider>
)
