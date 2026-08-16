import { Box, Flex, Link, Text } from "@chakra-ui/react";

/**
 * Closes the page with the same 2px rule that opens it. The provenance of the
 * data is the point of the footer, so it leads; the colophon follows.
 */
const Footer = () => (
  <Box
    as="footer"
    borderTop="2px solid"
    borderColor="divider"
    px={{ base: 4, md: 8 }}
    py={5}
  >
    <Flex
      direction={{ base: "column", md: "row" }}
      align={{ base: "flex-start", md: "baseline" }}
      justify="space-between"
      gap={3}
    >
      <Text fontSize="12px" color="ink-60" maxW="72ch" lineHeight={1.5}>
        Not affiliated with the Home Office. A sponsor licence is not a job
        offer.
      </Text>

      <Flex align="baseline" gap={5} flexShrink={0}>
        <Text fontSize="12px" color="ink-60">
          Made with care — hope this helps in your search
        </Text>
        <Link
          href="https://github.com/velociraptor98/sponsor_frontend"
          isExternal
          textStyle="kicker"
          color="accent"
          _hover={{ color: "accent.700" }}
        >
          Source
        </Link>
      </Flex>
    </Flex>
  </Box>
);

export default Footer;
