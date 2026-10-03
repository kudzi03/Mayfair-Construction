"use client";

import { createContext, useContext } from "react";
import type { StageId } from "../config";

export type ToastLink = { href: string; label: string };

export type CrmUi = {
  /** Quick-create; optionally for an existing customer. */
  newEnquiry: (opts?: { customerId?: string }) => void;
  openSearch: () => void;
  toast: (text: string, link?: ToastLink) => void;
  /** Set / move the next follow-up. "contacted" logs the contact first. */
  followUp: (opportunityId: string, mode?: "reschedule" | "contacted") => void;
  /** Move an opportunity to a stage, asking only what that stage needs. */
  moveTo: (opportunityId: string, stage: StageId) => void;
};

export const CrmUiContext = createContext<CrmUi | null>(null);

export function useCrmUi() {
  const ui = useContext(CrmUiContext);
  if (!ui) throw new Error("useCrmUi must be used inside the CRM shell");
  return ui;
}
