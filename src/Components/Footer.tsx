import {
  Box,
  Container,
  Text,
  Flex,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Footer = () => (
  <Box
    as="footer"
    borderTopWidth="1px"
    borderColor="border"
    py={6}
  >
    <Container maxW="container.xl">
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        gap={3}
        position="relative"
      >
        <Text fontSize="sm" color="text-body">
          Made with ❤️, hope this helps in your search
        </Text>

        <IconButton
          as={Link}
          href="https://github.com/velociraptor98/sponsor_frontend"
          isExternal
          aria-label="View source on GitHub"
          icon={<FaGithub />}
          variant="ghost"
          size="sm"
          fontSize="xl"
          position={{ base: "static", md: "absolute" }}
          right={{ md: 0 }}
        />
      </Flex>
    </Container>
  </Box>
);

export default Footer;
