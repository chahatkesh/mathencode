import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-admin border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-admin-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-admin-primary text-admin-primary-foreground shadow hover:bg-admin-primary/80",
        secondary:
          "border-transparent bg-admin-secondary text-admin-secondary-foreground hover:bg-admin-secondary/80",
        destructive:
          "border-transparent bg-admin-destructive text-admin-destructive-foreground shadow hover:bg-admin-destructive/80",
        outline: "text-admin-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
