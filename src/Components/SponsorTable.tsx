import React, { useState, useMemo } from "react";
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
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  InputGroup,
  InputLeftElement,
  Stack,
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
  const [currentSelection, setCurrentSelection] = useState("-");
  const [search, setSearch] = useState("");

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("blue.50", "gray.600");
  const stripeBg = useColorModeValue("white", "gray.800");
  const evenBg = useColorModeValue("gray.50", "gray.900");

  const chakraTheme = getTheme(DEFAULT_OPTIONS, { isVirtualized: true });
  
  const theme = useTheme([
    chakraTheme,
    {
      HeaderRow: `
        background-color: ${headerBg};
        font-weight: 800;
      `,
      Row: `
        background-color: ${stripeBg};
        &:nth-of-type(even) {
          background-color: ${evenBg};
        }
        &:hover {
          background-color: ${hoverBg} !important;
          transition: background-color 0.1s ease-in-out;
        }
      `,
      HeaderCell: `
        border-bottom: 2px solid ${borderColor} !important;
        padding: 16px 12px !important;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--chakra-colors-gray-500);
      `,
      Cell: `
        padding: 14px 12px !important;
        font-size: 14px;
        border-bottom: 1px solid ${borderColor} !important;
      `,
    },
  ]);

  // Memoize and filter data
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

  // Memoize the list of towns for the filter dropdown
  const selectionList = useMemo(() => {
    const selectionSet = new Set<string>();
    values.forEach((val) => {
      if (val[1]) selectionSet.add(val[1]);
    });
    return Array.from(selectionSet).sort();
  }, [values]);

  const pagination = usePagination(dataMapped, {
    state: {
      page: 0,
      size: 15,
    },
  });

  const totalPages = pagination.state.getTotalPages(dataMapped.nodes);
  const filterBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Stack spacing={6} width="100%" maxW="100%" mx="auto">
      {/* Filters Section */}
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={4}
        align={{ base: "stretch", md: "flex-end" }}
        bg={filterBg}
        p={6}
        borderRadius="xl"
        borderWidth="1px"
        shadow="sm"
      >
        <FormControl flex={2}>
          <FormLabel
            fontSize="xs"
            fontWeight="black"
            textTransform="uppercase"
            color="gray.500"
            ml={1}
          >
            Search Sponsors
          </FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by company, town or county..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg={bgColor}
              variant="outline"
              borderRadius="lg"
            />
          </InputGroup>
        </FormControl>

        <FormControl flex={1} maxW={{ md: "300px" }}>
          <FormLabel
            fontSize="xs"
            fontWeight="black"
            textTransform="uppercase"
            color="gray.500"
            ml={1}
          >
            Filter by Town
          </FormLabel>
          <Select
            size="lg"
            value={currentSelection}
            onChange={(e) => setCurrentSelection(e.target.value)}
            bg={bgColor}
            borderRadius="lg"
          >
            <option value="-">All Towns</option>
            {selectionList.map((val, index) => (
              <option key={index} value={val}>
                {val}
              </option>
            ))}
          </Select>
        </FormControl>
      </Flex>

      {/* Table Section */}
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderRadius="xl"
        shadow="xl"
        overflow="hidden"
      >
        <Flex
          justify="space-between"
          align="center"
          px={6}
          py={4}
          borderBottomWidth="1px"
          bg={useColorModeValue("white", "gray.800")}
        >
          <HStack spacing={4}>
            <Text fontWeight="bold" fontSize="lg">
              Sponsor List
            </Text>
            <Tag
              colorScheme="blue"
              size="md"
              borderRadius="full"
              variant="subtle"
            >
              {dataMapped.nodes.length} Results
            </Tag>
          </HStack>

          <HStack spacing={4}>
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
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

        <Box overflowX="auto">
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
      </Box>
    </Stack>
  );
};

export default SponsorTable;
