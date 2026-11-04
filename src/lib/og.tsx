import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { clipText, ogSafe, siteHost } from "~/lib/seo";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export type OgCard = {
  eyebrow: string;
  title: string;
  description?: string;
  detail?: string;
};

const semiBoldUrl = new URL(
  "../assets/og/reddit-sans-600.ttf",
  import.meta.url,
);
const boldUrl = new URL("../assets/og/reddit-sans-700.ttf", import.meta.url);

function fontData(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

async function readFont(url: URL, filename: string) {
  try {
    return await readFile(url);
  } catch {
    return readFile(path.join(process.cwd(), "src/assets/og", filename));
  }
}

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 600 | 700;
  style: "normal";
};

let fontsPromise: Promise<OgFont[]> | null = null;

function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFont(semiBoldUrl, "reddit-sans-600.ttf"),
      readFont(boldUrl, "reddit-sans-700.ttf"),
    ])
      .then(([semiBold, bold]) => [
        {
          name: "Reddit Sans",
          data: fontData(semiBold),
          weight: 600 as const,
          style: "normal" as const,
        },
        {
          name: "Reddit Sans",
          data: fontData(bold),
          weight: 700 as const,
          style: "normal" as const,
        },
      ])
      .catch((error: unknown) => {
        fontsPromise = null;
        throw error;
      });
  }
  return fontsPromise;
}

function forImage(value: string | undefined, max: number) {
  if (!value) return "";
  return ogSafe(clipText(value, max));
}

function titleSize(title: string) {
  if (title.length > 70) return 52;
  if (title.length > 48) return 62;
  if (title.length > 28) return 72;
  return 84;
}

function Mark() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 488 488"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M244 289.275L27 156.73V411.448L88.6254 459.471V289.275L244 377.045L399.375 289.275V459.471L461 411.448V156.73L244 289.275Z"
        fill="#FFFFFF"
      />
      <path
        d="M461 29V114.49L244 248.999L27 114.49V29L244 163.892L461 29Z"
        fill="#FF6700"
      />
    </svg>
  );
}

export async function renderOgImage(card: OgCard) {
  const fonts = await loadFonts();
  const eyebrow = forImage(card.eyebrow, 36) || "MathEncode";
  const title = forImage(card.title, 90) || "MathEncode";
  const description = forImage(card.description, 130);
  const detail = forImage(card.detail, 48);
  const size = titleSize(title);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#111827",
        color: "#FFFFFF",
        fontFamily: "Reddit Sans",
      }}
    >
      <div
        style={{
          width: 18,
          height: "100%",
          backgroundColor: "#FF6700",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 1182,
          height: "100%",
          padding: "56px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Mark />
            <div
              style={{
                display: "flex",
                marginLeft: 16,
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              <div style={{ display: "flex" }}>Math</div>
              <div style={{ display: "flex", color: "#FF6700" }}>Encode</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: 999,
              backgroundColor: "rgba(255,103,0,0.16)",
              color: "#FF6700",
              fontSize: 22,
              fontWeight: 700,
              padding: "10px 18px",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 1000 }}>
          <div
            style={{
              display: "flex",
              width: 1000,
              fontSize: size,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.4,
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                display: "flex",
                width: 920,
                marginTop: 22,
                fontSize: 28,
                fontWeight: 600,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.74)",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255,255,255,0.16)",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 22,
              fontSize: 22,
              fontWeight: 600,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            <div style={{ display: "flex" }}>{siteHost()}</div>
            {detail ? <div style={{ display: "flex" }}>{detail}</div> : null}
          </div>
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts,
    },
  );
}
