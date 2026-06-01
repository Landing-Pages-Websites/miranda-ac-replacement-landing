import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "AC Replacement on the Treasure Coast | Miranda Plumbing & Air",
  description:
    "Need a new AC system on Florida's Treasure Coast? Miranda Plumbing & Air installs energy-efficient AC replacements with same-week scheduling, free in-home Comfort Advisor visits, and financing on approved credit. Serving Port St. Lucie, Stuart, Jupiter & Palm Beach Gardens since 1981.",
  openGraph: {
    title: "AC Replacement on the Treasure Coast | Miranda Plumbing & Air",
    description:
      "Free in-home Comfort Advisor visit. Same-week install. Financing on approved credit. Ruud Pro Partner with full warranty. Family-owned since 1981.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AC Replacement on the Treasure Coast | Miranda Plumbing & Air",
    description:
      "Free Comfort Advisor visit, same-week AC replacement, and financing on approved credit across Florida's Treasure Coast.",
  },
  icons: {
    icon: [{ url: "/images/favicon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/images/favicon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* MegaTag config — Miranda AC Replacement LP */}
        <meta name="mega-site-id" content="529f83af-a4e3-47ca-9cfc-c68f0388db1e" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.MEGA_TAG_CONFIG={siteKey:"c1oonazi5u9kxj4e",siteId:"529f83af-a4e3-47ca-9cfc-c68f0388db1e",gtmId:"GTM-NSBW6QX9"};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";`,
          }}
        />
        <script
          id="optimizer-script"
          src="https://cdn.gomega.ai/scripts/optimizer.min.js"
          data-site-id="529f83af-a4e3-47ca-9cfc-c68f0388db1e"
          async
        />
        {/* Google Tag Manager — customer container */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NSBW6QX9');`,
          }}
        />
      </head>
      <body className="antialiased">
        {/* GTM noscript fallback */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NSBW6QX9" height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
        </noscript>
        {/* CallTrackingMetrics */}
        <Script
          id="ctm-script"
          src="//572388.tctm.co/t.js"
          strategy="afterInteractive"
          async
        />
        {children}
      </body>
    </html>
  );
}
