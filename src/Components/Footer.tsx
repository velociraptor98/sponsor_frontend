import { Box, Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => (
  <Box as="footer" px={{ base: 4, md: 6 }} py={6}>
    <Flex
      direction={{ base: "column", md: "row" }}
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      gap={2}
      fontSize="13px"
      color="faint"
    >
      <Text>
        Not affiliated with the Home Office. Being on this list doesn't mean a
        company is hiring.
      </Text>
      <Link
        href="https://github.com/velociraptor98/sponsor_frontend"
        isExternal
        fontWeight={500}
        color="muted"
        _hover={{ color: "text" }}
      >
        GitHub
      </Link>
    </Flex>
  </Box>
);

export default Footer;
