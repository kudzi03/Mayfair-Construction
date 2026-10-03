import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { JsonLd } from "@/components/seo/JsonLd";
import { Toaster } from "@/components/ui/Toaster";
import { businessSchema, websiteSchema } from "@/lib/schema";

/** Public website chrome. The CRM demo under /crm has its own layout. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd data={[businessSchema(), websiteSchema()]} />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <MobileActionBar />
      <Toaster />
      <RevealObserver />
    </>
  );
}
