import { Box, Flex, HStack, Text } from "@chakra-ui/react";

/**
 * The masthead: wordmark set in the heading face at 800, the register named
 * beside it in the system's monospaced voice, and the 2px rule that separates
 * every major division in the system.
 *
 * `slot` takes whatever the current screen needs to put in the bar — the
 * results screen puts its search field there.
 */

interface NavbarProps {
  slot?: React.ReactNode;
}

export default function Navbar({ slot }: NavbarProps) {
  return (
    <Box
      as="header"
      bg="bg"
      position="sticky"
      top="0"
      zIndex="sticky"
      borderBottom="2px solid"
      borderColor="divider"
      px={{ base: 4, md: 8 }}
      py={slot ? "10px" : "14px"}
    >
      <Flex align="center" wrap="wrap" gap={3} minH="40px">
        <HStack spacing={3} align="baseline" flexShrink={0} mr="auto">
          <Text textStyle="wordmark" fontSize={{ base: "15px", md: "20px" }}>
            SPONSRR
          </Text>
          <Text
            textStyle="kicker"
            display={{ base: "none", lg: "block" }}
            whiteSpace="nowrap"
          >
            UK Register of Licensed Sponsors
          </Text>
        </HStack>

        {/* Wide enough to be usable or it drops to its own full-width line. */}
        {slot && (
          <Box flex="1 1 300px" minW={0}>
            {slot}
          </Box>
        )}
      </Flex>
    </Box>
  );
}
