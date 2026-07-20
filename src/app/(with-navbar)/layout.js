import Navbar from "@/shadcn-components/Navbar(comp-584)";
import { Footerdemo } from "@/shadcn-components/ui/footer-section";

export const metadata = {
  title: "AfterClass",
  description: "Discover, join, and organize the best events across campus.",
};

export default function WithNavbarLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      {children}
      <Footerdemo />
    </div>
  );
}
