import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const Mark = ({ size = 16, strokeWidth = 2, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    style={{ flex: "none", display: "block" }}
    {...rest}
  />
);

export const CheckboxMark = ({
  checked,
  size = 16,
}: {
  checked?: boolean;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
    style={{ flex: "none", display: "block" }}
  >
    <rect
      x="0.75"
      y="0.75"
      width="14.5"
      height="14.5"
      rx="4"
      fill={checked ? "var(--chakra-colors-text)" : "var(--chakra-colors-surface)"}
      stroke={checked ? "var(--chakra-colors-text)" : "var(--chakra-colors-border-strong)"}
      strokeWidth="1.5"
    />
    {checked && (
      <path
        d="m4.5 8.2 2.3 2.3 4.7-5"
        fill="none"
        stroke="var(--chakra-colors-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

export const CloseMark = (props: IconProps) => (
  <Mark size={12} strokeWidth={2.5} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Mark>
);

export const SearchMark = (props: IconProps) => (
  <Mark {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Mark>
);

export const ArrowRightMark = (props: IconProps) => (
  <Mark {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Mark>
);

export const ArrowLeftMark = (props: IconProps) => (
  <Mark {...props}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Mark>
);

export const FilterMark = (props: IconProps) => (
  <Mark {...props}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Mark>
);

export const DownloadMark = (props: IconProps) => (
  <Mark {...props}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </Mark>
);

export const WarningMark = (props: IconProps) => (
  <Mark {...props}>
    <path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </Mark>
);
