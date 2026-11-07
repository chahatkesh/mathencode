import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-admin text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-admin-primary text-admin-primary-foreground shadow hover:bg-admin-primary/90",
        destructive:
          "bg-admin-destructive text-admin-destructive-foreground shadow-sm hover:bg-admin-destructive/90",
        outline:
          "border border-admin-input bg-admin-background shadow-sm hover:bg-admin-accent hover:text-admin-accent-foreground",
        secondary:
          "bg-admin-secondary text-admin-secondary-foreground shadow-sm hover:bg-admin-secondary/80",
        ghost: "hover:bg-admin-accent hover:text-admin-accent-foreground",
        link: "text-admin-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-11 rounded-admin px-3 text-xs",
        lg: "h-11 rounded-admin px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
