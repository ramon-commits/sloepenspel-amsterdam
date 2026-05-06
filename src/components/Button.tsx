import Link from "next/link";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type Variant = "primary" | "outline" | "light";

export function Button({
  href,
  variant = "primary",
  children,
  arrow = true,
  className = "",
  type = "button",
  onClick,
}: {
  href?: string;
  variant?: Variant;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const variantClass = `btn-${variant}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <FontAwesomeIcon icon={faArrowRight} className="text-sm" aria-hidden />
      )}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a href={href} className={`btn-pill ${variantClass} ${className}`}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={`btn-pill ${variantClass} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn-pill ${variantClass} ${className}`}
    >
      {content}
    </button>
  );
}
