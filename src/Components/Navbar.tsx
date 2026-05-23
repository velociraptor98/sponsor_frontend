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
  const navBg = useColorModeValue(
    "rgba(253, 246, 227, 0.85)",
    "rgba(45, 53, 59, 0.85)"
  );
  const borderColor = useColorModeValue("#e0dcc9", "#475258");
  const gradient = useColorModeValue(
    "linear(to-r, #8da101, #35a77c)",
    "linear(to-r, #a7c080, #83c092)"
  );

  return (
    <Box
      bg={navBg}
      px={8}
      position="sticky"
      top="0"
      zIndex="sticky"
      backdropFilter="blur(10px)"
      borderBottom="1px"
      borderColor={borderColor}
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
            Sponsor List Viewer
          </Text>
        </HStack>

        <Flex alignItems="center">
          <Stack direction="row" spacing={4}>
            <Button
              onClick={toggleColorMode}
              variant="ghost"
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
