import { products } from "@/data/products";
import { EditorialLink } from "./EditorialLink";
import { ProductCard } from "./ProductCard";

export function NewInSection() {
  return (
    <section className="new-in" id="new-in">
      <div className="section-heading-row">
        <div className="heading-with-rule">
          <p className="eyebrow dark">New In</p>
          <span aria-hidden="true" />
        </div>
        <EditorialLink href="#women">View All</EditorialLink>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
