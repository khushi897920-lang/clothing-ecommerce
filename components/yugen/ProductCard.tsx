import Image from "next/image";

type ProductCardProps = {
  product: {
    name: string;
    price: string;
    image: string;
    alt: string;
    swatches: string[];
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <a className="product-image" href="#" aria-label={product.name}>
        <Image src={product.image} alt={product.alt} fill sizes="(min-width: 900px) 23vw, 46vw" />
      </a>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <div className="swatches" aria-label={`${product.name} available colors`}>
        {product.swatches.map((swatch, index) => (
          <span
            className={index === 0 ? "selected" : ""}
            style={{ backgroundColor: swatch }}
            key={swatch}
          />
        ))}
      </div>
    </article>
  );
}
