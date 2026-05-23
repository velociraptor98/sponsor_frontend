import {
  Box,
  Container,
  Text,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";

const Footer = () => {
  const footerBg    = useColorModeValue("#f4f0d9", "#272e33");
  const footerColor = useColorModeValue("#5c6a72", "#d3c6aa");
  const borderColor = useColorModeValue("#e0dcc9", "#475258");
  const gradient    = useColorModeValue(
    "linear(to-r, #8da101, #35a77c)",
    "linear(to-r, #a7c080, #83c092)"
  );

  return (
    <Box
      as="footer"
      bg={footerBg}
      color={footerColor}
      borderTop="1px"
      borderColor={borderColor}
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
