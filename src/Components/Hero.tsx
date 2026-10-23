import { useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react";
import { SearchMark } from "./Icons";
import { type Facet, formatCount } from "../register";

interface HeroProps {
  /** Rows in the register, or null while it is still loading. */
  total: number | null;
  /** The largest route families, biggest first. */
  routes: Facet[];
  /** The busiest towns, offered as one-tap searches. */
  popular: Facet[];
  /** `Last-Modified` on the register file, already formatted. */
  updated: string;
  onSearch: (query: string) => void;
}

const RouteStat = ({
  value,
  label,
  hideOnMobile,
}: {
  value: string;
  label: string;
  hideOnMobile?: boolean;
}) => (
  <Box
    layerStyle="card"
    p={5}
    display={hideOnMobile ? { base: "none", md: "block" } : undefined}
  >
    <Text
      fontFamily="heading"
      fontWeight={700}
      fontSize="28px"
      letterSpacing="-0.03em"
      lineHeight={1}
      textStyle="num"
    >
      {value}
    </Text>
    <Text fontSize="13px" color="muted" mt={2} lineHeight={1.35}>
      {label}
    </Text>
  </Box>
);

const Hero = ({ total, routes, popular, updated, onSearch }: HeroProps) => {
  const [query, setQuery] = useState("");

  const submit = (value: string) => onSearch(value.trim());

  return (
    <Box
      flex="1"
      w="100%"
      maxW="960px"
      mx="auto"
      px={{ base: 4, md: 6 }}
      pt={{ base: 10, md: 20 }}
      pb={{ base: 10, md: 16 }}
    >
      <Flex direction="column" align={{ base: "flex-start", md: "center" }}>
        {updated && (
          <Flex
            align="center"
            gap={2}
            px={3}
            py="5px"
            mb={6}
            bg="surface"
            border="1px solid"
            borderColor="border"
            borderRadius="full"
            fontSize="13px"
            color="muted"
          >
            <Box w="7px" h="7px" borderRadius="full" bg="lime.500" />
            List updated {updated}
          </Flex>
        )}

        <Heading
          as="h1"
          fontSize={{ base: "40px", md: "64px" }}
          letterSpacing="-0.03em"
          textAlign={{ base: "left", md: "center" }}
          maxW="14em"
          sx={{ textWrap: "balance" }}
        >
          Find UK employers that can{" "}
          <Box
            as="span"
            px="0.08em"
            mx="-0.08em"
            bgGradient="linear(to-b, transparent 58%, var(--chakra-colors-accent) 58%, var(--chakra-colors-accent) 92%, transparent 92%)"
          >
            sponsor your visa
          </Box>
        </Heading>

        <Text
          mt={5}
          maxW="46ch"
          fontSize={{ base: "16px", md: "18px" }}
          color="muted"
          textAlign={{ base: "left", md: "center" }}
        >
          Search the Home Office list of licensed sponsors by company name, town
          or county.
        </Text>

        <Flex
          as="form"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            submit(query);
          }}
          mt={8}
          w="100%"
          maxW="640px"
          align="center"
          gap={2}
          p="6px"
          pl={4}
          bg="surface"
          border="1px solid"
          borderColor="border"
          borderRadius="lg"
          boxShadow="raised"
          transition="border-color 120ms, box-shadow 120ms"
          _focusWithin={{
            borderColor: "text",
            boxShadow: "raised, 0 0 0 4px var(--chakra-colors-lime-200)",
          }}
        >
          <Box color="faint">
            <SearchMark size={18} />
          </Box>
          <Input
            variant="bare"
            flex="1"
            h="48px"
            px={1}
            fontSize="16px"
            placeholder="Company or town"
            aria-label="Search sponsors"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button type="submit" variant="primary" size="lg" flexShrink={0}>
            Search
          </Button>
        </Flex>

        {popular.length > 0 && (
          <Flex
            align="center"
            justify={{ base: "flex-start", md: "center" }}
            wrap="wrap"
            gap={2}
            mt={4}
          >
            <Text fontSize="13px" color="faint" mr={1}>
              Popular:
            </Text>
            {popular.map((town) => (
              <Tag
                key={town.value}
                as="button"
                type="button"
                cursor="pointer"
                onClick={() => submit(town.value)}
              >
                {town.value}
              </Tag>
            ))}
          </Flex>
        )}
      </Flex>

      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        spacing={3}
        mt={{ base: 12, md: 16 }}
      >
        <Box
          gridColumn={{ base: "span 2", md: "span 1" }}
          bg="text"
          color="white"
          borderRadius="lg"
          p={5}
        >
          <Text
            fontFamily="heading"
            fontWeight={700}
            fontSize="28px"
            letterSpacing="-0.03em"
            lineHeight={1}
            textStyle="num"
            color={total === null ? "whiteAlpha.500" : "accent"}
          >
            {total === null ? "–" : formatCount(total)}
          </Text>
          <Text fontSize="13px" color="whiteAlpha.700" mt={2}>
            {total === null ? "Loading…" : "Licensed organisations"}
          </Text>
        </Box>
        {routes.slice(0, 3).map((route, i) => (
          <RouteStat
            key={route.value}
            value={formatCount(route.count)}
            label={route.value}
            hideOnMobile={i === 2}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Hero;
