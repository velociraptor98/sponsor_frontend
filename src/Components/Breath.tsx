import { Box, Flex } from "@chakra-ui/react";
import type { FlexProps } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

/**
 * A short clay stroke that releases into a trail of fading dots — the accent
 * shape the palette reserves clay for. Used beside the wordmark, as the hero,
 * as the loading rhythm, and in the empty state.
 *
 * Every measurement is in `em`, so the line length and dot spacing always scale
 * with the type it sits beside rather than being set by hand.
 */

// Three dots by default; drop to two when space is tight or the size is small.
// Each is smaller and fainter than the last, and the gaps widen as it goes, so
// it disperses rather than reading as a row of evenly spaced dots.
const DOTS = [
  { size: 0.15,  gap: 0.26, opacity: 0.85 },
  { size: 0.115, gap: 0.30, opacity: 0.55 },
  { size: 0.085, gap: 0.34, opacity: 0.30 },
];

const exhale = keyframes`
  0%, 100% { opacity: 0.15; transform: translateX(-0.15em); }
  50%      { opacity: 1;    transform: translateX(0); }
`;

interface BreathProps extends Omit<FlexProps, "color"> {
  /** 2 when space is tight or the size is small, 3 otherwise. */
  dots?: 2 | 3;
  color?: string;
  /** Animate the dots as a loading rhythm. */
  animate?: boolean;
}

export const Breath = ({
  dots = 3,
  color = "accent",
  animate = false,
  ...rest
}: BreathProps) => (
  <Flex as="span" align="center" aria-hidden="true" flexShrink={0} {...rest}>
    {/* The line. */}
    <Box
      as="span"
      w="0.85em"
      h="0.075em"
      minH="1px"
      borderRadius="full"
      bg={color}
    />
    {/* The dots, dispersing into air. */}
    {DOTS.slice(0, dots).map((dot, i) => (
      <Box
        key={i}
        as="span"
        w={`${dot.size}em`}
        h={`${dot.size}em`}
        minW="2px"
        minH="2px"
        ml={`${dot.gap}em`}
        borderRadius="full"
        bg={color}
        opacity={dot.opacity}
        animation={
          animate
            ? `${exhale} 1.6s ease-in-out ${i * 0.18}s infinite`
            : undefined
        }
      />
    ))}
  </Flex>
);

export default Breath;
