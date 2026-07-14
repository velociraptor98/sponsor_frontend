import { useState, useMemo, useEffect } from "react";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  useBreakpointValue,
  Tag,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/chakra-ui";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";
import { Breath } from "./Breath";

const PAGE_SIZE_OPTIONS = [15, 25, 50, 100];

// The table library takes plain CSS strings, so the brand tokens are referenced
// through the custom properties Chakra emits for them. They track colour mode
// on their own, which keeps the palette defined in exactly one place.
const token = {
  text: "var(--chakra-colors-text)",
  textBody: "var(--chakra-colors-text-body)",
  textMuted: "var(--chakra-colors-text-muted)",
  border: "var(--chakra-colors-border)",
  borderStrong: "var(--chakra-colors-border-strong)",
  accentSoft: "var(--chakra-colors-accent-soft)",
  rowAlt: "var(--chakra-colors-row-alt)",
  surfaceRaised: "var(--chakra-colors-surface-raised)",
};

interface SponsorTableProps {
  cols: string[];
  values: string[][];
}

const SponsorTable = ({ cols, values }: SponsorTableProps) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [pageInput, setPageInput] = useState("1");

  const isMobile = useBreakpointValue({ base: true, md: false });

  const chakraTheme = getTheme(DEFAULT_OPTIONS, { isVirtualized: true });

  const theme = useTheme([
    chakraTheme,
    {
      HeaderRow: `
        background-color: ${token.surfaceRaised};
      `,
      Row: `
        background-color: transparent;
        color: ${token.textBody};
        transition: background-color 0.15s ease;
        &:nth-of-type(even) {
          background-color: ${token.rowAlt};
        }
        &:hover {
          background-color: ${token.accentSoft} !important;
        }
      `,
      // The system voice: labels, captions, metadata.
      HeaderCell: `
        border-bottom: 1px solid ${token.borderStrong} !important;
        padding: 16px 12px !important;
        font-family: 'Space Mono', ui-monospace, monospace;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: ${token.textMuted};
      `,
      Cell: `
        padding: 14px 12px !important;
        font-size: 14px;
        border-bottom: 1px solid ${token.border} !important;
        color: ${token.textBody};
      `,
    },
  ]);

  // Filtering 140k rows on every keystroke is too slow, so the filter runs
  // against a debounced copy of the search text.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(timer);
  }, [search]);

  const allNodes = useMemo(
    () =>
      values.map((val, index) => ({
        id: index,
        org: val[0],
        town: val[1],
        county: val[2],
        type: val[3],
        route: val[4],
      })),
    [values],
  );

  const filteredNodes = useMemo(() => {
    const searchTerm = debouncedSearch.trim().toLowerCase();
    if (searchTerm === "") return allNodes;
    return allNodes.filter(
      (item) =>
        (item.org && item.org.toLowerCase().includes(searchTerm)) ||
        (item.town && item.town.toLowerCase().includes(searchTerm)) ||
        (item.county && item.county.toLowerCase().includes(searchTerm)),
    );
  }, [allNodes, debouncedSearch]);

  const totalResults = filteredNodes.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  // Clamp in case filtering shrank the result set below the current page.
  const currentPage = Math.min(page, totalPages - 1);

  const goToPage = (next: number) => {
    const clamped = Math.max(0, Math.min(next, totalPages - 1));
    setPage(clamped);
    setPageInput(String(clamped + 1));
  };

  const currentPageNodes = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredNodes.slice(start, start + pageSize);
  }, [filteredNodes, currentPage, pageSize]);

  const tableData = useMemo(
    () => ({ nodes: currentPageNodes }),
    [currentPageNodes],
  );

  const isEmpty = totalResults === 0;
  const rangeStart = isEmpty ? 0 : currentPage * pageSize + 1;
  const rangeEnd = Math.min((currentPage + 1) * pageSize, totalResults);

  return (
    <Stack spacing={6} width="100%" maxW="100%" mx="auto">
      {/* Filters */}
      <Flex
        layerStyle="glass"
        direction={{ base: "column", md: "row" }}
        gap={4}
        align={{ base: "stretch", md: "flex-end" }}
        p={6}
        borderRadius="xl"
      >
        <FormControl flex={2}>
          <FormLabel ml={1}>Search Sponsors</FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none" color="text-muted">
              <FaSearch />
            </InputLeftElement>
            <Input
              placeholder="Search by company, town or county..."
              value={search}
              onChange={(e) => {
                goToPage(0);
                setSearch(e.target.value);
              }}
              borderRadius="lg"
            />
          </InputGroup>
        </FormControl>
      </Flex>

      {/* Table / Cards */}
      <Box layerStyle="panel" borderRadius="xl" overflow="hidden">
        {/* Pagination header */}
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: "column", md: "row" }}
          gap={3}
          px={6}
          py={4}
          borderBottomWidth="1px"
          borderColor="border"
        >
          <HStack spacing={3}>
            <Tag
              size="md"
              borderRadius="full"
              bg="accent-soft"
              color="accent-strong"
              fontSize="xs"
            >
              {totalResults} results
            </Tag>
            {!isEmpty && (
              <Text textStyle="meta" whiteSpace="nowrap">
                {rangeStart}–{rangeEnd}
              </Text>
            )}
          </HStack>

          <HStack spacing={{ base: 2, md: 4 }} flexWrap="wrap" justify="center">
            <HStack spacing={2}>
              <Text textStyle="meta" whiteSpace="nowrap">
                rows
              </Text>
              <Select
                size="sm"
                width="auto"
                borderRadius="md"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  goToPage(0);
                }}
                aria-label="Rows per page"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </HStack>

            <HStack spacing={2}>
              <Text textStyle="meta" whiteSpace="nowrap">
                page
              </Text>
              <Input
                size="sm"
                width="14"
                textAlign="center"
                borderRadius="md"
                fontFamily="mono"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={() => goToPage((Number(pageInput) || 1) - 1)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToPage((Number(pageInput) || 1) - 1);
                }}
                aria-label="Go to page"
              />
              <Text textStyle="meta" whiteSpace="nowrap">
                of {totalPages}
              </Text>
            </HStack>

            <HStack spacing={1}>
              <IconButton
                aria-label="first page"
                icon={<FaAngleDoubleLeft />}
                size="sm"
                variant="ghost"
                isDisabled={currentPage === 0}
                onClick={() => goToPage(0)}
              />
              <IconButton
                aria-label="previous page"
                icon={<FaChevronLeft />}
                size="sm"
                variant="ghost"
                isDisabled={currentPage === 0}
                onClick={() => goToPage(currentPage - 1)}
              />
              <IconButton
                aria-label="next page"
                icon={<FaChevronRight />}
                size="sm"
                variant="ghost"
                isDisabled={currentPage + 1 >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
              />
              <IconButton
                aria-label="last page"
                icon={<FaAngleDoubleRight />}
                size="sm"
                variant="ghost"
                isDisabled={currentPage + 1 >= totalPages}
                onClick={() => goToPage(totalPages - 1)}
              />
            </HStack>
          </HStack>
        </Flex>

        {isEmpty ? (
          /* No-results empty state — the breath, held. */
          <Flex
            direction="column"
            align="center"
            justify="center"
            textAlign="center"
            py={20}
            px={6}
            gap={5}
          >
            <Box fontSize="48px" opacity={0.5}>
              <Breath dots={2} />
            </Box>
            <Box>
              <Text fontWeight={600} fontSize="lg" color="text">
                No sponsors found
              </Text>
              <Text fontSize="sm" color="text-body" mt={1}>
                {search
                  ? `Nothing matches "${search}". Try a different company, town or county.`
                  : "There are no records to display."}
              </Text>
            </Box>
            {search && (
              <Button
                variant="quiet"
                size="sm"
                onClick={() => {
                  setSearch("");
                  goToPage(0);
                }}
              >
                Clear search
              </Button>
            )}
          </Flex>
        ) : isMobile ? (
          /* Card layout for mobile */
          <Stack spacing={0} divider={<Divider borderColor="border" />}>
            {currentPageNodes.map((item, i) => (
              <Box
                key={item.id}
                px={5}
                py={4}
                bg={i % 2 === 0 ? "transparent" : "row-alt"}
                transition="background-color 0.15s ease"
                _hover={{ bg: "accent-soft" }}
              >
                <Text fontWeight={600} fontSize="md" color="text" mb={3}>
                  {item.org}
                </Text>
                <SimpleGrid columns={2} spacingX={6} spacingY={3}>
                  {[
                    [cols[1], item.town],
                    [cols[2], item.county],
                    [cols[3], item.type],
                    [cols[4], item.route],
                  ].map(([label, value]) => (
                    <Box key={label}>
                      <Text textStyle="label" mb={0.5}>
                        {label}
                      </Text>
                      <Text fontSize="sm" color="text-body">
                        {value}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </Stack>
        ) : (
          /* Table layout for desktop */
          <Box overflowX="auto">
            <Table
              data={tableData}
              theme={theme}
              layout={{ isDiv: true, fixedHeader: true }}
            >
              {(tableList: any) => (
                <>
                  <Header>
                    <HeaderRow>
                      {cols.map((value) => (
                        <HeaderCell key={value}>{value}</HeaderCell>
                      ))}
                    </HeaderRow>
                  </Header>
                  <Body>
                    {tableList.map((item: any) => (
                      <Row key={item.id} item={item}>
                        <Cell>{item.org}</Cell>
                        <Cell>{item.town}</Cell>
                        <Cell>{item.county}</Cell>
                        <Cell>{item.type}</Cell>
                        <Cell>{item.route}</Cell>
                      </Row>
                    ))}
                  </Body>
                </>
              )}
            </Table>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default SponsorTable;
