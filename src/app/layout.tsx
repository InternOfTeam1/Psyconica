import "@/app/ui/globals.css"
import Header from "@/components/header";
import Providers from "@/redux/Provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Psyconica",
    template: "%s - Psyconica"
  }, 
  description: "Find answers to your psychological questions that interest you",
  twitter: {
    card: "summary_large_image"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className} 
      style={{ 
        backgroundImage: 'linear-gradient(to right, #E0FBFC, #FAF3E0, #E8E0FC)' 
      }}>
        <Providers>

          <div className="mx-auto max-w-full"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #E0FBFC, #FAF3E0, #E8E0FC)' 
          }}>
          
            <Header />
            {children}
          </div>

        </Providers>
      </body>


    </html>
  );
}
