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
import { ArrowLeftMark, WarningMark } from "./Icons";
import { type Sponsor, tally, tallyMany, toSponsors } from "../register";

/**
 * Owns the register and which of the two screens is showing.
 *
 * The entry screen leads with the size of the register, so the file is read as
 * soon as the app mounts rather than behind a button — the parse runs in a
 * worker, so the screen stays live throughout and the counts simply arrive.
 * Searching from the entry screen hands the query to the results screen, which
 * holds the facets.
 */

const formatUpdated = (header: string | null) => {
  if (!header) return "";
  const date = new Date(header);
  if (Number.isNaN(date.getTime())) return "";
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
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
            <Flex align="center" gap={3} flex="1">
              <Flex border="2px solid" borderColor="text" flex="1" minW={0}>
                <Input
                  variant="bare"
                  h="38px"
                  fontSize="14px"
                  placeholder="Organisation, town or county"
                  aria-label="Search the register"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </Flex>
              <Button
                size="sm"
                leftIcon={<ArrowLeftMark size={13} />}
                onClick={() => setShowResults(false)}
                flexShrink={0}
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
            <Box as="span" color="accent">
              <WarningMark size={20} />
            </Box>
            Failed to load
          </ModalHeader>
          <ModalBody>
            <Text fontSize="14px" color="ink-70">
              {errorMessage}
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant="primary" onClick={onErrorClose}>
              Dismiss
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MainContainer;
