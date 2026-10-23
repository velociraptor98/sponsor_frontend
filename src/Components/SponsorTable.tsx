import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Select,
  Tag,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import FilterRail, {
  EMPTY_FILTERS,
  type Filters,
  hasFilters,
} from "./FilterRail";
import { CloseMark, DownloadMark, FilterMark } from "./Icons";
import {
  type Sponsor,
  formatCount,
  shortRoute,
  tally,
  tallyMany,
} from "../register";

const PAGE_SIZE_OPTIONS = [15, 25, 50, 100];
const MOBILE_STEP = 15;

const SORTS = {
  "org-asc": { label: "A–Z", compare: (a: Sponsor, b: Sponsor) => a.org.localeCompare(b.org) },
  "org-desc": { label: "Z–A", compare: (a: Sponsor, b: Sponsor) => b.org.localeCompare(a.org) },
  town: {
    label: "Town",
    compare: (a: Sponsor, b: Sponsor) =>
      a.town.localeCompare(b.town) || a.org.localeCompare(b.org),
  },
};
type SortKey = keyof typeof SORTS;

const COLUMNS = ["Organisation", "Town / city", "County", "Route", "Rating"];

interface SponsorTableProps {
  sponsors: Sponsor[];
  /** The masthead search box's current value; debounced here. */
  query: string;
  isLoading: boolean;
}

const matchesQuery = (sponsor: Sponsor, needle: string) =>
  sponsor.org.toLowerCase().includes(needle) ||
  sponsor.town.toLowerCase().includes(needle) ||
  sponsor.county.toLowerCase().includes(needle);

/** Everything except one facet, so that facet's counts stay live. */
const narrow = (
  sponsors: Sponsor[],
  filters: Filters,
  skip: "towns" | "routes" | "rating" | null,
) =>
  sponsors.filter(
    (s) =>
      (skip === "towns" || !filters.towns.length || filters.towns.includes(s.town)) &&
      (skip === "routes" ||
        !filters.routes.length ||
        s.routes.some((route) => filters.routes.includes(route))) &&
      (skip === "rating" || !filters.rating || s.rating === filters.rating),
  );

const toCsv = (rows: Sponsor[]) => {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = [COLUMNS.join(",")];
  for (const row of rows) {
    lines.push(
      [row.org, row.town, row.county, row.routes.join(" · "), row.rating]
        .map(escape)
        .join(","),
    );
  }
  return lines.join("\n");
};

