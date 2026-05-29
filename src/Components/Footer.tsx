import {
  Box,
  Container,
  Text,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";

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
        <Flex direction={{ base: "column", md: "row" }} justify="center" align="center">
          <Text
            fontSize="sm"
            fontWeight="bold"
            bgGradient={gradient}
            bgClip="text"
            letterSpacing="tight"
          >
            Made with ❤️, hope this helps in your search
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
