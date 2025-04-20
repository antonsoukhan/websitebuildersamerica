// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Website Builders America – Website Builders for Small Businesses",
  description:
    "Professional website development services for small businesses.",
  icons: {
    icon: "/img/faviconcircle2.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Yeseva+One&display=swap"
          rel="stylesheet"
        />
        {/* Phosphor Icons */}
        <script src="https://unpkg.com/phosphor-icons" defer></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K3GZ4BJ4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* Google Analytics + Conversion Tracking */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-16536725348"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16536725348');
            gtag('event', 'conversion', {
              send_to: 'AW-16536725348/YPzOCJ_gmagZEOTOqc09',
              value: 1.0,
              currency: 'VND'
            });
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K3GZ4BJ4');
          `}
        </Script>

        {children}

        {/* Global Call Button */}

        <div className="floating-button-group">
          {/* Messenger */}
          <a
            href="https://m.me/100068177806553"
            className="messenger-chat-button"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on Messenger"
          >
            <img
              src="/icons/Messenger.png"
              alt="Messenger Logo"
              style={{
                height: "3.6rem",
                width: "3.6rem",
                display: "block",
                margin: 0,
                padding: 0,
              }}
            />
          </a>

          {/* Call Me with Phosphor Icon */}
          <a
            href="tel:+16128390429"
            className="call-me-button"
            aria-label="Call Us"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="ph ph-phone"
              style={{ fontSize: "3.6rem", color: "#26baee" }}
            ></i>
          </a>
        </div>
      </body>
    </html>
  );
}
