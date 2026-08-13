"use client";

import Image from "next/image";

type ProductCardProps = {
  product: {
    name: string;
    price: string;
    image: string;
    alt?: string;
    swatches?: string[];
    slug?: string;
    formattedPrice?: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const swatches = product.swatches || [];
  return (
    <article className="product-card">
      <a className="product-image" href={`/products/${product.slug || "#"}`} aria-label={product.name}>
        <Image src={product.image || "/ABOUT_BG.png"} alt={product.alt || product.name} fill sizes="(min-width: 900px) 23vw, 46vw" />
      </a>
      <h3>{product.name}</h3>
      <p>{product.formattedPrice || product.price}</p>
      {swatches.length > 0 && (
        <div className="swatches" aria-label={`${product.name} available colors`}>
          {swatches.map((swatch, index) => (
            <span
              className={index === 0 ? "selected" : ""}
              style={{ backgroundColor: swatch }}
              key={`${swatch}-${index}`}
            />
          ))}
        </div>
      )}
    </article>
  );
}
