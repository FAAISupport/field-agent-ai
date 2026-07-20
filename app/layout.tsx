import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fieldagentai.com"),
  title: "Field Agent AI, LLC",
  description:
    "Field Agent AI builds AI-powered operating systems for service businesses and LifeSignalAI, a senior wellness check-in product.",
  openGraph: {
    title: "Field Agent AI, LLC",
    description:
      "AI operating systems for the businesses that keep America running.",
    url: "https://fieldagentai.com",
    siteName: "Field Agent AI",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Agent AI, LLC",
    description:
      "AI operating systems for service businesses built around calls, scheduling, estimates, and follow-up."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
