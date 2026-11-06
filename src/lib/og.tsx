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
const displayUrl = new URL(
  "../assets/og/bricolage-grotesque-700.ttf",
  import.meta.url,
);

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
      readFont(displayUrl, "bricolage-grotesque-700.ttf"),
    ])
      .then(([semiBold, bold, display]) => [
        {
          name: "Bricolage Grotesque",
          data: fontData(display),
          weight: 700 as const,
          style: "normal" as const,
        },
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
  if (title.length > 72) return 48;
  if (title.length > 48) return 58;
  if (title.length > 28) return 70;
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
        fill="#263238"
      />
      <path
        d="M461 29V114.49L244 248.999L27 114.49V29L244 163.892L461 29Z"
        fill="#FF6700"
      />
    </svg>
  );
}

function MathDoodles() {
  return (
    <svg width="272" height="354" viewBox="0 0 272 354" fill="none">
      <rect x="8" y="8" width="248" height="178" rx="36" fill="#c9e0f2" />
      <path
        d="M48 145H219M72 158V38"
        stroke="#263238"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M91 122C115 122 130 101 149 79C165 60 187 53 215 51"
        stroke="#ff6700"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx="149" cy="79" r="8" fill="#263238" />
      <path
        d="M208 135L219 145L208 155M62 49L72 38L82 49"
        stroke="#263238"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="8" y="200" width="118" height="138" rx="32" fill="#d6e59a" />
      <path
        d="M35 252H99M35 281H99"
        stroke="#263238"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <rect x="140" y="200" width="116" height="138" rx="32" fill="#f6d7e8" />
      <path
        d="M165 304L197 230L231 304H165Z"
        stroke="#263238"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M173 286H221"
        stroke="#ff6700"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="239" cy="181" r="32" fill="#ff6700" />
      <path
        d="M239 164V198M222 181H256M227 169L251 193M227 193L251 169"
        stroke="#f4f0e5"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export async function renderOgImage(card: OgCard) {
  const fonts = await loadFonts();
  const eyebrow = forImage(card.eyebrow, 36) || "MathEncode";
  const title = forImage(card.title, 96) || "MathEncode";
  const description = forImage(card.description, 125);
  const detail = forImage(card.detail, 48);
  const size = titleSize(title);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "38px 48px 30px",
        backgroundColor: "#f4f0e5",
        color: "#263238",
        fontFamily: "Reddit Sans",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Mark />
          <div
            style={{
              display: "flex",
              marginLeft: 12,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            <span>Math</span>
            <span style={{ color: "#ff6700" }}>Encode</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: 999,
            backgroundColor: "#f9d8c0",
            padding: "12px 22px",
            fontSize: 21,
            fontWeight: 700,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 40 }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 792,
            padding: "24px 28px",
            borderRadius: 36,
            backgroundColor: "#fffdf7",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 60,
              height: 7,
              borderRadius: 8,
              backgroundColor: "#ff6700",
              marginBottom: 20,
            }}
          />
          <div
            style={{
              width: "100%",
              display: "block",
              lineClamp: 3,
              fontFamily: "Bricolage Grotesque",
              fontSize: size,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -1.6,
              wordBreak: "break-word",
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                width: "100%",
                display: "block",
                lineClamp: 3,
                marginTop: 20,
                fontSize: 25,
                fontWeight: 600,
                lineHeight: 1.3,
                color: "#4b575a",
                wordBreak: "break-word",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", width: 272, flexShrink: 0 }}>
          <MathDoodles />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "2px solid #dcded0",
          paddingTop: 20,
          fontSize: 21,
          fontWeight: 600,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              width: 10,
              height: 10,
              borderRadius: 10,
              backgroundColor: "#ff6700",
            }}
          />
          <span>{forImage(siteHost(), 48)}</span>
        </div>
        {detail ? (
          <div style={{ display: "flex", maxWidth: 650, textAlign: "right" }}>
            {detail}
          </div>
        ) : null}
      </div>
    </div>,
    {
      ...ogSize,
      fonts,
    },
  );
}
