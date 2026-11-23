import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "案件台帳",
  description: "ホシナギ工務店（架空）の案件台帳（講師の見本）",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
