import type { SVGProps } from "react";

/**
 * The system's marks. Everything is drawn on a 24 grid with square caps and a
 * heavy stroke, so the icons carry the same hard edge as the rules and the
 * zero-radius surfaces around them. They inherit `currentColor`, so a mark
 * always matches the text it sits beside.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const Mark = ({ size = 15, strokeWidth = 2.2, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    aria-hidden="true"
    focusable="false"
    style={{ flex: "none", display: "block" }}
    {...rest}
  />
);

/** The system's checkbox: a square, and a check inside it when set. */
export const CheckboxMark = ({
  checked,
  ...props
}: IconProps & { checked?: boolean }) => (
  <Mark {...props}>
    <rect x="3" y="3" width="18" height="18" />
    {checked && <path d="m8 12 3 3 5-6" />}
  </Mark>
);

export const CloseMark = (props: IconProps) => (
  <Mark size={12} strokeWidth={2.6} {...props}>
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
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Mark>
);

export const ArrowLeftMark = (props: IconProps) => (
  <Mark {...props}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </Mark>
);

export const WarningMark = (props: IconProps) => (
  <Mark {...props}>
    <path d="M12 3 22 20H2z" />
    <path d="M12 10v4M12 17.2v.6" />
  </Mark>
);
