/** Same rule the database enforces (supabase/migrations/0001_properties.sql). */
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Title → web address, e.g. "4 BHK Builder Floor in Vasant Vihar!" → "4-bhk-builder-floor-in-vasant-vihar".
 * Lowercase letters, digits and single hyphens only; trimmed to ~80 characters at a word boundary.
 */
export function slugify(text: string): string {
  const slug = text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // é → e
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length <= 80) return slug;
  return slug.slice(0, 80).replace(/-[^-]*$/, "");
}
