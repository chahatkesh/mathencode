import type { ReactNode } from "react";

export function IconFrame({
  children,
  className = "h-10 w-10 md:h-12 md:w-12",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {children}
    </svg>
  );
}

export function MedalIcon() {
  return (
    <IconFrame>
      <ellipse cx="24" cy="43" rx="9" ry="1.6" fill="#F59E0B" opacity="0.28" />
      <path d="M17.5 6h6.2L21 18.5h-6.2L17.5 6Z" fill="#FB923C" />
      <path d="M24.3 6H30.5l2.7 12.5h-6.2L24.3 6Z" fill="#F43F5E" />
      <circle cx="24" cy="28" r="11" fill="#FBBF24" />
      <circle cx="24" cy="28" r="8.2" fill="#FDE68A" />
      <circle
        cx="24"
        cy="28"
        r="6.6"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="1.3"
      />
      <path
        d="M24 23.6 25.3 26.2l2.9.4-2.1 2 .5 2.8L24 30.1l-2.6 1.3.5-2.8-2.1-2 2.9-.4L24 23.6Z"
        fill="#F59E0B"
      />
    </IconFrame>
  );
}

export function StudentsIcon() {
  return (
    <IconFrame>
      <ellipse cx="24" cy="43" rx="12" ry="1.6" fill="#6366F1" opacity="0.16" />
      <circle cx="17" cy="18" r="5.2" fill="#93C5FD" />
      <path
        d="M8.5 34.5c1.2-5.2 4.4-7.8 8.5-7.8s7.3 2.6 8.5 7.8"
        fill="#60A5FA"
      />
      <circle cx="30" cy="16.5" r="5.6" fill="#FDBA74" />
      <path
        d="M20.2 34.8c1.4-6 5-8.8 9.8-8.8 4.7 0 8.4 2.8 9.8 8.8"
        fill="#FB923C"
      />
      <circle cx="30" cy="15.6" r="2.1" fill="#FED7AA" />
    </IconFrame>
  );
}

export function BooksIcon() {
  return (
    <IconFrame>
      <ellipse cx="24" cy="43" rx="13" ry="1.6" fill="#059669" opacity="0.16" />
      <path d="M24 13.5 7.5 18.2v16.2L24 39.2V13.5Z" fill="#6EE7B7" />
      <path d="M24 13.5 40.5 18.2v16.2L24 39.2V13.5Z" fill="#059669" />
      <path d="M24 16.2 11 19.6v12.2L24 35.6V16.2Z" fill="#ECFDF5" />
      <path d="M24 16.2 37 19.6v12.2L24 35.6V16.2Z" fill="#D1FAE5" />
      <path d="M24 16.2v19.4" stroke="#A7F3D0" strokeWidth="1.3" />
      <path
        d="M14 23.2h7.2M14.4 26.4h6.6M14.8 29.6h5.6"
        stroke="#34D399"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M26.8 23.2H34M27.2 26.4h6.2M27.6 29.6H33"
        stroke="#6EE7B7"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M30.4 17.6 34.2 18.6v8.2l-1.9-1.6-1.9 1.6v-8.2Z"
        fill="#FF6700"
      />
    </IconFrame>
  );
}

export function LiveIcon() {
  return (
    <IconFrame>
      <ellipse cx="24" cy="43" rx="10" ry="1.6" fill="#EF4444" opacity="0.18" />
      <rect x="7" y="18" width="22" height="16" rx="3.5" fill="#EF4444" />
      <path d="M29 23.5 39 19.2v14.2L29 28.5v-5Z" fill="#F87171" />
      <circle cx="16.5" cy="26" r="3.6" fill="#FEE2E2" />
      <circle cx="16.5" cy="26" r="1.8" fill="#FCA5A5" />
      <rect x="16" y="8.5" width="18" height="9" rx="4.5" fill="#111827" />
      <text
        x="25"
        y="15.1"
        textAnchor="middle"
        fill="white"
        fontSize="6.2"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        LIVE
      </text>
    </IconFrame>
  );
}

export function OneStudentIcon() {
  return (
    <IconFrame className="h-14 w-14">
      <ellipse cx="24" cy="43" rx="13" ry="1.6" fill="#FF6700" opacity="0.16" />
      <path d="M9 37c2-9.2 7-13.2 15-13.2s13 4 15 13.2" fill="#FF6700" />
      <path d="M16 37c1.1-4.6 3.8-7 8-7s6.9 2.4 8 7" fill="#FF8A3D" />
      <circle cx="24" cy="14.2" r="7.4" fill="#FDBA74" />
      <circle cx="21" cy="12.2" r="2.6" fill="#FFE4C7" />
      <path
        d="M18.5 16.8c1.6 1.6 3.4 2.3 5.5 2.3s3.9-.7 5.5-2.3"
        fill="none"
        stroke="#C2410C"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </IconFrame>
  );
}

export function IdeaIcon() {
  return (
    <IconFrame className="h-14 w-14">
      <ellipse cx="24" cy="43" rx="10" ry="1.6" fill="#F59E0B" opacity="0.22" />
      <path
        d="M24 6.5a11 11 0 0 0-6.6 19.6c.8.7 1.3 1.6 1.5 2.6h10.2c.2-1 .7-1.9 1.5-2.6A11 11 0 0 0 24 6.5Z"
        fill="#FBBF24"
      />
      <path
        d="M19.2 13.2a6.2 6.2 0 0 1 4.2-2.2"
        fill="none"
        stroke="#FFFBEB"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 14.5v5.2"
        stroke="#FF6700"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M21.2 22.2h5.6"
        stroke="#FF6700"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M19.4 29.2h9.2l-.7 2.3H20l-.6-2.3Z" fill="#37474F" />
      <rect
        x="20.2"
        y="32.1"
        width="7.6"
        height="2.3"
        rx="0.7"
        fill="#111827"
      />
      <rect x="20.8" y="35" width="6.4" height="2.1" rx="0.7" fill="#37474F" />
    </IconFrame>
  );
}

export function GradesIcon() {
  return (
    <IconFrame className="h-14 w-14">
      <ellipse cx="24" cy="43" rx="14" ry="1.6" fill="#37474F" opacity="0.12" />
      <rect x="6.5" y="24" width="9" height="14" rx="2" fill="#FDBA74" />
      <rect x="19.5" y="15" width="9" height="23" rx="2" fill="#FF6700" />
      <rect x="32.5" y="8" width="9" height="30" rx="2" fill="#37474F" />
      <path
        d="M34.8 13.2h4.4M34.8 16.6h4.4M34.8 20h3"
        stroke="#FFF7ED"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </IconFrame>
  );
}
