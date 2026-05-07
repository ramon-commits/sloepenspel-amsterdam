import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "./components/Toast";
import { ConfirmProvider } from "./components/ConfirmDialog";
import "./admin.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Admin — Sloepenspel Amsterdam" },
  description: "Endless Minds Site Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`em-admin ${inter.variable}`}>
      <ToastProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </ToastProvider>
    </div>
  );
}
