import { ImageResponse } from "next/og";

// iOS home-screen icon (PNG). Same gold house as app/icon.svg, on a full navy square.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F172A",
        }}
      >
        <svg width="132" height="132" viewBox="4 5 24 22">
          <path
            d="M5.5 15.5 16 6.5l10.5 9"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 13.6V24.5A1.5 1.5 0 0 0 10.5 26H14v-6h4v6h3.5a1.5 1.5 0 0 0 1.5-1.5V13.6L16 7.6Z"
            fill="#D4AF37"
          />
        </svg>
      </div>
    ),
    size,
  );
}
