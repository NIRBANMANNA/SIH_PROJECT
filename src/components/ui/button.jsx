import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";
import { FiSend } from "react-icons/fi";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        dotted:
          "rounded-2xl border-2 border-dashed border-black bg-white text-black font-semibold uppercase transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer",
        "dotted-glass":
          "rounded-2xl border-2 border-dashed border-white/70 bg-white/10 text-white font-semibold uppercase backdrop-blur-md transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:bg-white/20 hover:border-white hover:shadow-[4px_4px_0px_rgba(255,255,255,0.85)] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer",
        neumorphic:
          "rounded-full bg-white text-slate-700 shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)] hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)] hover:text-violet-500 active:shadow-[inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]",
        "neumorphic-glass":
          "rounded-full bg-white/12 text-white/90 border border-white/20 backdrop-blur-md shadow-[-4px_-4px_10px_rgba(255,_255,_255,_0.2),_4px_4px_12px_rgba(0,_0,_0,_0.4)] hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.25),_1px_1px_5px_rgba(0,_0,_0,_0.4),inset_-2px_-2px_5px_rgba(255,_255,_255,_0.3),inset_2px_2px_4px_rgba(0,_0,_0,_0.4)] hover:text-violet-300 active:shadow-[inset_-2px_-2px_5px_rgba(255,_255,_255,_0.35),inset_2px_2px_4px_rgba(0,_0,_0,_0.5)]",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2.5 px-6 text-base has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9 rounded-full",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

function DottedButton({
  className,
  children,
  glass = false,
  ...props
}) {
  return (
    <button
      className={cn(
        glass
          ? "rounded-2xl border-2 border-dashed border-white/70 bg-white/10 px-6 py-3 font-semibold uppercase text-white backdrop-blur-md transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:bg-white/20 hover:border-white hover:shadow-[4px_4px_0px_rgba(255,255,255,0.85)] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer"
          : "rounded-2xl border-2 border-dashed border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer",
        className
      )}
      {...props}
    >
      {children || "Hover me"}
    </button>
  );
}

function NeumorphismButton({
  className,
  children,
  icon = <FiSend />,
  ...props
}) {
  return (
    <button
      className={cn(
        `px-4 py-2 rounded-full 
        flex items-center gap-2 
        text-slate-500
        shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
        
        transition-all
        cursor-pointer

        hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
        hover:text-violet-500
        active:shadow-[inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]`,
        className
      )}
      {...props}
    >
      {icon}
      {children ? <span>{children}</span> : <span>Hover Me</span>}
    </button>
  );
}

export { Button, buttonVariants, DottedButton, NeumorphismButton }
