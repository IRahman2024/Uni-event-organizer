import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import SnackbarClientProvider from "@/components/SnackbarClientProvider/SnackbarClientProvider";
import { AnchoredToastProvider, ToastProvider } from "@/shadcn-components/ui/toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: { default: "AfterClass", template: "%s · AfterClass" },
  icons: { icon: "/afterClass.svg" },
  description: "Discover, join, and organize the best events across campus.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <SnackbarClientProvider>
                <ToastProvider>
                  <AnchoredToastProvider>{children}</AnchoredToastProvider>
                </ToastProvider>
              </SnackbarClientProvider>
            </ThemeProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
