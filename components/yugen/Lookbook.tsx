import Image from "next/image";
import { EditorialLink } from "./EditorialLink";

export function Lookbook() {
  return (
    <section className="lookbook" id="lookbook">
      <div className="lookbook-copy">
        <p className="eyebrow dark">Lookbook</p>
        <h2>
          Quiet Moments,
          <br />
          Timeless Style
        </h2>
        <p>
          Discover pieces that move with you,
          <br />
          through every season of life.
        </p>
        <EditorialLink href="#new-in">Explore Lookbook</EditorialLink>
      </div>
      <div className="lookbook-media">
        <Image
          src="/assets/ChatGPT Image Aug 4, 2026, 11_49_07 PM.png"
          alt="Model in a dark editorial garment seated against a warm plaster wall"
          fill
          sizes="55vw"
        />
      </div>
    </section>
  );
}
