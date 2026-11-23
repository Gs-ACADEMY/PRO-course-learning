import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "案件台帳",
  description: "案件台帳（1/8 時点のひな形）",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
