import {
  Box,
  Container,
  Text,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box
      as="footer"
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      borderTop="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      py={6}
    >
      <Container maxW="container.xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="center"
          align="center"
        >
          <Text
            fontSize="sm"
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, teal.400)"
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

