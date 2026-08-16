import { useState } from "react";
import { Box, Button, Divider, Flex, Input, Text } from "@chakra-ui/react";
import { CheckboxMark } from "./Icons";
import { type Facet, formatCount } from "../register";

/**
 * The filter rail. Facets are checkbox lists with their counts kept in the
 * mono voice on the right, so the eye can read down the numbers alone; the
 * rating is a segmented control because it is one choice out of three.
 *
 * Counts are live — they are recomputed against everything except the facet
 * they belong to, so a town's number tells you what selecting it would
 * actually give you.
 */

export interface Filters {
  towns: string[];
  routes: string[];
  rating: string;
}

export const EMPTY_FILTERS: Filters = { towns: [], routes: [], rating: "" };

export const hasFilters = (filters: Filters) =>
  filters.towns.length > 0 || filters.routes.length > 0 || filters.rating !== "";

interface FilterRailProps {
  towns: Facet[];
  routes: Facet[];
  filters: Filters;
  onChange: (next: Filters) => void;
}

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Text textStyle="kicker" mb={3}>
    {children}
  </Text>
);

const CheckRow = ({
  label,
  count,
  checked,
  onClick,
  withRule = true,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onClick: () => void;
  withRule?: boolean;
}) => (
  <Flex
    as="button"
    type="button"
    onClick={onClick}
    aria-pressed={checked}
    justify="space-between"
    align="center"
    gap={2}
    py="6px"
    textAlign="left"
    fontSize="13px"
    fontWeight={checked ? 600 : 400}
    color={checked ? "accent.700" : "text"}
    borderBottom={withRule ? "1px solid" : "none"}
    borderColor="ink-12"
    _hover={{ color: "accent" }}
  >
    <Flex as="span" align="center" gap="7px" minW={0}>
      <CheckboxMark checked={checked} />
      <Text as="span" noOfLines={1}>
        {label}
      </Text>
    </Flex>
    {count !== undefined && (
      <Text as="span" fontFamily="mono" fontSize="12px" color="ink-55">
        {formatCount(count)}
      </Text>
    )}
  </Flex>
);

const RATINGS = [
  { value: "", label: "Any" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
];

const FilterRail = ({ towns, routes, filters, onChange }: FilterRailProps) => {
  const [townFilter, setTownFilter] = useState("");

  const needle = townFilter.trim().toLowerCase();
  // Selected towns stay pinned at the top, so a choice never scrolls out of
  // sight when the list below it is filtered down.
  const shownTowns = [
    ...towns.filter((t) => filters.towns.includes(t.value)),
    ...towns
      .filter(
        (t) =>
          !filters.towns.includes(t.value) &&
          (!needle || t.value.toLowerCase().includes(needle)),
      )
      .slice(0, 12),
  ];

  return (
    <Box
      as="aside"
      aria-label="Filters"
      borderRight={{ lg: "2px solid" }}
      borderBottom={{ base: "2px solid", lg: "none" }}
      borderColor="divider"
      px={4}
      py={6}
    >
      <SectionLabel>Location</SectionLabel>
      <Input
        size="sm"
        h="32px"
        fontSize="13px"
        mb={2}
        placeholder="Filter towns"
        aria-label="Filter towns"
        value={townFilter}
        onChange={(event) => setTownFilter(event.target.value)}
      />
      <Flex direction="column">
        {shownTowns.map((town, i) => (
          <CheckRow
            key={town.value}
            label={town.value}
            count={town.count}
            checked={filters.towns.includes(town.value)}
            withRule={i < shownTowns.length - 1}
            onClick={() =>
              onChange({ ...filters, towns: toggle(filters.towns, town.value) })
            }
          />
        ))}
        {shownTowns.length === 0 && (
          <Text fontSize="13px" color="ink-55" py="6px">
            No towns match “{townFilter}”.
          </Text>
        )}
      </Flex>

      <Divider
        borderWidth="1px"
        borderColor="divider"
        opacity={1}
        my={4}
      />

      <SectionLabel>Route</SectionLabel>
      <Flex direction="column">
        {routes.slice(0, 8).map((route, i, shown) => (
          <CheckRow
            key={route.value}
            label={route.value}
            count={route.count}
            checked={filters.routes.includes(route.value)}
            withRule={i < shown.length - 1}
            onClick={() =>
              onChange({
                ...filters,
                routes: toggle(filters.routes, route.value),
              })
            }
          />
        ))}
      </Flex>

      <Divider
        borderWidth="1px"
        borderColor="divider"
        opacity={1}
        my={4}
      />

      <SectionLabel>Rating</SectionLabel>
      <Flex border="1px solid" borderColor="divider" w="fit-content">
        {RATINGS.map((option, i) => {
          const selected = filters.rating === option.value;
          return (
            <Box
              key={option.value || "any"}
              as="button"
              type="button"
              aria-pressed={selected}
              onClick={() => onChange({ ...filters, rating: option.value })}
              px={3}
              py="7px"
              fontSize="12px"
              borderLeft={i === 0 ? "none" : "1px solid"}
              borderColor="divider"
              bg={selected ? "accent" : "transparent"}
              color={selected ? "text-on-accent" : "text"}
              _hover={selected ? undefined : { bg: "ink-07" }}
            >
              {option.label}
            </Box>
          );
        })}
      </Flex>

      {hasFilters(filters) && (
        <Button
          variant="ghost"
          size="sm"
          mt={4}
          pl={0}
          onClick={() => onChange(EMPTY_FILTERS)}
        >
          Clear all filters
        </Button>
      )}
    </Box>
  );
};

export default FilterRail;
