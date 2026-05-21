import type { Metadata } from "next";
import "./globals.css"; // <--- THIS LINE IS THE KEY

export const metadata: Metadata = {
  title: "Bilal Travels - Hajj & Umrah",
  description: "Worldwide tickets and pilgrimage packages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}