import type { Metadata } from "next";
import "./globals.css";
import "../styles/app.scss";
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import Providers from "@/halper/Providers";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "TaskUp",
  description: "Your personal project management",
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <Providers>
        <main>{children}</main>
        </Providers>
      </body>
    </html >
  );
}
