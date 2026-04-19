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

  return (
    <Box
      bg={useColorModeValue(
        "rgba(255, 255, 255, 0.8)",
        "rgba(23, 25, 35, 0.8)",
      )}
      px={8}
      position="sticky"
      top="0"
      zIndex="sticky"
      backdropFilter="blur(10px)"
      borderBottom="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={8} alignItems={"center"}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            bgGradient="linear(to-r, blue.400, teal.400)"
            bgClip="text"
            letterSpacing="tight"
          >
            Sponsor List Viewer
          </Text>
        </HStack>

        <Flex alignItems={"center"}>
          <Stack direction={"row"} spacing={4}>
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
