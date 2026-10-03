import type { Metadata } from "next";
import { CrmShell } from "@/crm/components/CrmShell";
import "./crm.css";

/**
 * DEMO CRM. Fictional data kept in the visitor's own browser; there is no
 * login because there is nothing real to protect. A production CRM needs
 * authentication before any real customer record is stored (see README).
 */
export const metadata: Metadata = {
  title: { default: "CRM demo", template: "%s · CRM demo" },
  robots: { index: false, follow: false, nocache: true },
};

export default function CrmLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <CrmShell>{children}</CrmShell>;
}
