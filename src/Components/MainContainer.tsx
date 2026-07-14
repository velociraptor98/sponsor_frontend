import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Flex,
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
  useDisclosure,
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import Papa from "papaparse";
import HeroIllustration from "./HeroIllustration";
import SponsorTable from "./SponsorTable";
import { Breath } from "./Breath";

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

  const resetList = () => {
    setCol([]);
    setVal([]);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    onErrorOpen();
  };

  const loadCurrentList = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/current_list.csv");
      if (!response.ok) {
        setIsLoading(false);
        showError(
          `Could not fetch the sponsor list (HTTP ${response.status} ${response.statusText}).`,
        );
        return;
      }
      const text = await response.text();
      // The list is ~140k rows; parse in a worker so the UI stays responsive.
      // With worker: true the callbacks are async, so the loading state is
      // cleared there rather than in a finally block.
      Papa.parse<string[]>(text, {
        worker: true,
        complete: (results) => {
          setIsLoading(false);
          const data = results.data;
          if (data.length > 0) {
            setCol(data[0]);
            setVal(
              data
                .slice(1)
                .filter((row) => row.some((cell) => cell.trim() !== "")),
            );
          } else {
            showError("The sponsor list is empty. Please try again later.");
          }
        },
        error: (err: Error) => {
          setIsLoading(false);
          showError(`Failed to parse the CSV file: ${err.message}`);
        },
      });
    } catch (err) {
      setIsLoading(false);
      showError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while loading the list.",
      );
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
              layerStyle="glass"
              direction="column"
              align="center"
              justify="center"
              minH="65vh"
              borderRadius="2xl"
              p={12}
              gap={10}
            >
              <VStack spacing={8} textAlign="center">
                <motion.div variants={itemVariants}>
                  <HeroIllustration />
                </motion.div>
                <VStack spacing={3}>
                  <motion.div variants={itemVariants}>
                    <Heading size="xl">Sponsrr</Heading>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Text
                      color="text-body"
                      maxW="sm"
                      fontSize="md"
                      lineHeight="tall"
                    >
                      Search the UK register of licensed visa sponsors
                    </Text>
                  </motion.div>
                </VStack>
              </VStack>

              <motion.div
                variants={itemVariants}
                style={{ width: "100%", maxWidth: "320px" }}
              >
                <Button
                  variant="breath"
                  size="lg"
                  rightIcon={<Icon as={FaArrowRight} />}
                  onClick={loadCurrentList}
                  isLoading={isLoading}
                  loadingText="Loading"
                  // The breath is the loading rhythm.
                  spinner={
                    <Breath animate color="text-on-accent" fontSize="xl" />
                  }
                  w="full"
                  boxShadow="paper-sm"
                  _hover={{ boxShadow: "paper", transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                >
                  Get Started
                </Button>
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
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Icon as={FaArrowLeft} />}
              onClick={resetList}
              mb={4}
            >
              Start Page
            </Button>
            <SponsorTable cols={col} values={val} />
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isCentered isOpen={isErrorOpen} onClose={onErrorClose} size="sm">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center" gap={3} pt={8}>
            <Icon as={FaExclamationTriangle} color="accent" />
            Failed to load
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text fontSize="sm" lineHeight="tall">
              {errorMessage}
            </Text>
          </ModalBody>
          <ModalFooter>
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
