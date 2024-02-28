import "@/app/ui/globals.css"
import Header from "@/components/header";
import Providers from "@/redux/Provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Psyconica",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <Header />
          <div className="p-13">{children}</div>
        </body>
      </Providers>

    </html>
  );
}
