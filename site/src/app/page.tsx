"use client";

import { useRef, useState } from "react";
import NeuralNetwork from "./components/NeuralNetwork";
import { products, type Product, type PipelineStage } from "./showcase/products";
import StageModal from "./showcase/StageModal";

export default function Home() {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<PipelineStage | null>(null);

  function scrollToShowcase() {
    showcaseRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function toggle(product: Product) {
    setExpandedId((prev) => (prev === product.id ? null : product.id));
    setActiveStage(null);
  }

  return (
    <div className="bg-black">
      {/* ─── Hero section ─── */}
      <section className="relative flex min-h-svh flex-col items-center justify-center px-6 py-24">
        <NeuralNetwork />
        <main className="relative z-10 flex max-w-2xl flex-col items-center gap-16">
          {/* Intro */}
          <div className="flex flex-col items-center gap-8 text-center">
            <h2 className="text-xl font-light leading-relaxed text-white/90 sm:text-2xl">
              Hi, I&apos;m Claus Åne. I build the systems that fuel AI.
            </h2>

            <p className="max-w-lg text-base font-light leading-relaxed text-white/50">
              I aim to understand data and AI end to end — from the
              mathematics inside the models to the systems and value they
              produce.
            </p>
          </div>

          {/* CTA — scrolls down */}
          <button
            onClick={scrollToShowcase}
            className="group relative rounded-full border border-white/10 bg-white/[0.03] px-8 py-3 text-sm font-light text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white/90"
          >
            What can I do for you?
            <span className="ml-2 inline-block transition-transform group-hover:translate-y-0.5">
              ↓
            </span>
          </button>
        </main>
      </section>

      {/* ─── Showcase section ─── */}
      <section
        ref={showcaseRef}
        className="flex min-h-svh flex-col items-center justify-center px-6 py-32"
      >
        <div className="w-full max-w-5xl">
          {/* Heading */}
          <div className="mb-16">
            <h1 className="text-2xl font-light text-white/90 sm:text-3xl">
              Products I&apos;d build for you
            </h1>
          </div>

          {/* Product list — vertical */}
          <div className="flex flex-col gap-10">
            {products.map((product) => {
              const isExpanded = expandedId === product.id;

              return (
                <div key={product.id} className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {/* Product card */}
                  <button
                    onClick={() => toggle(product)}
                    className={`group relative flex w-full flex-col gap-3 rounded-2xl border px-10 py-8 text-left transition-all sm:w-80 sm:flex-shrink-0 ${
                      isExpanded
                        ? "border-white/15 bg-white/[0.04]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    <h2 className="text-base font-medium text-white/80">
                      {product.title}
                    </h2>
                    <p className="text-sm font-light text-white/30">
                      {product.subtitle}
                    </p>
                    {product.placeholder && (
                      <span className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-light text-white/20">
                        Soon
                      </span>
                    )}
                  </button>

                  {/* Expanded detail panel — appears to the right */}
                  {isExpanded && (
                    <div className="flex-1 animate-in fade-in slide-in-from-left-4 duration-200">
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-8">
                        {product.placeholder && (
                          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-light text-white/25">
                            Coming soon
                          </span>
                        )}

                        {/* Pipeline stages */}
                        <div className="flex flex-col gap-0">
                          {product.stages.map((stage, i) => (
                            <div key={stage.name} className="relative flex items-start gap-4">
                              {/* Vertical connector */}
                              {i < product.stages.length - 1 && (
                                <div className="absolute left-[9px] top-[24px] h-full w-px bg-white/10" />
                              )}

                              {/* Dot */}
                              <div className="relative z-10 mt-1.5 flex h-[19px] w-[19px] flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-zinc-950">
                                <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
                              </div>

                              {/* Stage button */}
                              <button
                                onClick={() => setActiveStage(stage)}
                                className="mb-6 flex-1 rounded-xl px-4 py-3 text-left transition-all hover:bg-white/[0.04]"
                              >
                                <h3 className="text-sm font-medium text-white/70">
                                  {stage.name}
                                </h3>
                                <p className="mt-1 text-xs font-light text-white/30 line-clamp-1">
                                  {stage.description}
                                </p>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stage modal */}
      {activeStage && (
        <StageModal stage={activeStage} onClose={() => setActiveStage(null)} />
      )}
    </div>
  );
}
