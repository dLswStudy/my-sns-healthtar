import type {Metadata} from "next";
import "../assets/style/app.scss";
import "../assets/style/tailwind/index.css";
import {Auth} from "@/app/_component/Auth";
import RQProviders from "@/app/_component/RQProvider";

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
        <RQProviders>
            <Auth>
                <>
                    {props.children}
                    {props.modal}
                </>
            </Auth>
            <div id="portal"/>
            <div id="antd-modal-root"/>
        </RQProviders>
        </body>
        </html>
    );
}
