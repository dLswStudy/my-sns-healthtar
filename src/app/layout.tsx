import type { Metadata } from "next";
import "../assets/style/app.build.css";
import {Auth} from "@/app/_component/Auth";

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
        <Auth>
            {children}
        </Auth>
      </body>
    </html>
  );
}
