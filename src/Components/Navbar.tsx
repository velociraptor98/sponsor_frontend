import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { SearchMark } from "./Icons";

interface NavbarProps {
  /** Extra content for the bar, e.g. the results screen's search field. */
  slot?: React.ReactNode;
}

export const Wordmark = () => (
  <HStack spacing="10px" flexShrink={0}>
    <Flex
      align="center"
      justify="center"
      w="30px"
      h="30px"
      borderRadius="9px"
      bg="text"
      color="accent"
    >
      <SearchMark size={16} strokeWidth={2.6} />
    </Flex>
    <Text
      fontFamily="heading"
      fontWeight={800}
      fontSize="19px"
      letterSpacing="-0.03em"
      lineHeight={1}
    >
      sponsrr
    </Text>
  </HStack>
);

export default function Navbar({ slot }: NavbarProps) {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="rgba(244, 245, 247, 0.85)"
      backdropFilter="saturate(180%) blur(12px)"
      borderBottom="1px solid"
      borderColor={slot ? "border" : "transparent"}
      px={{ base: 4, md: 6 }}
      py="12px"
    >
      <Flex align="center" wrap="wrap" gap={{ base: 3, md: 6 }} minH="38px">
        <Box mr={slot ? 0 : "auto"}>
          <Wordmark />
        </Box>

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
