import {
  Box,
  Container,
  Text,
  useColorModeValue,
  Flex,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  const footerColor = useColorModeValue("#5c6a72", "#d3c6aa");
  const gradient    = useColorModeValue(
    "linear(to-r, #8da101, #35a77c)",
    "linear(to-r, #a7c080, #83c092)"
  );

  return (
    <Box
      as="footer"
      layerStyle="glass"
      color={footerColor}
      borderWidth="0"
      borderTopWidth="1px"
      py={6}
    >
      <Container maxW="container.xl">
        <Flex direction={{ base: "column", md: "row" }} justify="center" align="center" gap={3} position="relative">
          <Text
            fontSize="sm"
            fontWeight="bold"
            bgGradient={gradient}
            bgClip="text"
            letterSpacing="tight"
          >
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
            color={footerColor}
            fontSize="xl"
            position={{ base: "static", md: "absolute" }}
            right={{ md: 0 }}
          />
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
