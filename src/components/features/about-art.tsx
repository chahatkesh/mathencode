function SceneSheet() {
  return (
    <>
      <circle cx="180" cy="152" r="108" fill="#fffdf8" fillOpacity="0.5" />
      <rect
        x="108"
        y="50"
        width="168"
        height="208"
        rx="22"
        fill="#263238"
        fillOpacity="0.1"
      />
      <rect
        x="96"
        y="38"
        width="168"
        height="208"
        rx="22"
        fill="#fffdf8"
        stroke="#263238"
        strokeWidth="3.5"
      />
    </>
  );
}

export function DiagnosticScene() {
  return (
    <svg viewBox="0 0 360 300" fill="none" aria-hidden="true">
      <SceneSheet />
      <rect x="148" y="26" width="64" height="22" rx="11" fill="#ff6700" />
      <text className="scene-kicker" x="120" y="78">
        AP Math
      </text>
      <text className="scene-title" x="120" y="106">
        Level check
      </text>
      <text className="scene-row" x="120" y="142">
        Functions
      </text>
      <rect
        x="120"
        y="150"
        width="120"
        height="9"
        rx="4.5"
        fill="#263238"
        fillOpacity="0.08"
      />
      <rect x="120" y="150" width="88" height="9" rx="4.5" fill="#ff6700" />
      <text className="scene-row" x="120" y="180">
        Trigonometry
      </text>
      <rect
        x="120"
        y="188"
        width="120"
        height="9"
        rx="4.5"
        fill="#263238"
        fillOpacity="0.08"
      />
      <rect
        x="120"
        y="188"
        width="62"
        height="9"
        rx="4.5"
        fill="#263238"
        fillOpacity="0.4"
      />
      <text className="scene-row" x="120" y="218">
        Limits
      </text>
      <rect
        x="120"
        y="226"
        width="120"
        height="9"
        rx="4.5"
        fill="#263238"
        fillOpacity="0.08"
      />
      <rect
        x="120"
        y="226"
        width="34"
        height="9"
        rx="4.5"
        fill="#263238"
        fillOpacity="0.32"
      />
    </svg>
  );
}

export function ClassScene() {
  return (
    <svg viewBox="0 0 360 300" fill="none" aria-hidden="true">
      <SceneSheet />
      <text className="scene-kicker" x="120" y="74">
        Small cohort
      </text>
      <text className="scene-title" x="120" y="102">
        Week 1
      </text>
      <CheckRow y={124} label="Limits" done />
      <CheckRow y={156} label="Derivatives" done />
      <CheckRow y={188} label="Integrals" />
    </svg>
  );
}

