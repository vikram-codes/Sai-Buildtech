"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/*
 * next-themes injects an inline <script> that applies the theme before first paint (no flash).
 * React 19 logs an error when a <script> is rendered on the client, so on the client we mark it
 * as "text/plain" (inert). The server-rendered copy has already run by then.
 */
const scriptProps =
  typeof window === "undefined" ? undefined : ({ type: "text/plain" } as const);

/** Adds/removes the `dark` class on <html>. Defaults to dark; the choice is remembered per visitor. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
}
