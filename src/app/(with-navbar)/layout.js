import { Geist, Geist_Mono } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import Navbar from "@/shadcn-components/Navbar(comp-584)";
// import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import { stackClientApp } from "@/stack/client";
import Image from "next/image";
import { Footerdemo } from "@/shadcn-components/ui/footer-section";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AfterClass",
  icons:{
    icon: '/afterClass.svg',
  },
  description: "Campus Events Hub",
};

export default function RootLayout({ children }) {
  // const pathname = usePathname();
  const noNavbarRoutes = ['/SignIn', '/SignUp', '/dashboard'];

  return (
    <StackProvider app={stackClientApp}><StackTheme>
      <div className="bg-card text-card-foreground relative w-full">
        <Navbar />
      </div>
      {children}
      <div>
        <Footerdemo></Footerdemo>
      </div>
    </StackTheme></StackProvider>
  );
}