function CheckRow({
  y,
  label,
  done,
}: {
  y: number;
  label: string;
  done?: boolean;
}) {
  return (
    <g>
      <rect
        x="120"
        y={y}
        width="18"
        height="18"
        rx="6"
        fill={done ? "#ff6700" : "#fffdf8"}
        stroke={done ? "#ff6700" : "#263238"}
        strokeOpacity={done ? 1 : 0.28}
        strokeWidth="2"
      />
      {done ? (
        <path
          d={`M${124} ${y + 9.5} l3.4 3.4 6.6-7.2`}
          stroke="#211c18"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      <text className="scene-row" x="148" y={y + 14}>
        {label}
      </text>
    </g>
  );
}

export function ScoreScene() {
  return (
    <svg viewBox="0 0 360 300" fill="none" aria-hidden="true">
      <SceneSheet />
      <text className="scene-kicker" x="180" y="78" textAnchor="middle">
        AP score
      </text>
      <text className="scene-score" x="180" y="168" textAnchor="middle">
        5
      </text>
      {[0, 1, 2, 3, 4].map((index) => (
        <circle
          key={index}
          cx={132 + index * 24}
          cy={206}
          r="6"
          fill={index >= 2 ? "#ff6700" : "#263238"}
          fillOpacity={index >= 2 ? 1 : 0.18}
        />
      ))}
    </svg>
  );
}

export function StudentsArt() {
  return (
    <svg
      viewBox="0 0 360 280"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <circle cx="184" cy="124" r="108" fill="#fffdf8" fillOpacity="0.45" />
      <rect
        x="86"
        y="22"
        width="196"
        height="96"
        rx="18"
        fill="#263238"
        fillOpacity="0.1"
      />
      <rect
        x="78"
        y="14"
        width="196"
        height="96"
        rx="18"
        fill="#fffdf8"
        stroke="#263238"
        strokeWidth="3.5"
      />
      <path
        d="M108 72c22-4 34-36 56-36s26 22 52 8"
        stroke="#ff6700"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <rect x="18" y="194" width="52" height="58" rx="26" fill="#263238" />
      <circle cx="44" cy="180" r="20" fill="#263238" />
      <rect x="86" y="184" width="58" height="68" rx="29" fill="#1d292e" />
      <circle cx="115" cy="168" r="22" fill="#1d292e" />
      <rect x="232" y="188" width="56" height="64" rx="28" fill="#263238" />
      <circle cx="260" cy="174" r="21" fill="#263238" />
      <rect x="154" y="172" width="66" height="80" rx="33" fill="#ff6700" />
      <circle cx="187" cy="154" r="25" fill="#ff6700" />
    </svg>
  );
}

export function YearsArt({ value }: { value: string }) {
  const years = Math.min(
    8,
    Math.max(4, Number(value.match(/\d+/)?.[0] ?? 6) || 6),
  );
  const barWidth = 18;
  const gap = 12;
  const total = years * barWidth + (years - 1) * gap;
  const left = 168 - total;
  const base = 132;

  return (
    <svg
      viewBox="0 0 180 150"
      fill="none"
      preserveAspectRatio="xMaxYMin meet"
      aria-hidden="true"
    >
      <path
        d="M8 132h164"
        stroke="#263238"
        strokeOpacity="0.18"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {Array.from({ length: years }, (_, index) => {
        const height = 28 + ((base - 36 - 28) * index) / (years - 1);
        const x = left + index * (barWidth + gap);
        const last = index === years - 1;
        return (
          <rect
            key={index}
            x={x}
            y={base - height}
            width={barWidth}
            height={height}
            rx="9"
            fill={last ? "#ff6700" : "#263238"}
            fillOpacity={last ? 1 : 0.35 + (0.65 * index) / (years - 1)}
          />
        );
      })}
    </svg>
  );
}

export function ScoresArt() {
  return (
    <svg
      viewBox="0 0 200 170"
      fill="none"
      preserveAspectRatio="xMaxYMin meet"
      aria-hidden="true"
    >
      <g transform="rotate(-8 118 78)">
        <rect
          x="78"
          y="22"
          width="108"
          height="132"
          rx="18"
          fill="#263238"
          fillOpacity="0.1"
        />
        <rect
          x="70"
          y="14"
          width="108"
          height="132"
          rx="18"
          fill="#fffdf8"
          stroke="#263238"
          strokeWidth="3.5"
        />
        <path
          d="M96 70 114 88l28-32"
          stroke="#ff6700"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="98" cy="116" r="6" fill="#263238" fillOpacity="0.16" />
        <circle cx="116" cy="116" r="6" fill="#263238" fillOpacity="0.16" />
        <circle cx="134" cy="116" r="6" fill="#ff6700" />
        <circle cx="152" cy="116" r="6" fill="#ff6700" />
      </g>
    </svg>
  );
}

export function RateArt({ value }: { value: string }) {
  const parsed = Number(value.match(/\d+/)?.[0]);
  const percent = Number.isFinite(parsed)
    ? Math.min(100, Math.max(0, parsed))
    : 88;
  const radius = 78;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <circle cx="110" cy="110" r={radius} stroke="#3c4e55" strokeWidth="16" />
      <circle
        cx="110"
        cy="110"
        r={radius}
        stroke="#ff6700"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - percent / 100)}
        transform="rotate(-90 110 110)"
      />
    </svg>
  );
}

export function CoursesArt() {
  return (
    <svg
      viewBox="0 0 250 180"
      fill="none"
      preserveAspectRatio="xMaxYMid meet"
      aria-hidden="true"
    >
      <rect
        x="18"
        y="42"
        width="128"
        height="118"
        rx="18"
        fill="#c9e0f2"
        stroke="#263238"
        strokeWidth="3.5"
        transform="rotate(-14 82 101)"
      />
      <rect
        x="108"
        y="30"
        width="128"
        height="128"
        rx="20"
        fill="#263238"
        fillOpacity="0.1"
      />
      <rect
        x="98"
        y="18"
        width="128"
        height="128"
        rx="20"
        fill="#fffdf8"
        stroke="#263238"
        strokeWidth="3.5"
      />
      <rect x="118" y="40" width="56" height="14" rx="7" fill="#ff6700" />
      <path
        d="M118 72h88M118 94h68M118 116h48"
        stroke="#263238"
        strokeOpacity="0.22"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
