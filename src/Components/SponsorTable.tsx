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
  useColorModeValue,
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
  FaSearchMinus,
} from "react-icons/fa";

const PAGE_SIZE_OPTIONS = [15, 25, 50, 100];

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

  // Everforest tokens + glass-aware table surfaces
  const borderColor = useColorModeValue("#e0dcc9", "#475258");
  const mutedColor = useColorModeValue("#829181", "#7a8478");
  const fgColor = useColorModeValue("#5c6a72", "#d3c6aa");
  const inputBg = useColorModeValue("rgba(253, 246, 227, 0.65)", "rgba(45, 53, 59, 0.5)");
  const panelBg = useColorModeValue("rgba(253, 246, 227, 0.6)", "rgba(45, 53, 59, 0.5)");
  const headerBg = useColorModeValue("rgba(141, 161, 1, 0.07)", "rgba(167, 192, 128, 0.07)");
  const rowEvenBg = useColorModeValue("rgba(92, 106, 114, 0.045)", "rgba(255, 255, 255, 0.035)");
  const rowHoverBg = useColorModeValue("rgba(141, 161, 1, 0.14)", "rgba(167, 192, 128, 0.13)");
  const cellBorder = useColorModeValue("rgba(92, 106, 114, 0.12)", "rgba(255, 255, 255, 0.07)");
  const headBorder = useColorModeValue("rgba(141, 161, 1, 0.35)", "rgba(167, 192, 128, 0.3)");

  const chakraTheme = getTheme(DEFAULT_OPTIONS, { isVirtualized: true });

  const theme = useTheme([
    chakraTheme,
    {
      HeaderRow: `
        background-color: ${headerBg};
        backdrop-filter: blur(8px);
        font-weight: 800;
      `,
      Row: `
        background-color: transparent;
        color: ${fgColor};
        transition: background-color 0.15s ease;
        &:nth-of-type(even) {
          background-color: ${rowEvenBg};
        }
        &:hover {
          background-color: ${rowHoverBg} !important;
        }
      `,
      HeaderCell: `
        border-bottom: 2px solid ${headBorder} !important;
        padding: 16px 12px !important;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: ${mutedColor};
      `,
      Cell: `
        padding: 14px 12px !important;
        font-size: 14px;
        border-bottom: 1px solid ${cellBorder} !important;
        color: ${fgColor};
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

  const labelStyle = {
    fontSize: "xs" as const,
    fontWeight: "black" as const,
    textTransform: "uppercase" as const,
    color: mutedColor,
    mb: 0.5,
  };

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
          <FormLabel
            fontSize="xs"
            fontWeight="black"
            textTransform="uppercase"
            color={mutedColor}
            ml={1}
          >
            Search Sponsors
          </FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <FaSearch color={mutedColor} />
            </InputLeftElement>
            <Input
              placeholder="Search by company, town or county..."
              value={search}
              onChange={(e) => {
                goToPage(0);
                setSearch(e.target.value);
              }}
              bg={inputBg}
              color={fgColor}
              variant="outline"
              borderRadius="lg"
              borderColor={borderColor}
            />
          </InputGroup>
        </FormControl>
      </Flex>

      {/* Table / Cards */}
      <Box layerStyle="glass" borderRadius="xl" _before={{ display: "none" }}>
        {/* Pagination header */}
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: "column", md: "row" }}
          gap={3}
          px={6}
          py={4}
          borderBottomWidth="1px"
          borderColor={cellBorder}
          bg="transparent"
        >
          <HStack spacing={3}>
            <Tag
              colorScheme="forest"
              size="md"
              borderRadius="full"
              variant="subtle"
            >
              {totalResults} Results
            </Tag>
            {!isEmpty && (
              <Text fontSize="xs" color={mutedColor} whiteSpace="nowrap">
                Showing {rangeStart}–{rangeEnd}
              </Text>
            )}
          </HStack>

          <HStack spacing={{ base: 2, md: 4 }} flexWrap="wrap" justify="center">
            <HStack spacing={2}>
              <Text fontSize="xs" color={mutedColor} whiteSpace="nowrap">
                Rows
              </Text>
              <Select
                size="sm"
                width="auto"
                borderRadius="md"
                borderColor={borderColor}
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
              <Text fontSize="sm" fontWeight="medium" color={mutedColor} whiteSpace="nowrap">
                Page
              </Text>
              <Input
                size="sm"
                width="14"
                textAlign="center"
                borderRadius="md"
                borderColor={borderColor}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={() => goToPage((Number(pageInput) || 1) - 1)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToPage((Number(pageInput) || 1) - 1);
                }}
                aria-label="Go to page"
              />
              <Text fontSize="sm" fontWeight="medium" color={mutedColor} whiteSpace="nowrap">
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
          /* No-results empty state */
          <Flex
            direction="column"
            align="center"
            justify="center"
            textAlign="center"
            py={20}
            px={6}
            gap={4}
            bg={panelBg}
          >
            <Box as={FaSearchMinus} fontSize="3xl" color={mutedColor} />
            <Box>
              <Text fontWeight="700" fontSize="lg" color={fgColor}>
                No sponsors found
              </Text>
              <Text fontSize="sm" color={mutedColor} mt={1}>
                {search
                  ? `Nothing matches "${search}". Try a different company, town or county.`
                  : "There are no records to display."}
              </Text>
            </Box>
            {search && (
              <Button
                colorScheme="forest"
                variant="outline"
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
          <Stack
            spacing={0}
            bg={panelBg}
            divider={<Divider borderColor={cellBorder} />}
          >
            {currentPageNodes.map((item, i) => (
              <Box
                key={item.id}
                px={5}
                py={4}
                bg={i % 2 === 0 ? "transparent" : rowEvenBg}
                transition="background-color 0.15s ease"
                _hover={{ bg: rowHoverBg }}
              >
                <Text fontWeight="700" fontSize="md" color={fgColor} mb={3}>
                  {item.org}
                </Text>
                <SimpleGrid columns={2} spacingX={6} spacingY={3}>
                  <Box>
                    <Text {...labelStyle}>{cols[1]}</Text>
                    <Text fontSize="sm" color={fgColor}>{item.town}</Text>
                  </Box>
                  <Box>
                    <Text {...labelStyle}>{cols[2]}</Text>
                    <Text fontSize="sm" color={fgColor}>{item.county}</Text>
                  </Box>
                  <Box>
                    <Text {...labelStyle}>{cols[3]}</Text>
                    <Text fontSize="sm" color={fgColor}>{item.type}</Text>
                  </Box>
                  <Box>
                    <Text {...labelStyle}>{cols[4]}</Text>
                    <Text fontSize="sm" color={fgColor}>{item.route}</Text>
                  </Box>
                </SimpleGrid>
              </Box>
            ))}
          </Stack>
        ) : (
          /* Table layout for desktop */
          <Box overflowX="auto" bg={panelBg}>
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
