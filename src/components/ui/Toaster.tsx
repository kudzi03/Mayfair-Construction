"use client";

import { useEffect, useState } from "react";
import { onToast } from "@/lib/events";

export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const off = onToast((m) => {
      setMessage(m);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 4200);
    });
    return () => {
      off();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="toast" role="status" aria-live="polite">
      {message && (
        <div className="flex items-start gap-3 bg-bone px-4 py-3.5 text-ink shadow-[0_20px_50px_-15px_rgb(0_0_0/0.5)] ring-1 ring-ink/10">
          <span className="mt-1.5 size-2 flex-none bg-ochre" aria-hidden="true" />
          <p className="text-[0.9375rem] leading-snug font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}
