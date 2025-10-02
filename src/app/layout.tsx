import type { Metadata } from "next";
import "./globals.css";
import { montserrat400 } from "./fonts/montserrat";

export const metadata: Metadata = {
  title: "Interview Chat",
  description: "AI Interview Chat Bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat400.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
