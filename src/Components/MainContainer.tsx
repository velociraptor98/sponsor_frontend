import { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Icon,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import FileUploader from "./FileUploader";
import SponsorTable from "./SponsorTable";

const MainContainer = () => {
  const [col, setCol] = useState<string[]>([]);
  const [val, setVal] = useState<string[][]>([]);

  const setColumn = (value: string[]): any => setCol(value);
  const setValue  = (value: string[][]): any => setVal(value);

  const heroBg    = useColorModeValue("#f4f0d9", "#343f44");
  const heroBorder = useColorModeValue("#e0dcc9", "#475258");
  const subtleText = useColorModeValue("#829181", "#9da9a0");
  const iconBg    = useColorModeValue("#e8e4ca", "#3d484d");
  const iconColor = useColorModeValue("#8da101", "#a7c080");
  const gradient  = useColorModeValue(
    "linear(to-r, #8da101, #35a77c)",
    "linear(to-r, #a7c080, #83c092)"
  );

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
                Upload a CSV file to explore, search, and filter your sponsor data
              </Text>
            </VStack>
          </VStack>
          <FileUploader setCol={setColumn} setVal={setValue} />
        </Flex>
      )}
      {!!val.length && (
        <SponsorTable cols={col} values={val} />
      )}
    </>
  );
};

export default MainContainer;
