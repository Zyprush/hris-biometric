import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

const inter = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700","900"] });

export const metadata: Metadata = {
  title: "Smart HRIS",
  description: "HRIS Biometric web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
