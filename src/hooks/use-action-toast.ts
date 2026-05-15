"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import type { ActionState } from "@/lib/actions";

export function useActionToast(state: ActionState, options?: { skipInitialMessage?: string }) {
  const lastStateRef = useRef<ActionState | null>(null);

  useEffect(() => {
    if (!state.message || state === lastStateRef.current) return;
    if (options?.skipInitialMessage && state.message === options.skipInitialMessage) return;

    lastStateRef.current = state;

    if (state.ok) {
      toast.success(state.message);
      return;
    }

    toast.error(state.message);
  }, [options?.skipInitialMessage, state]);
}
