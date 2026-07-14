import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import { Breath } from "./Breath";

export default function Navbar() {
  return (
    <Box
      layerStyle="glassStrong"
      px={{ base: 5, md: 8 }}
      position="sticky"
      top="0"
      zIndex="sticky"
      borderWidth="0"
      borderBottomWidth="1px"
      borderColor="border"
    >
      <Flex h={16} align="center">
        <HStack spacing={0} align="center" fontSize="xl">
          <Text fontWeight={600} color="text" letterSpacing="-0.01em">
            Sponsrr
          </Text>
          <Breath ml="0.5em" />
        </HStack>
      </Flex>
    </Box>
  );
}
