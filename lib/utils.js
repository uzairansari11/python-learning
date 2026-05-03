import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * shadcn-style class merger:
 *   cn("p-2", isActive && "bg-muted", className)
 * Resolves Tailwind conflicts (later wins) and ignores falsy values.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
