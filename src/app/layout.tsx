import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admission Warrior | University Admission Preparation",
  description:
    "বাংলাদেশের বিশ্ববিদ্যালয় ভর্তি পরীক্ষার প্রস্তুতির জন্য পড়াশোনা, MCQ অনুশীলন ও অগ্রগতি ট্র্যাকিং।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
