import Script from "next/script";
import { site } from "@/config/site";
import { AttributionCapture } from "./AttributionCapture";

/**
 * Public-site measurement. Loads Google Tag Manager or GA4 only when an ID is
 * configured (never on /crm). With neither set, no third-party script runs.
 */
export function Analytics() {
  const { gtmId, ga4Id } = site.analytics;

  return (
    <>
      <AttributionCapture />
      {gtmId ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`}
        </Script>
      ) : ga4Id ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(ga4Id)});`}
          </Script>
        </>
      ) : null}
    </>
  );
}
