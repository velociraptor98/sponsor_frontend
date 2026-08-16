import { useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Input,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react";
import { type Facet, formatCount } from "../register";

/**
 * The entry screen. The ask is one field; the scale of the register is the
 * hero. Split by the system's 2px rule: the search on the left, what is
 * actually in the register on the right — no illustration, because the
 * numbers are the picture.
 */

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

const Stat = ({ value, label }: { value: string; label: string }) => (
  <Box>
    <Text fontFamily="heading" fontWeight={800} fontSize="26px" lineHeight={1}>
      {value}
    </Text>
    <Text fontSize="12px" color="ink-60" mt={1} lineHeight={1.3}>
      {label}
    </Text>
  </Box>
);

const Hero = ({
  total,
  routes,
  popular,
  updated,
  onSearch,
}: HeroProps) => {
  const [query, setQuery] = useState("");

  const submit = (value: string) => onSearch(value.trim());

  return (
    // The band sits on the vertical centre of the ground, so the rule between
    // the two columns reads as the spine of one object rather than a page edge.
    <Grid
      templateColumns={{ base: "1fr", lg: "1.35fr 1fr" }}
      alignContent="center"
      flex="1"
    >
      <Box
        as="form"
        px={{ base: 5, md: 8 }}
        py={{ base: 8, md: 12 }}
        borderRight={{ lg: "2px solid" }}
        borderBottom={{ base: "2px solid", lg: "none" }}
        borderColor={{ base: "divider", lg: "divider" }}
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          submit(query);
        }}
      >
        <Heading
          as="h1"
          fontSize={{ base: "38px", md: "56px" }}
          maxW="11em"
          mb={3}
          sx={{ textWrap: "balance" }}
        >
          Find the employers allowed to sponsor your visa.
        </Heading>

        <Text maxW="44ch" fontSize="15px" color="ink-70">
          Every organisation on the Home Office register of worker and
          temporary worker licensed sponsors — searchable by name, town or
          county.
        </Text>

        {/* The 2px frame belongs to the row, so the field inside draws none. */}
        <Flex mt={6} border="2px solid" borderColor="text" maxW="640px">
          <Input
            variant="bare"
            flex="1"
            h="56px"
            fontSize="16px"
            px={4}
            placeholder="Organisation or town — e.g. Manchester"
            aria-label="Search the register"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button type="submit" variant="primary" size="lg" flexShrink={0}>
            Search the register
          </Button>
        </Flex>

        {popular.length > 0 && (
          <Flex align="center" wrap="wrap" gap={2} mt={4}>
            <Text textStyle="kicker" mr={1}>
              Popular
            </Text>
            {popular.map((town) => (
              <Tag
                key={town.value}
                as="button"
                type="button"
                variant="outline"
                cursor="pointer"
                _hover={{ bg: "accent.100" }}
                onClick={() => submit(town.value)}
              >
                {town.value}
              </Tag>
            ))}
          </Flex>
        )}
      </Box>

      <Flex
        direction="column"
        gap={6}
        px={{ base: 5, md: 8 }}
        py={{ base: 8, md: 12 }}
      >
        <Box>
          <Text textStyle="kicker">In the register today</Text>
          <Text
            fontFamily="heading"
            fontWeight={800}
            fontSize={{ base: "48px", md: "64px" }}
            lineHeight={1}
            mt="6px"
            // Nothing shifts when the count arrives: the dash holds the line.
            color={total === null ? "ink-45" : "text"}
          >
            {total === null ? "—" : formatCount(total)}
          </Text>
          <Text fontSize="13px" color="ink-60" mt={1}>
            {total === null ? "reading the register…" : "licensed organisations"}
          </Text>
        </Box>

        <Divider borderWidth="1px" borderColor="divider" opacity={1} />

        <SimpleGrid columns={2} spacingX={6} spacingY={4}>
          {routes.slice(0, 4).map((route) => (
            <Stat
              key={route.value}
              value={formatCount(route.count)}
              label={route.value}
            />
          ))}
        </SimpleGrid>

        {routes.length > 0 && (
          <Divider borderWidth="1px" borderColor="divider" opacity={1} />
        )}

        <Text fontSize="12px" color="ink-60" lineHeight={1.5}>
          Source: Home Office <em>Register of licensed sponsors: workers</em>.
          {updated && (
            <>
              {" "}
              Updated{" "}
              <Text as="span" fontFamily="mono">
                {updated}
              </Text>
              .
            </>
          )}{" "}
          A licence is not a job offer.
        </Text>
      </Flex>
    </Grid>
  );
};

export default Hero;
