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
import { CloseMark } from "./Icons";
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
    filters.rating ? `${filters.rating}-rated` : "A-rated and B-rated",
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

  return (
    <Grid templateColumns={{ base: "1fr", lg: "246px 1fr" }} flex="1" minH={0}>
      {/* On narrow screens the rail folds away behind the toolbar below. */}
      {(!isMobile || railOpen) && (
        <FilterRail
          towns={townFacets}
          routes={routeFacets}
          filters={filters}
          onChange={setFilters}
        />
      )}

      <Box minW={0}>
        {/* Toolbar — mobile only: the selection, and the way back to it. */}
        {isMobile && (
        <Flex
          align="center"
          gap={2}
          px={4}
          py={3}
          borderBottom="2px solid"
          borderColor="divider"
          overflowX="auto"
        >
          <Button size="sm" onClick={() => setRailOpen((open) => !open)}>
            {railOpen ? "Hide filters" : "Filters"}
          </Button>
          {filters.towns.map((town) => (
            <Tag
              key={town}
              as="button"
              type="button"
              variant="accent"
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
            <Tag variant="accent" flexShrink={0}>
              {filters.rating} rating
            </Tag>
          )}
        </Flex>
        )}

        {/* Results header */}
        <Flex
          align={{ base: "flex-start", md: "baseline" }}
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap={3}
          px={{ base: 4, md: 6 }}
          py={4}
          borderBottom="2px solid"
          borderColor="divider"
        >
          <Box>
            <Heading as="h2" fontSize={{ base: "20px", md: "26px" }}>
              {isLoading && total === 0
                ? "Reading the register…"
                : `${formatCount(total)} sponsor${total === 1 ? "" : "s"}${where}`}
            </Heading>
            <Text fontSize="12px" color="ink-60" mt={1}>
              {subline}
            </Text>
          </Box>

          <HStack spacing={3} flexShrink={0}>
            <HStack spacing={2}>
              <Text textStyle="kicker">Sort</Text>
              <Select
                size="sm"
                h="32px"
                fontSize="12px"
                w="auto"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                aria-label="Sort results"
              >
                {Object.entries(SORTS).map(([key, option]) => (
                  <option key={key} value={key}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </HStack>
            <Button size="sm" onClick={download} isDisabled={total === 0}>
              Download CSV
            </Button>
          </HStack>
        </Flex>

        {total === 0 ? (
          <Flex direction="column" align="center" gap={4} px={6} py={20}>
            <Text textStyle="kicker">No matches</Text>
            <Heading as="p" fontSize="20px" textAlign="center">
              {isLoading ? "Still reading the register" : "Nothing here yet"}
            </Heading>
            <Text fontSize="14px" color="ink-60" textAlign="center" maxW="44ch">
              {isLoading
                ? "The full register is still loading — results will appear as soon as it lands."
                : "No sponsor matches this search and these filters. Try a wider town, or clear the filters."}
            </Text>
            {hasFilters(filters) && (
              <Button variant="ghost" onClick={() => setFilters(EMPTY_FILTERS)}>
                Clear all filters
              </Button>
            )}
          </Flex>
        ) : isMobile ? (
          /* 1h — the register as a list, one line of metadata per row. */
          <Box>
            {mobileRows.map((sponsor) => (
              <Box
                key={sponsor.id}
                px={4}
                py={3}
                borderTop="1px solid"
                borderColor="rule"
              >
                <Text fontWeight={600} fontSize="15px">
                  {sponsor.org}
                </Text>
                <Text fontSize="12px" color="ink-60" mt="2px">
                  {[
                    sponsor.town,
                    sponsor.routes.length > 1
                      ? `${sponsor.routes.length} routes`
                      : sponsor.routes[0],
                    sponsor.rating && `${sponsor.rating} rating`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </Box>
            ))}
            {mobileCount < total && (
              <Box p={4} borderTop="2px solid" borderColor="divider">
                <Button
                  w="full"
                  h="48px"
                  justifyContent="flex-start"
                  onClick={() => setMobileCount((n) => n + MOBILE_STEP)}
                >
                  Load {Math.min(MOBILE_STEP, total - mobileCount)} more
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          /* 1c — the dense table. */
          <Box overflowX="auto">
            <Box as="table" w="100%" sx={{ borderCollapse: "collapse" }} fontSize="13px">
              <Box as="thead">
                <Box as="tr">
                  {COLUMNS.map((column) => (
                    <Box
                      as="th"
                      key={column}
                      textAlign="left"
                      textStyle="kicker"
                      fontSize="11px"
                      letterSpacing="0.08em"
                      color="ink-60"
                      px={2}
                      py={2}
                      borderBottom="2px solid"
                      borderColor="divider"
                    >
                      {column}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box as="tbody">
                {pageRows.map((sponsor) => (
                  <Box as="tr" key={sponsor.id} _hover={{ bg: "ink-04" }}>
                    <Box as="td" px={2} py={2} borderBottom="1px solid" borderColor="rule" fontWeight={600}>
                      {sponsor.org}
                    </Box>
                    <Box as="td" px={2} py={2} borderBottom="1px solid" borderColor="rule">
                      {sponsor.town}
                    </Box>
                    <Box as="td" px={2} py={2} borderBottom="1px solid" borderColor="rule">
                      {sponsor.county}
                    </Box>
                    <Box as="td" px={2} py={2} borderBottom="1px solid" borderColor="rule">
                      {sponsor.routes.map(shortRoute).join(" · ")}
                    </Box>
                    <Box as="td" px={2} py={2} borderBottom="1px solid" borderColor="rule">
                      {sponsor.rating ? (
                        <Tag variant={sponsor.rating === "A" ? "neutral" : "accent"}>
                          {sponsor.rating}
                        </Tag>
                      ) : (
                        <Text as="span" color="ink-45">
                          —
                        </Text>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Pagination */}
            <Flex
              align="center"
              justify="space-between"
              gap={4}
              px={6}
              py={4}
              borderTop="2px solid"
              borderColor="divider"
              flexWrap="wrap"
            >
              <HStack spacing={4}>
                <Text fontFamily="mono" fontSize="11px" color="ink-55">
                  {formatCount(rangeStart)}–{formatCount(rangeEnd)} OF{" "}
                  {formatCount(total)}
                </Text>
                <HStack spacing={2}>
                  <Text textStyle="kicker">Rows</Text>
                  <Select
                    size="sm"
                    h="28px"
                    fontSize="12px"
                    w="auto"
                    value={pageSize}
                    onChange={(event) => setPageSize(Number(event.target.value))}
                    aria-label="Rows per page"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </Select>
                </HStack>
              </HStack>

              <HStack spacing={1}>
                <Button
                  size="sm"
                  isDisabled={currentPage === 0}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Text fontFamily="mono" fontSize="12px" px={2} color="ink-55">
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
