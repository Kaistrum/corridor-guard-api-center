import { cn } from "@kaistrum/stratum-ui";

interface LogoProps {
  className?: string;
}

/**
 * Corridor Guard wordmark ("corridor" medium, "guard" light) in the
 * design-system type.
 */
export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[1.25rem] leading-none tracking-tight text-text",
        className,
      )}
    >
      <span className="font-bold">corridor</span>
      <span className="font-light text-text-dim">guard</span>
    </span>
  );
}
