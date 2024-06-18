import "@/app/ui/globals.css"
import Header from "@/components/header";
import Providers from "@/redux/Provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://psyconica.vercel.app'),
  title: {
    default: "Psyconica",
    template: "%s - Psyconica"
  },
  description: "Ваша поддержка рядом - найдите своего психолога онлайн!",
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
      <head>
        <meta
          name="keywords"
          content="цифровые технологии, коммуникативные навыки, установить границы, научиться говорить нет, предотвращение перегрузки, совместная реализация целей, семейное счастье, роль сна, ментальное здоровье, осознанность, справляться с депрессией, баланс работа личная жизнь, положительная атмосфера, поддерживать романтику, долговременные отношения, значимые отношения, определить приоритеты, избегать растерянности, эффективное планирование времени, эмоциональная близость, эмоциональная стойкость, лидерские качества, управление командой, различать эмоции, реагировать на эмоции, реалистичные цели, личностный рост, сильные стороны, преодолевать барьеры в общении, развивать эмпатию, справляться со стрессом, ранние признаки депрессии, решать разногласия, принимать компромиссы, техники релаксации, ментальные проблемы, техники самопомощи, тревога, активное слушание, профессиональные навыки"
        />
        <meta name="robots" content="noindex, nofollow" />
      </head>
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
