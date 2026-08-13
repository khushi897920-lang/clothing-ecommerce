"use client";

import { brandValues } from "@/data/brandValues";

export function BrandValues() {
  return (
    <section className="values-strip" aria-label="YUGEN values">
      {brandValues.map((value) => {
        const Icon = value.icon;
        return (
          <article className="value-item" key={value.title}>
            <Icon aria-hidden="true" size={36} strokeWidth={1.35} />
            <div>
              <h3>{value.title}</h3>
              <p>
                {value.lines[0]}
                <br />
                {value.lines[1]}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
