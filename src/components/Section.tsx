import { ReactNode } from "react";

type Variant = "white" | "warm" | "water" | "water-soft" | "water-gradient" | "primary";

const bgMap: Record<Variant, string> = {
  white: "bg-white text-[color:var(--color-primary)]",
  warm: "bg-[color:var(--color-bg-warm)] text-[color:var(--color-primary)]",
  water: "bg-[color:var(--color-water)] text-[color:var(--color-primary)]",
  "water-soft": "bg-[rgba(184,212,227,0.12)] text-[color:var(--color-primary)]",
  "water-gradient":
    "bg-[linear-gradient(180deg,rgba(184,212,227,0.35)_0%,rgba(184,212,227,0.15)_45%,#FFFFFF_100%)] text-[color:var(--color-primary)]",
  primary: "bg-[color:var(--color-primary)] text-white",
};

export function Section({
  children,
  variant = "white",
  className = "",
  id,
  withGrain = false,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  id?: string;
  withGrain?: boolean;
}) {
  return (
    <section
      id={id}
      className={`section-y relative ${bgMap[variant]} ${withGrain ? "grain" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionEyebrow({
  children,
  number,
  className = "",
}: {
  children: ReactNode;
  number?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 mb-5 eyebrow ${className}`}>
      {number && <span className="editorial-num text-base lowercase tracking-normal not-italic">{number}</span>}
      <span className="opacity-80">{children}</span>
    </div>
  );
}

export function SectionHeadline({
  italic,
  italicEnd,
  children,
  className = "",
}: {
  italic?: string;
  italicEnd?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`h2 ${className}`}>
      {italic && (
        <>
          <span className="headline-italic">{italic}</span>{" "}
        </>
      )}
      {children}
      {italicEnd && (
        <>
          {" "}
          <span className="headline-italic">{italicEnd}</span>
        </>
      )}
    </h2>
  );
}
