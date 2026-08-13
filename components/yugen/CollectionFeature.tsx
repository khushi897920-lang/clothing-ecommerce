"use client";

import Image from "next/image";
import Link from "next/link";
import { EditorialLink } from "./EditorialLink";

type CollectionFeatureProps = {
  eyebrow: string;
  title: React.ReactNode;
  cta: string;
  image: string;
  imageAlt: string;
  variant: "women" | "men";
  href?: string;
};

export function CollectionFeature({
  eyebrow,
  title,
  cta,
  image,
  imageAlt,
  variant,
  href,
}: CollectionFeatureProps) {
  const targetHref = href || (variant === "women" ? "/women" : "/men");

  return (
    <section className={`collection-feature collection-${variant}`} id={variant}>
      <div className="collection-copy">
        <p className="eyebrow dark">{eyebrow}</p>
        <h2>{title}</h2>
        <span className="short-rule" aria-hidden="true" />
        <EditorialLink href={targetHref}>{cta}</EditorialLink>
      </div>
      <Link href={targetHref} className="collection-media block relative cursor-pointer" aria-label={eyebrow}>
        <Image src={image} alt={imageAlt} fill sizes="70vw" priority={false} />
      </Link>
    </section>
  );
}
