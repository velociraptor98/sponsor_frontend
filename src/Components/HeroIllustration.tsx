import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { Breath } from "./Breath";

// Quietly alive: the gesture drifts out and settles, like a slow exhale.
const breathe = keyframes`
  0%, 100% { opacity: 0.75; transform: translateX(-0.04em); }
  50%      { opacity: 1;    transform: translateX(0.04em); }
`;

/**
 * The hero is the gesture itself, at scale — the exhale that the whole
 * identity is built from.
 */
const HeroIllustration = () => (
  <Box
    fontSize={{ base: "72px", md: "96px" }}
    animation={`${breathe} 5s ease-in-out infinite`}
  >
    <Breath />
  </Box>
);

export default HeroIllustration;
