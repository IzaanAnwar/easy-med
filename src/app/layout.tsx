import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/services/providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Toaster
        duration={2000}
        position="bottom-center"
        toastOptions={{
          classNames: {
            error: "bg-red-500 text-white border-red-700",
            warning: "bg-yellow-500 text-white border-yellow-700",
            success: "bg-green-500 text-white border-green-700",
          },
        }}
      />
      <body className={inter.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
