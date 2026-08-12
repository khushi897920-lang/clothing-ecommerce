"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorialLink } from "./EditorialLink";

const slides = [
  {
    id: "women",
    label: "01",
    eyebrow: "Women Collection",
    title: (
      <>
        Essence of
        <br />
        Simplicity
      </>
    ),
    description: (
      <>
        Timeless pieces crafted for everyday elegance.
        <br />
        Natural fabrics. Minimal designs. Maximum comfort.
      </>
    ),
    video: "/assets/women-campaign.mp4",
    poster: "/assets/women-poster.png",
    className: "women-video",
  },
  {
    id: "men",
    label: "02",
    eyebrow: "Men Collection",
    title: (
      <>
        Ease in
        <br />
        Motion
      </>
    ),
    description: (
      <>
        Relaxed tailoring, soft structure, and refined essentials
        <br />
        made for every rhythm of the day.
      </>
    ),
    video: "/assets/men-campaign.mp4",
    poster: "/assets/men-poster.png",
    className: "men-video",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const activate = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  const nextSlide = useCallback(() => {
    setActive((current) => (current + 1) % slides.length);
  }, []);

  const previousSlide = useCallback(() => {
    setActive((current) => (current - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === active) {
        try {
          if (video.readyState === 0) video.load();
          video.currentTime = 0;
        } catch {
          // Browsers can reject seeking before metadata is ready; play still reveals the poster/video.
        }
        const playPromise = video.play();
        if (playPromise) {
          playPromise.catch(() => undefined);
        }
      } else {
        video.pause();
      }
    });
  }, [active]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") previousSlide();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextSlide, previousSlide]);

  const restartActiveVideo = () => {
    const current = videoRefs.current[active];
    if (!current) return;
    current.currentTime = 0;
    current.play().catch(() => undefined);
  };

  return (
    <section className="hero" id="top" aria-label="YUGEN campaign">
      <motion.div
        className="hero-track"
        drag={reduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={(_, info) => {
          if (info.offset.x < -70) nextSlide();
          if (info.offset.x > 70) previousSlide();
        }}
        animate={{ x: `-${active * (100 / slides.length)}%` }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1, ease: [0.76, 0, 0.24, 1] }
        }
      >
        {slides.map((slide, index) => (
          <div className="hero-slide" key={slide.id}>
            <video
              ref={(node) => {
                videoRefs.current[index] = node;
              }}
              className={slide.className}
              src={slide.video}
              poster={slide.poster}
              muted
              loop
              playsInline
              autoPlay={index === active}
              preload="auto"
            />
          </div>
        ))}
      </motion.div>

      <div className="hero-shade" />

      <AnimatePresence mode="wait">
        <motion.div
          className="hero-copy"
          key={slides[active].id}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">{slides[active].eyebrow}</p>
          <h1>{slides[active].title}</h1>
          <p className="hero-description">{slides[active].description}</p>
          
          <div className="hero-cta-group">
            <EditorialLink className="hero-cta" href="#new-in">
              Explore Collection
            </EditorialLink>
            <EditorialLink className="hero-cta hero-cta-secondary" href="#lookbook">
              View Lookbook
            </EditorialLink>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="hero-counter" aria-label="Campaign slides">
        <button
          type="button"
          aria-label="Show first campaign"
          aria-pressed={active === 0}
          onClick={() => activate(0)}
        >
          01 — Women
        </button>
        <span aria-hidden="true" />
        <button
          type="button"
          aria-label="Show second campaign"
          aria-pressed={active === 1}
          onClick={() => activate(1)}
        >
          02 — Men
        </button>
      </div>

      <div className="campaign-actions" aria-label="Campaign video controls">
        <button className="campaign-control replay-control" type="button" onClick={restartActiveVideo}>
          <span className="play-circle">
            <RotateCcw aria-hidden="true" size={14} strokeWidth={1.5} />
          </span>
          <span>Replay Film</span>
        </button>

        <div className="campaign-stepper">
          <button
            className="stepper-button stepper-prev"
            type="button"
            aria-label="Show previous campaign film"
            onClick={previousSlide}
          >
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.35} />
          </button>
          <button
            className="stepper-button stepper-next"
            type="button"
            aria-label="Show next campaign film"
            onClick={nextSlide}
          >
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.35} />
          </button>
        </div>
      </div>
    </section>
  );
}

