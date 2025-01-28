import type { Metadata } from "next";
import "./globals.css";
import "../styles/app.scss";
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import AuthProvider from "@/halper/AuthProvider";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Personal Project Management",
  description: "Manage your personal project for complete the goal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
            <ToastContainer />
            <main>{children}</main>
        </AuthProvider>
      </body>
    </html >
  );
}
