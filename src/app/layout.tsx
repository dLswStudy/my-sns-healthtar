import type { Metadata } from "next";
import "../assets/style/app.build.css";

export const metadata: Metadata = {
  title: "Healthtar★",
  description: "My sns project - App for Healthy Pleasures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
      {children}
      </body>
    </html>
  );
}
