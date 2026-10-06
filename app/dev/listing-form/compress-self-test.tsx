"use client";

import { useEffect, useState } from "react";
import { compressImage } from "@/lib/images/compress";

/** Builds a big 6000×4000 JPEG (like a phone photo), shrinks it, and reports the result. Dev only. */
export function CompressSelfTest() {
  const [result, setResult] = useState("running…");

  useEffect(() => {
    (async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 6000;
        canvas.height = 4000;
        const ctx = canvas.getContext("2d")!;
        // Noisy gradient so it compresses like a real photo, not a flat colour
        const grad = ctx.createLinearGradient(0, 0, 6000, 4000);
        grad.addColorStop(0, "#1e3a8a");
        grad.addColorStop(1, "#d4af37");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 6000, 4000);
        for (let i = 0; i < 40000; i++) {
          ctx.fillStyle = `hsl(${(i * 37) % 360} 60% 50% / 0.35)`;
          ctx.fillRect((i * 7919) % 6000, (i * 104729) % 4000, 40, 40);
        }
        const original = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/jpeg", 0.95));
        const file = new File([original], "phone-photo.jpg", { type: "image/jpeg" });
        const out = await compressImage(file);
        const report = JSON.stringify({
            inputBytes: file.size,
            inputSize: "6000x4000",
            outputBytes: out.blob.size,
            outputSize: `${out.width}x${out.height}`,
            outputType: out.blob.type,
            underBucketLimit: out.blob.size < 5 * 1024 * 1024,
          });
        setResult(report);
        console.log("[compress-self-test]", report); // also lands in the dev server log
      } catch (e) {
        const message = `ERROR: ${e instanceof Error ? e.message : String(e)}`;
        setResult(message);
        console.log("[compress-self-test]", message);
      }
    })();
  }, []);

  return <pre id="compress-result" className="rounded-lg border bg-card p-4 text-xs whitespace-pre-wrap">{result}</pre>;
}
