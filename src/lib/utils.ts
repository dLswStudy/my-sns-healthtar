import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const applyPrefix = (prefix, classes) => {
  classes = classes.split(' ')
  return classes.map(cls => `${prefix}:${cls}`).join(' ');
};