const SponsorTable = ({ sponsors, query, isLoading }: SponsorTableProps) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("org-asc");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [mobileCount, setMobileCount] = useState(MOBILE_STEP);
  const [railOpen, setRailOpen] = useState(false);

  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Filtering 140k rows on every keystroke is too slow, so the filter runs
  // against a debounced copy of the search text.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Any change to what is being asked for starts the results from the top.
  useEffect(() => {
    setPage(0);
    setMobileCount(MOBILE_STEP);
  }, [debouncedQuery, filters, sort, pageSize]);

  const searched = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();
    if (!needle) return sponsors;
    return sponsors.filter((s) => matchesQuery(s, needle));
  }, [sponsors, debouncedQuery]);

  const townFacets = useMemo(
    () => tally(narrow(searched, filters, "towns"), (s) => s.town),
    [searched, filters],
  );
  const routeFacets = useMemo(
    () => tallyMany(narrow(searched, filters, "routes"), (s) => s.routes),
    [searched, filters],
  );

  const results = useMemo(() => {
    const rows = narrow(searched, filters, null);
    return [...rows].sort(SORTS[sort].compare);
  }, [searched, filters, sort]);

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = useMemo(
    () => results.slice(currentPage * pageSize, (currentPage + 1) * pageSize),
    [results, currentPage, pageSize],
  );
  const mobileRows = useMemo(
    () => results.slice(0, mobileCount),
    [results, mobileCount],
  );

  const rangeStart = total === 0 ? 0 : currentPage * pageSize + 1;
  const rangeEnd = Math.min((currentPage + 1) * pageSize, total);

  const where = filters.towns.length
    ? ` in ${filters.towns.slice(0, 2).join(", ")}${
        filters.towns.length > 2 ? ` +${filters.towns.length - 2}` : ""
      }`
    : debouncedQuery.trim()
      ? ` matching “${debouncedQuery.trim()}”`
      : "";

  const subline = [
    filters.routes.length ? filters.routes.join(" · ") : "All routes",
    filters.rating ? `${filters.rating} rating` : "A and B ratings",
  ].join(" · ");

  const download = () => {
    const blob = new Blob([toCsv(results)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sponsors.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const cell = {
    px: 4,
    py: "11px",
    borderBottom: "1px solid",
    borderColor: "border",
  };

  const filterCount =
    filters.towns.length + filters.routes.length + (filters.rating ? 1 : 0);

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "260px minmax(0, 1fr)" }}
      gap={{ base: 3, lg: 6 }}
      flex="1"
      minH={0}
      w="100%"
      maxW="1440px"
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
    >
      {isMobile && (
        <Flex align="center" gap={2} overflowX="auto">
          <Button
            size="sm"
            leftIcon={<FilterMark size={14} />}
            onClick={() => setRailOpen((open) => !open)}
            flexShrink={0}
          >
            {railOpen ? "Hide filters" : "Filters"}
            {filterCount > 0 && (
              <Box
                as="span"
                ml={2}
                px="6px"
                borderRadius="full"
                bg="text"
                color="accent"
                fontSize="11px"
                lineHeight="18px"
              >
                {filterCount}
              </Box>
            )}
          </Button>
          {filters.towns.map((town) => (
            <Tag
              key={town}
              as="button"
              type="button"
              variant="selected"
              flexShrink={0}
              gap="6px"
              onClick={() =>
                setFilters({
                  ...filters,
                  towns: filters.towns.filter((t) => t !== town),
                })
              }
            >
              {town}
              <CloseMark />
            </Tag>
          ))}
          {filters.rating && (
            <Tag variant="selected" flexShrink={0}>
              {filters.rating} rating
            </Tag>
          )}
        </Flex>
      )}

      {/* On narrow screens the rail folds away behind the toolbar above. */}
      {(!isMobile || railOpen) && (
        <FilterRail
          towns={townFacets}
          routes={routeFacets}
          filters={filters}
          onChange={setFilters}
        />
      )}

      <Box minW={0}>
        <Flex
          align={{ base: "flex-start", md: "flex-end" }}
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap={3}
          mb={4}
        >
          <Box minW={0}>
            <Heading
              as="h2"
              fontSize={{ base: "22px", md: "28px" }}
              letterSpacing="-0.03em"
            >
              {isLoading && total === 0
                ? "Loading sponsors…"
                : `${formatCount(total)} sponsor${total === 1 ? "" : "s"}${where}`}
            </Heading>
            <Text fontSize="13px" color="muted" mt={1}>
              {subline}
            </Text>
          </Box>

          <HStack spacing={2} flexShrink={0}>
            <Select
              size="sm"
              h="32px"
              fontSize="13px"
              w="auto"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              aria-label="Sort results"
            >
              {Object.entries(SORTS).map(([key, option]) => (
                <option key={key} value={key}>
                  Sort: {option.label}
                </option>
              ))}
            </Select>
            <Button
              size="sm"
              leftIcon={<DownloadMark size={14} />}
              onClick={download}
              isDisabled={total === 0}
            >
              CSV
            </Button>
          </HStack>
        </Flex>

        {total === 0 ? (
          <Flex
            layerStyle="card"
            direction="column"
            align="center"
            gap={2}
            px={6}
            py={20}
          >
            <Heading as="p" fontSize="20px" textAlign="center">
              {isLoading ? "Still loading" : "No results"}
            </Heading>
            <Text fontSize="14px" color="muted" textAlign="center" maxW="40ch">
              {isLoading
                ? "Results will show once the list has loaded."
                : "Try a different search or remove some filters."}
            </Text>
            {hasFilters(filters) && (
              <Button mt={3} onClick={() => setFilters(EMPTY_FILTERS)}>
                Clear filters
              </Button>
            )}
          </Flex>
        ) : isMobile ? (
          <Box layerStyle="card" overflow="hidden">
            {mobileRows.map((sponsor, i) => (
              <Box
                key={sponsor.id}
                px={4}
                py={3}
                borderTop={i === 0 ? "none" : "1px solid"}
                borderColor="border"
              >
                <Flex justify="space-between" align="flex-start" gap={3}>
                  <Text fontWeight={600} fontSize="15px" lineHeight={1.35}>
                    {sponsor.org}
                  </Text>
                  {sponsor.rating && (
                    <Tag
                      variant={sponsor.rating === "A" ? "ratingA" : "ratingB"}
                      flexShrink={0}
                    >
                      {sponsor.rating}
                    </Tag>
                  )}
                </Flex>
                <Text fontSize="13px" color="muted" mt="2px">
                  {[
                    sponsor.town,
                    sponsor.routes.length > 1
                      ? `${sponsor.routes.length} routes`
                      : sponsor.routes[0],
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </Box>
            ))}
            {mobileCount < total && (
              <Box p={3} borderTop="1px solid" borderColor="border">
                <Button
                  w="full"
                  h="44px"
                  variant="ghost"
                  color="text"
                  onClick={() => setMobileCount((n) => n + MOBILE_STEP)}
                >
                  Show {Math.min(MOBILE_STEP, total - mobileCount)} more
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box layerStyle="card" overflow="hidden">
            <Box overflowX="auto">
              <Box
                as="table"
                w="100%"
                sx={{ borderCollapse: "collapse" }}
                fontSize="14px"
              >
                <Box as="thead" bg="subtle">
                  <Box as="tr">
                    {COLUMNS.map((column) => (
                      <Box
                        as="th"
                        key={column}
                        {...cell}
                        py="9px"
                        textAlign="left"
                        fontSize="12px"
                        fontWeight={600}
                        color="muted"
                        whiteSpace="nowrap"
                      >
                        {column}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box as="tbody">
                  {pageRows.map((sponsor) => (
                    <Box
                      as="tr"
                      key={sponsor.id}
                      transition="background 80ms"
                      _hover={{ bg: "#f8f9fa" }}
                    >
                      <Box as="td" {...cell} fontWeight={600}>
                        {sponsor.org}
                      </Box>
                      <Box as="td" {...cell} color="muted">
                        {sponsor.town}
                      </Box>
                      <Box as="td" {...cell} color="muted">
                        {sponsor.county}
                      </Box>
                      <Box as="td" {...cell} color="muted">
                        {sponsor.routes.map(shortRoute).join(" · ")}
                      </Box>
                      <Box as="td" {...cell}>
                        {sponsor.rating ? (
                          <Tag
                            variant={sponsor.rating === "A" ? "ratingA" : "ratingB"}
                          >
                            {sponsor.rating}
                          </Tag>
                        ) : (
                          <Text as="span" color="faint">
                            –
                          </Text>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Flex
              align="center"
              justify="space-between"
              gap={4}
              px={4}
              py={3}
              flexWrap="wrap"
              fontSize="13px"
              color="muted"
            >
              <HStack spacing={4}>
                <Text textStyle="num">
                  {formatCount(rangeStart)}–{formatCount(rangeEnd)} of{" "}
                  {formatCount(total)}
                </Text>
                <Select
                  size="sm"
                  h="30px"
                  fontSize="13px"
                  w="auto"
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  aria-label="Rows per page"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </Select>
              </HStack>

              <HStack spacing={2}>
                <Button
                  size="sm"
                  isDisabled={currentPage === 0}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Text textStyle="num" px={1}>
                  {formatCount(currentPage + 1)} / {formatCount(totalPages)}
                </Text>
                <Button
                  size="sm"
                  isDisabled={currentPage + 1 >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default SponsorTable;
