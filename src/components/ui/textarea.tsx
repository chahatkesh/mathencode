import * as React from "react";

import { cn } from "~/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-admin border border-admin-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-admin-muted-foreground focus-visible:border-admin-ring focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-admin-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
