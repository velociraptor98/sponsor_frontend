import { useState, useMemo } from "react";
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
import { usePagination } from "@table-library/react-table-library/pagination";
import {
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  InputGroup,
  InputLeftElement,
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
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

interface SponsorTableProps {
  cols: string[];
  values: string[][];
}

const SponsorTable = ({ cols, values }: SponsorTableProps) => {
  const [currentSelection] = useState("-");
  const [search, setSearch] = useState("");

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

  const dataMapped = useMemo(() => {
    const nodes = values
      .map((val, index) => ({
        id: index,
        org: val[0],
        town: val[1],
        county: val[2],
        type: val[3],
        route: val[4],
      }))
      .filter((item) => {
        const matchesSelection =
          currentSelection === "-" || item.town === currentSelection;
        const searchTerm = search.toLowerCase();
        const matchesSearch =
          search === "" ||
          (item.org && item.org.toLowerCase().includes(searchTerm)) ||
          (item.town && item.town.toLowerCase().includes(searchTerm)) ||
          (item.county && item.county.toLowerCase().includes(searchTerm));

        return matchesSelection && matchesSearch;
      });
    return { nodes };
  }, [values, currentSelection, search]);

  const pagination = usePagination(dataMapped, {
    state: { page: 0, size: 15 },
  });

  const totalPages = pagination.state.getTotalPages(dataMapped.nodes);

  const currentPageNodes = useMemo(() => {
    const start = pagination.state.page * pagination.state.size;
    return dataMapped.nodes.slice(start, start + pagination.state.size);
  }, [dataMapped.nodes, pagination.state.page, pagination.state.size]);

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
                pagination.fns.onSetPage(0);
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
          px={6}
          py={4}
          borderBottomWidth="1px"
          borderColor={cellBorder}
          bg="transparent"
        >
          <HStack spacing={4}>
            <Tag
              colorScheme="forest"
              size="md"
              borderRadius="full"
              variant="subtle"
            >
              {dataMapped.nodes.length} Results
            </Tag>
          </HStack>

          <HStack spacing={4}>
            <Text fontSize="sm" fontWeight="medium" color={mutedColor}>
              Page {pagination.state.page + 1} of {totalPages || 1}
            </Text>
            <HStack spacing={2}>
              <IconButton
                aria-label="previous page"
                icon={<FaChevronLeft />}
                size="sm"
                variant="ghost"
                isDisabled={pagination.state.page === 0}
                onClick={() =>
                  pagination.fns.onSetPage(pagination.state.page - 1)
                }
              />
              <IconButton
                aria-label="next page"
                icon={<FaChevronRight />}
                size="sm"
                variant="ghost"
                isDisabled={pagination.state.page + 1 >= totalPages}
                onClick={() =>
                  pagination.fns.onSetPage(pagination.state.page + 1)
                }
              />
            </HStack>
          </HStack>
        </Flex>

        {isMobile ? (
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
              data={dataMapped}
              theme={theme}
              pagination={pagination}
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
