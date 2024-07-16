import type {Metadata} from "next";
import "../assets/style/app.scss";
import "../assets/style/tailwind/index.css";
import {Auth} from "@/app/_component/Auth";
import Providers from "@/app/_component/Provider";

export const metadata: Metadata = {
    title: "Healthtar★",
    description: "My sns project - App for Healthy Pleasures",
};

export default function RootLayout(props: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <html>
        <body>
        <Providers>
            <Auth>
                <>
                    {props.children}
                    {props.modal}
                </>
            </Auth>
        </Providers>
        <div id="portal"/>
        </body>
        </html>
    );
}
