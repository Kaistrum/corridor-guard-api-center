import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@kaistrum/stratum-ui";

interface DropdownProps {
  /** Receives the open state so the trigger can reflect it (e.g. rotate a chevron). */
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children: ReactNode;
  /** Horizontal alignment of the panel relative to the trigger. */
  align?: "start" | "end";
  panelClassName?: string;
  className?: string;
}

/**
 * Small popover primitive: toggles a floating panel, closes on outside click
 * and Escape. Styled with design-system surface tokens.
 */
export function Dropdown({
  trigger,
  children,
  align = "start",
  panelClassName,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      {open && (
        <div
          id={id}
          className={cn(
            "absolute top-[calc(100%+0.4rem)] z-40 min-w-48 overflow-hidden rounded-radius-md border border-border bg-drop-bg py-1 shadow-md",
            align === "end" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
