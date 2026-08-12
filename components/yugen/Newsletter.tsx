import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  return (
    <section className="newsletter" id="contact">
      <div className="newsletter-inner">
        <div className="newsletter-art" aria-hidden="true">
          <Image src="/assets/contact side logo.png" alt="YUGEN botanical brand art" fill sizes="23vw" />
        </div>
        <div className="newsletter-copy">
          <p className="eyebrow dark">Stay Inspired</p>
          <h2>Join the YUGEN Circle</h2>
          <p>
            Receive early access to new collections,
            <br />
            exclusive offers, and more.
          </p>
        </div>
        <form className="newsletter-form">
          <label className="sr-only" htmlFor="email">
            Email address
          </label>
          <div className="email-line">
            <input id="email" type="email" placeholder="Enter your email" autoComplete="off" />
            <button type="submit">
              Subscribe
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.35} />
            </button>
          </div>
          <p>
            By subscribing, you agree to our <a href="#">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </section>
  );
}
