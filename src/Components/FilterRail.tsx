import { useState } from "react";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { CheckboxMark } from "./Icons";
import { type Facet, formatCount } from "../register";

/**
 * Facet counts are recomputed against everything except the facet they belong
 * to, so a town's number tells you what selecting it would actually give you.
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

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Box py={4} borderTop="1px solid" borderColor="border" _first={{ borderTop: "none", pt: 0 }}>
    <Text textStyle="label" color="text" mb={2}>
      {title}
    </Text>
    {children}
  </Box>
);

const CheckRow = ({
  label,
  count,
  checked,
  onClick,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onClick: () => void;
}) => (
  <Flex
    as="button"
    type="button"
    onClick={onClick}
    aria-pressed={checked}
    justify="space-between"
    align="center"
    gap={2}
    mx={-2}
    px={2}
    py="6px"
    borderRadius="base"
    textAlign="left"
    fontSize="14px"
    fontWeight={checked ? 600 : 400}
    color="text"
    transition="background 100ms"
    _hover={{ bg: "subtle" }}
  >
    <Flex as="span" align="center" gap="10px" minW={0}>
      <CheckboxMark checked={checked} />
      <Text as="span" noOfLines={1}>
        {label}
      </Text>
    </Flex>
    {count !== undefined && (
      <Text as="span" textStyle="num" fontSize="12px" color="faint">
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
      layerStyle="card"
      p={4}
      alignSelf="start"
      position={{ lg: "sticky" }}
      top={{ lg: "80px" }}
    >
      <Flex justify="space-between" align="center" mb={4} minH="24px">
        <Text fontFamily="heading" fontWeight={700} fontSize="17px" letterSpacing="-0.02em">
          Filters
        </Text>
        {hasFilters(filters) && (
          <Button
            variant="ghost"
            size="sm"
            h="24px"
            px={2}
            mr={-2}
            onClick={() => onChange(EMPTY_FILTERS)}
          >
            Clear all
          </Button>
        )}
      </Flex>

      <Section title="Rating">
        <Flex bg="subtle" borderRadius="md" p="3px" gap="2px">
          {RATINGS.map((option) => {
            const selected = filters.rating === option.value;
            return (
              <Box
                key={option.value || "any"}
                as="button"
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ ...filters, rating: option.value })}
                flex="1"
                py="5px"
                fontSize="13px"
                fontWeight={selected ? 600 : 500}
                borderRadius="base"
                bg={selected ? "surface" : "transparent"}
                color={selected ? "text" : "muted"}
                boxShadow={selected ? "card" : "none"}
                transition="all 120ms"
                _hover={selected ? undefined : { color: "text" }}
              >
                {option.label}
              </Box>
            );
          })}
        </Flex>
      </Section>

      <Section title="Location">
        <Input
          size="sm"
          mb={2}
          placeholder="Filter towns"
          aria-label="Filter towns"
          value={townFilter}
          onChange={(event) => setTownFilter(event.target.value)}
        />
        <Flex direction="column">
          {shownTowns.map((town) => (
            <CheckRow
              key={town.value}
              label={town.value}
              count={town.count}
              checked={filters.towns.includes(town.value)}
              onClick={() =>
                onChange({ ...filters, towns: toggle(filters.towns, town.value) })
              }
            />
          ))}
          {shownTowns.length === 0 && (
            <Text fontSize="13px" color="faint" py="6px">
              No towns match “{townFilter}”.
            </Text>
          )}
        </Flex>
      </Section>

      <Section title="Visa route">
        <Flex direction="column">
          {routes.slice(0, 8).map((route) => (
            <CheckRow
              key={route.value}
              label={route.value}
              count={route.count}
              checked={filters.routes.includes(route.value)}
              onClick={() =>
                onChange({
                  ...filters,
                  routes: toggle(filters.routes, route.value),
                })
              }
            />
          ))}
        </Flex>
      </Section>
    </Box>
  );
};

export default FilterRail;
