"use client";

import { useState, useEffect } from "react";
import { productApi, mapBackendProduct } from "@/lib/apiClient";
import { EditorialLink } from "./EditorialLink";
import { ProductCard } from "./ProductCard";

export function NewInSection() {
  const [productList, setProductList] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    productApi.getCatalog().then(({ data, error: apiError }) => {
      if (apiError) {
        setError(apiError);
      } else if (data?.products && data.products.length > 0) {
        setProductList(data.products.map(mapBackendProduct).slice(0, 4));
      }
    });
  }, []);

  return (
    <section className="new-in" id="new-in">
      <div className="section-heading-row">
        <div className="heading-with-rule">
          <p className="eyebrow dark">New In</p>
          <span aria-hidden="true" />
        </div>
        <EditorialLink href="/products?sort=newest">View All</EditorialLink>
      </div>
      {error ? (
        <div className="p-6 text-center text-xs text-red-600 bg-red-50/50 rounded-lg">
          Failed to load new arrivals ({error})
        </div>
      ) : (
        <div className="product-grid">
          {productList.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      )}
    </section>
  );
}
