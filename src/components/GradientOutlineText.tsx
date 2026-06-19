import type { ReactNode } from "react";

interface GradientOutlineTextProps {
  children: ReactNode;
  fontClassName: string;
  sizeClassName: string;
  strokeClassName: string;
  fillClassName: string;
  wrapClassName?: string;
  trackingClassName?: string;
}

export function GradientOutlineText({
  children,
  fontClassName,
  sizeClassName,
  strokeClassName,
  fillClassName,
  wrapClassName = "",
  trackingClassName = "",
}: GradientOutlineTextProps) {
  const shared = `${fontClassName} ${sizeClassName} ${trackingClassName}`;

  return (
    <span
      className={`landing-title-wrap relative block w-full ${wrapClassName}`}
    >
      <span
        aria-hidden="true"
        className={`landing-title-stroke pointer-events-none absolute inset-x-0 top-0 select-none ${shared} ${strokeClassName}`}
      >
        {children}
      </span>
      <span
        className={`landing-title-fill relative block ${shared} ${fillClassName}`}
      >
        {children}
      </span>
    </span>
  );
}
