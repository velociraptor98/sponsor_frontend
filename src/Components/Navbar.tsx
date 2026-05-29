import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Text,
  HStack,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const gradient = useColorModeValue(
    "linear(to-r, #8da101, #35a77c)",
    "linear(to-r, #a7c080, #83c092)"
  );

  return (
    <Box
      layerStyle="glassStrong"
      px={8}
      position="sticky"
      top="0"
      zIndex="sticky"
      borderWidth="0"
      borderBottomWidth="1px"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Text
            fontSize="xl"
            fontWeight="bold"
            bgGradient={gradient}
            bgClip="text"
            letterSpacing="tight"
          >
            Sponsrr
          </Text>
        </HStack>

        <Flex alignItems="center">
          <Stack direction="row" spacing={4}>
            <Button
              onClick={toggleColorMode}
              variant="glass"
              aria-label="Toggle Color Mode"
            >
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
