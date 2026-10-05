/** Is `href` the current page? "/" only matches exactly; other links also match sub-pages (e.g. /listings/abc). */
export function isActiveLink(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
