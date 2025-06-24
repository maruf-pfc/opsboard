/**
 * Conditionally joins CSS class names together.
 * @param classes - A list of strings, which can include falsy values.
 * @returns A single string of space-separated class names.
 */
export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}
