import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCloudUploadAlt, FaDownload } from "react-icons/fa";
import Papa from "papaparse";
import FileUploader from "./FileUploader";
import SponsorTable from "./SponsorTable";

const MainContainer = () => {
  const [col, setCol] = useState<string[]>([]);
  const [val, setVal] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const setColumn = (value: string[]): any => setCol(value);
  const setValue  = (value: string[][]): any => setVal(value);

  const heroBg     = useColorModeValue("#f4f0d9", "#343f44");
  const heroBorder = useColorModeValue("#e0dcc9", "#475258");
  const subtleText = useColorModeValue("#829181", "#9da9a0");
  const dividerColor = useColorModeValue("#c9c19f", "#56635f");
  const iconBg     = useColorModeValue("#e8e4ca", "#3d484d");
  const iconColor  = useColorModeValue("#8da101", "#a7c080");
  const gradient   = useColorModeValue(
    "linear(to-r, #8da101, #35a77c)",
    "linear(to-r, #a7c080, #83c092)"
  );

  const loadCurrentList = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/current_list.csv");
      const text = await response.text();
      Papa.parse<string[]>(text, {
        complete: (results) => {
          const data = results.data;
          if (data.length > 0) {
            setCol(data[0]);
            setVal(data.slice(1).filter((row) => row.some((cell) => cell.trim() !== "")));
          }
        },
      });
    } catch {
      // file unavailable — do nothing
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!val.length && (
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="65vh"
          bg={heroBg}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor={heroBorder}
          p={12}
          gap={10}
        >
          <VStack spacing={6} textAlign="center">
            <Box bg={iconBg} p={5} borderRadius="2xl">
              <Icon as={FaCloudUploadAlt} w={12} h={12} color={iconColor} />
            </Box>
            <VStack spacing={3}>
              <Heading
                size="xl"
                fontWeight="700"
                bgGradient={gradient}
                bgClip="text"
              >
                Sponsor List Viewer
              </Heading>
              <Text color={subtleText} maxW="sm" fontSize="md" lineHeight="tall">
                Load the current sponsor list or upload your own CSV file
              </Text>
            </VStack>
          </VStack>

          <VStack spacing={4} w="full" maxW="xs">
            <Button
              colorScheme="forest"
              variant="solid"
              size="lg"
              leftIcon={<Icon as={FaDownload} />}
              onClick={loadCurrentList}
              isLoading={isLoading}
              loadingText="Loading..."
              w="full"
              shadow="md"
              _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              Load Current List
            </Button>

            <HStack w="full" align="center">
              <Divider borderColor={dividerColor} />
              <Text fontSize="xs" color={subtleText} whiteSpace="nowrap" px={2}>
                or
              </Text>
              <Divider borderColor={dividerColor} />
            </HStack>

            <FileUploader setCol={setColumn} setVal={setValue} />
          </VStack>
        </Flex>
      )}
      {!!val.length && (
        <SponsorTable cols={col} values={val} />
      )}
    </>
  );
};

export default MainContainer;
