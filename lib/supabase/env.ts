/**
 * Supabase environment variables, checked once with a readable error.
 * NEXT_PUBLIC_ vars must be referenced literally (process.env.NAME) so Next.js can inline them in the browser bundle.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local, fill it in, then restart \`npm run dev\`.`);
  }
  return value;
}

export const supabaseUrl = required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabasePublishableKey = required(
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);
