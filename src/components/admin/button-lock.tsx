import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "~/lib/utils";

type Disableable = { disabled?: boolean };

/** Keeps the reason for a disabled action available on hover. */
export function ButtonLock({
  locked,
  reason,
  className,
  children,
}: {
  locked: boolean;
  reason: string;
  className?: string;
  children: ReactNode;
}) {
  if (!locked || !reason || !isValidElement<Disableable>(children))
    return children;
  return (
    <span
      title={reason}
      className={cn("inline-flex cursor-not-allowed", className)}
    >
      {cloneElement(children as ReactElement<Disableable>, { disabled: true })}
    </span>
  );
}
