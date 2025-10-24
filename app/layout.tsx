import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lou Gehrig Fan Club",
  description: "Celebrating the Iron Horse and his incredible legacy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
