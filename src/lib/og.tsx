import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { media, mediaLabel, type MediaKey } from "@/content/media";

export const ogSize = { width: 1200, height: 630 };

const assets = join(process.cwd(), "src/assets");
const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Shared social card: photo on the right, condensed headline on ink. */
export async function renderOg({
  eyebrow,
  lines,
  footer,
  image,
}: {
  eyebrow: string;
  lines: string[];
  footer: string;
  image: MediaKey;
}) {
  const [display, body, photo] = await Promise.all([
    readFile(join(assets, "fonts/archivo-extracondensed-800.ttf")),
    readFile(join(assets, "fonts/archivo-500.ttf")),
    readFile(join(assets, `images/${kebab(image)}.jpg`), "base64"),
  ]);
  const longest = Math.max(...lines.map((l) => l.length));
  const size = Math.min(132, Math.floor(1150 / Math.max(longest, 6)));

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#14120f", color: "#ebe5da" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/jpeg;base64,${photo}`}
          alt=""
          width={560}
          height={630}
          style={{ position: "absolute", right: 0, top: 0, width: 560, height: 630, objectFit: "cover", opacity: 0.85 }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: "linear-gradient(90deg, #14120f 0%, #14120f 52%, rgba(20,18,15,0.35) 100%)",
          }}
        />
        {media[image].representative && (
          <div
            style={{
              position: "absolute",
              right: 24,
              bottom: 24,
              display: "flex",
              padding: "6px 10px",
              background: "rgba(20,18,15,0.8)",
              color: "#ebe5da",
              fontFamily: "Body",
              fontSize: 16,
              letterSpacing: 1,
            }}
          >
            {mediaLabel(media[image]).toUpperCase()}
          </div>
        )}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: "56px 64px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Body", fontSize: 22, letterSpacing: 2 }}>
            <div style={{ width: 14, height: 14, background: "#e08a2c" }} />
            {eyebrow.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", fontFamily: "Display", fontSize: size, lineHeight: 0.88 }}>
            {lines.map((line) => (
              <div key={line} style={{ display: "flex" }}>
                {line.toUpperCase()}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              paddingTop: 20,
              borderTop: "1px solid rgba(238,235,228,0.25)",
              fontFamily: "Body",
              fontSize: 24,
              color: "#c9c6bf",
            }}
          >
            {footer}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Display", data: display, weight: 800, style: "normal" },
        { name: "Body", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}

export const ogAlt = (title: string) => `${title} — ${site.name}, ${site.base.city}, ${site.base.country}`;
