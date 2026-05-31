import { useColorModeValue } from "@chakra-ui/react";

const HeroIllustration = () => {
  const c1 = useColorModeValue("#8da101", "#a7c080");
  const c2 = useColorModeValue("#35a77c", "#83c092");

  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="hero-g"
          x1="0"
          y1="0"
          x2="80"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>

      {/* Decorative ring behind star */}
      <circle cx="40" cy="26" r="20" fill="url(#hero-g)" fillOpacity="0.12" />
      <circle
        cx="40"
        cy="26"
        r="20"
        stroke="url(#hero-g)"
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />

      {/* 5-pointed star — outer R=13, inner r=5, center (40,26) */}
      <path
        d="M40 13L42.9 22H52.4L44.8 27.6L47.6 36.5L40 31L32.4 36.5L35.2 27.6L27.6 22H37.1Z"
        fill="url(#hero-g)"
      />

      {/* Connector */}
      <line
        x1="40"
        y1="46"
        x2="40"
        y2="51"
        stroke="url(#hero-g)"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Staggered rows representing a sponsor list */}
      <rect x="12" y="51" width="56" height="4" rx="2" fill="url(#hero-g)" fillOpacity="0.75" />
      <rect x="12" y="60" width="42" height="4" rx="2" fill="url(#hero-g)" fillOpacity="0.50" />
      <rect x="12" y="69" width="28" height="4" rx="2" fill="url(#hero-g)" fillOpacity="0.30" />
    </svg>
  );
};

export default HeroIllustration;
