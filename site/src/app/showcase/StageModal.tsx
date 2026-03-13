"use client";

import { type PipelineStage } from "./products";

interface StageModalProps {
  stage: PipelineStage;
  onClose: () => void;
}

export default function StageModal({ stage, onClose }: StageModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{ maxWidth: 560, padding: "3.5rem 3rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute text-white/30 transition-colors hover:text-white/70"
          style={{ right: 20, top: 20 }}
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="text-xl font-medium text-white" style={{ marginBottom: 20 }}>
          {stage.name}
        </h3>

        {/* Description */}
        <p
          className="text-sm font-light leading-relaxed text-white/50"
          style={{ marginBottom: 32 }}
        >
          {stage.longDescription ?? stage.description}
        </p>

        {/* Key skills */}
        {stage.skills && stage.skills.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <p
              className="text-xs font-medium uppercase tracking-wider text-white/25"
              style={{ marginBottom: 12 }}
            >
              Key skills
            </p>
            <div className="flex flex-wrap" style={{ gap: 10 }}>
              {stage.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 bg-white/5 text-xs font-light text-white/50"
                  style={{ padding: "6px 14px" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tools */}
        {stage.tools && stage.tools.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <p
              className="text-xs font-medium uppercase tracking-wider text-white/25"
              style={{ marginBottom: 12 }}
            >
              Tools
            </p>
            <div className="flex flex-wrap" style={{ gap: 10 }}>
              {stage.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-light text-blue-300/70"
                  style={{ padding: "6px 14px" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* GitHub link */}
        {stage.githubUrl && (
          <a
            href={stage.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-light text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {stage.githubLabel}
          </a>
        )}
      </div>
    </div>
  );
}
