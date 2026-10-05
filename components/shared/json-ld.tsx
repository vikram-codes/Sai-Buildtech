/**
 * Structured data for search engines (schema.org JSON-LD), as Next.js recommends.
 * `<` is escaped so text inside the data can never close the script tag (XSS protection).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
