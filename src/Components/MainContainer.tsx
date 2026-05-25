import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaCloudUploadAlt,
  FaDownload,
  FaExclamationTriangle,
} from "react-icons/fa";
import Papa from "papaparse";
import FileUploader from "./FileUploader";
import SponsorTable from "./SponsorTable";

const heroVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const MainContainer = () => {
  const [col, setCol] = useState<string[]>([]);
  const [val, setVal] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();

  const setColumn = (value: string[]): any => setCol(value);
  const setValue = (value: string[][]): any => setVal(value);

  const heroBg = useColorModeValue("#f4f0d9", "#343f44");
  const heroBorder = useColorModeValue("#e0dcc9", "#475258");
  const subtleText = useColorModeValue("#829181", "#9da9a0");
  const dividerColor = useColorModeValue("#c9c19f", "#56635f");
  const iconBg = useColorModeValue("#e8e4ca", "#3d484d");
  const iconColor = useColorModeValue("#8da101", "#a7c080");
  const gradient = useColorModeValue(
    "linear(to-r, #8da101, #35a77c)",
    "linear(to-r, #a7c080, #83c092)",
  );
  const modalBg = useColorModeValue("#fdf6e3", "#343f44");
  const modalText = useColorModeValue("#5c6a72", "#d3c6aa");
  const footerBg = useColorModeValue("#f4f0d9", "#3d484d");

  const showError = (message: string) => {
    setErrorMessage(message);
    onErrorOpen();
  };

  const loadCurrentList = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/current_list.csv");
      if (!response.ok) {
        showError(
          `Could not fetch the sponsor list (HTTP ${response.status} ${response.statusText}).`,
        );
        return;
      }
      const text = await response.text();
      Papa.parse<string[]>(text, {
        complete: (results) => {
          const data = results.data;
          if (data.length > 0) {
            setCol(data[0]);
            setVal(
              data
                .slice(1)
                .filter((row) => row.some((cell) => cell.trim() !== "")),
            );
          } else {
            showError(
              "There is an issue with the file present, please upload your own copy",
            );
          }
        },
        error: (err: Error) => {
          showError(`Failed to parse the CSV file: ${err.message}`);
        },
      });
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while loading the list.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!val.length ? (
          <motion.div
            key="hero"
            variants={heroVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
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
                <motion.div variants={itemVariants}>
                  <Box bg={iconBg} p={5} borderRadius="2xl">
                    <Icon
                      as={FaCloudUploadAlt}
                      w={12}
                      h={12}
                      color={iconColor}
                    />
                  </Box>
                </motion.div>
                <VStack spacing={3}>
                  <motion.div variants={itemVariants}>
                    <Heading
                      size="xl"
                      fontWeight="700"
                      bgGradient={gradient}
                      bgClip="text"
                    >
                      Sponsrr
                    </Heading>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Text
                      color={subtleText}
                      maxW="sm"
                      fontSize="md"
                      lineHeight="tall"
                    >
                      Load the current sponsor list or upload your own CSV file
                    </Text>
                  </motion.div>
                </VStack>
              </VStack>

              <motion.div
                variants={itemVariants}
                style={{ width: "100%", maxWidth: "320px" }}
              >
                <VStack spacing={4} w="full">
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
                    <Text
                      fontSize="xs"
                      color={subtleText}
                      whiteSpace="nowrap"
                      px={2}
                    >
                      or
                    </Text>
                    <Divider borderColor={dividerColor} />
                  </HStack>

                  <FileUploader setCol={setColumn} setVal={setValue} />
                </VStack>
              </motion.div>
            </Flex>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <SponsorTable cols={col} values={val} />
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isCentered isOpen={isErrorOpen} onClose={onErrorClose} size="sm">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" bg={modalBg} color={modalText}>
          <ModalHeader display="flex" alignItems="center" gap={3} pt={8}>
            <Icon as={FaExclamationTriangle} color="red.400" />
            Failed to load
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text fontSize="sm" lineHeight="tall">
              {errorMessage}
            </Text>
          </ModalBody>
          <ModalFooter bg={footerBg} borderBottomRadius="xl">
            <Button variant="ghost" onClick={onErrorClose}>
              Dismiss
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MainContainer;
