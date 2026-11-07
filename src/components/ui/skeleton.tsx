import { cn } from "~/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-admin-foreground/15 motion-reduce:animate-none",
        className,
      )}
      {...props}
      aria-hidden="true"
    />
  );
}

export { Skeleton };
