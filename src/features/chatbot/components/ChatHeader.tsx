"use client";

import { Bot, HeartPulse, X } from "lucide-react";

type ChatHeaderProps = {
  onClose: () => void;
};

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-t-3xl bg-[linear-gradient(135deg,#C51624_0%,#F43F4E_100%)] px-4 py-4 text-white">
      <div
        className="absolute -right-8 -top-10 size-28 rounded-full bg-white/14"
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/18 ring-1 ring-white/24">
            <HeartPulse className="size-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-heading text-base font-bold">
                Asisten CardioSense
              </h2>
              <Bot className="size-4 text-[#FAD7DD]" aria-hidden="true" />
            </div>
            <p className="truncate text-xs font-medium text-white/78">
              Edukasi kesehatan jantung
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/16 px-2.5 py-1 text-[11px] font-semibold text-white">
              <span className="size-2 rounded-full bg-[#35B8E5]" />
              Siap membantu
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Tutup chatbot"
          onClick={onClose}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-white/14 text-white transition-colors hover:bg-white/24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
}
