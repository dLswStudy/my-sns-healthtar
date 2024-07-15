import type {Metadata} from "next";
import "../assets/style/app.scss";
import "../assets/style/tailwind/index.css";
import {Auth} from "@/app/_component/Auth";
import MobileNavigator from "@/app/(protected)/_components/MobileNavigator";
import Providers from "@/app/_component/Provider";

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
        <Providers>
            <Auth>
                {children}
            </Auth>
        </Providers>
        </body>
        </html>
    );
}
