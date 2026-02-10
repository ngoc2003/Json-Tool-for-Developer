import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "JSON DevTool & i18n Manager - Online JSON Editor and Translation Sync Tool",
    template: "%s | JSON DevTool",
  },
  description:
    "Free online JSON DevTool for developers. Validate, format, transform JSON. Sync i18n translation files, compare JSON with visual diff viewer. Supports flattening, TypeScript conversion, and more.",
  keywords: [
    "JSON editor",
    "JSON formatter",
    "JSON validator",
    "i18n sync",
    "translation manager",
    "JSON diff viewer",
    "JSON to TypeScript",
    "flatten JSON",
    "JSON tools online",
    "developer tools",
    "localization tool",
    "i18n manager",
  ],
  authors: [{ name: "JSON DevTool" }],
  creator: "JSON DevTool",
  publisher: "JSON DevTool",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "JSON DevTool & i18n Manager",
    title:
      "JSON DevTool & i18n Manager - Online JSON Editor and Translation Sync Tool",
    description:
      "Free online JSON DevTool for developers. Validate, format, transform JSON. Sync i18n translation files, compare JSON with visual diff.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON DevTool & i18n Manager",
    description:
      "Free online JSON DevTool for developers. Validate, format, transform JSON. Sync i18n translation files.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <TooltipProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-auto p-6 bg-muted/30">
                  {children}
                </div>
              </main>
            </div>
          </TooltipProvider>
        </LanguageProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
