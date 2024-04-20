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
      <body className={inter.className} >
        <Providers>

          <div className="mx-auto max-w-full"
          >
            <Header />
            {children}
          </div>

        </Providers>
      </body>


    </html>
  );
}
