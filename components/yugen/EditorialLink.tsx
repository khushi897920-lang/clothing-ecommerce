import Link from "next/link";
import { ArrowRight } from "lucide-react";

type EditorialLinkProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
};

export function EditorialLink({
  children,
  href = "#",
  className = "",
}: EditorialLinkProps) {
  return (
    <Link className={`editorial-link ${className}`} href={href}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={18} strokeWidth={1.35} />
    </Link>
  );
}
