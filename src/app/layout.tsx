import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { WebsiteDataProvider } from "@/contexts/WebsiteDataProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "webDirectory",
  description: "Your daily-use website directory with access statistics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WebsiteDataProvider>
            <div className="flex min-h-screen w-full flex-col">
              <Header />
              <main className="flex-1 container mx-auto p-4 md:p-8">
                {children}
              </main>
              <Toaster />
            </div>
          </WebsiteDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
