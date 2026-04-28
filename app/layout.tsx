import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function appOrigin(): string {
  const u = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (u) return u.replace(/\/$/, "");
  const v = process.env.VERCEL_URL?.trim();
  if (v) return `https://${v.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export async function generateMetadata(): Promise<Metadata> {
  const base = appOrigin();
  const fcMiniapp = JSON.stringify({
    version: "1",
    imageUrl: `${base}/next.svg`,
    button: {
      title: "Open Absic",
      action: {
        type: "launch_miniapp",
        name: "Absic",
        url: base,
        splashBackgroundColor: "#fafafa",
      },
    },
  });

  return {
    metadataBase: new URL(base),
    title: "Absic",
    description: "Farcaster Mini App",
    other: { "fc:miniapp": fcMiniapp },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
