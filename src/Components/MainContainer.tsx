import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Papa from "papaparse";
import Navbar from "./Navbar";
import Hero from "./Hero";
import SponsorTable from "./SponsorTable";
import { ArrowLeftMark, SearchMark, WarningMark } from "./Icons";
import { type Sponsor, tally, tallyMany, toSponsors } from "../register";

const formatUpdated = (header: string | null) => {
  if (!header) return "";
  const date = new Date(header);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const MainContainer = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [updated, setUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [query, setQuery] = useState("");

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();

  const showError = useCallback(
    (message: string) => {
      setIsLoading(false);
      setErrorMessage(message);
      onErrorOpen();
    },
    [onErrorOpen],
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/current_list.csv");
        if (!response.ok) {
          showError(
            `Could not fetch the sponsor list (HTTP ${response.status} ${response.statusText}).`,
          );
          return;
        }
        if (!cancelled) setUpdated(formatUpdated(response.headers?.get?.("last-modified") ?? null));
        const text = await response.text();
        // The list is ~140k rows; parse in a worker so the UI stays responsive.
        // With worker: true the callbacks are async, so the loading state is
        // cleared there rather than in a finally block.
        Papa.parse<string[]>(text, {
          worker: true,
          complete: (results) => {
            if (cancelled) return;
            setIsLoading(false);
            const data = results.data;
            if (data.length <= 1) {
              showError("The sponsor list is empty. Please try again later.");
              return;
            }
            setSponsors(
              toSponsors(
                data
                  .slice(1)
                  .filter((row) => row.some((cell) => cell.trim() !== "")),
              ),
            );
          },
          error: (err: Error) => {
            if (!cancelled) showError(`Failed to parse the CSV file: ${err.message}`);
          },
        });
      } catch (err) {
        if (cancelled) return;
        showError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while loading the list.",
        );
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [showError]);

  const routeFacets = useMemo(
    () => tallyMany(sponsors, (s) => s.routes),
    [sponsors],
  );
  const townFacets = useMemo(() => tally(sponsors, (s) => s.town), [sponsors]);

  return (
    <Flex direction="column" flex="1" minH={0}>
      <Navbar
        slot={
          showResults ? (
            <Flex align="center" gap={2} flex="1">
              <Flex
                align="center"
                gap={2}
                flex="1"
                minW={0}
                maxW="560px"
                pl={3}
                bg="subtle"
                borderRadius="md"
                border="1px solid"
                borderColor="transparent"
                _focusWithin={{
                  bg: "surface",
                  borderColor: "text",
                  boxShadow: "0 0 0 3px var(--chakra-colors-lime-200)",
                }}
              >
                <Box color="faint">
                  <SearchMark size={16} />
                </Box>
                <Input
                  variant="bare"
                  h="38px"
                  px={1}
                  fontSize="14px"
                  placeholder="Company, town or county"
                  aria-label="Search sponsors"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </Flex>
              <Button
                variant="ghost"
                leftIcon={<ArrowLeftMark size={15} />}
                onClick={() => setShowResults(false)}
                flexShrink={0}
                ml="auto"
              >
                Start over
              </Button>
            </Flex>
          ) : undefined
        }
      />

      {showResults ? (
        <SponsorTable
          sponsors={sponsors}
          query={query}
          isLoading={isLoading}
        />
      ) : (
        <Hero
          total={isLoading && sponsors.length === 0 ? null : sponsors.length}
          routes={routeFacets}
          popular={townFacets.slice(0, 5)}
          updated={updated}
          onSearch={(value) => {
            setQuery(value);
            setShowResults(true);
          }}
        />
      )}

      <Modal isCentered isOpen={isErrorOpen} onClose={onErrorClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center" gap={3}>
            <Flex
              as="span"
              align="center"
              justify="center"
              w="36px"
              h="36px"
              borderRadius="md"
              bg="#fdecea"
              color="#c4321c"
            >
              <WarningMark size={18} />
            </Flex>
            Couldn't load the list
          </ModalHeader>
          <ModalBody>
            <Text fontSize="14px" color="muted">
              {errorMessage}
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant="primary" onClick={onErrorClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MainContainer;
