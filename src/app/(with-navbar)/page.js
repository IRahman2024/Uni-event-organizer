import CarouselComponent from "@/components/Carousel/Carousel";
import CarouselServer from "@/components/Carousel/CarouselServer";
import CurvedText from "@/components/CurvedText/CurvedText";
import { Features } from "@/components/Features/Features";
import Hero from "@/components/Hero/hero";
import Steps from "@/components/Steps/Steps";
import IndividualTestimonial from "@/components/Testimonial/IndividualTestimonial";
import MovingMarquee from "@/components/Testimonial/MovingMarquee";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import CurvedLoop from "@/shadcn-components/CurvedLoop";
import SplitText from "@/shadcn-components/SplitText";
import { Button } from "@/shadcn-components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid items-center min-h-screen">
      <main className="flex flex-col items-center sm:items-start">
        <div className="w-full">
          <Hero></Hero>
        </div>
        {/* carousel section */}
        <section className="relative overflow-hidden w-full h-full py-20">
          {/* text */}
          <div className="text-center flex flex-col gap-y-2">
            <SplitText
              text="Campus is buzzing"
              className="font-sans text-5xl font-bold"
              delay={100}
              duration={0.07}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            ></SplitText>
            <SplitText
              text="Join the buzz."
              className="font-mono text-lg font-semibold"
              delay={100}
              duration={0.2}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            ></SplitText>
            {/* <p className="font-bold font-sans text-3xl text-foreground mb-6">Campus is buzzing
              <br /> <span className="text-orange-500">Join</span> the buzz.</p>
            <p className="font-bold font-mono text-lg text-foreground">Real-time RSVPs, live head-counts, and one-tap “I’m in.” No login needed to peek.</p> */}
          </div>
          <div>
            {/* <CarouselComponent></CarouselComponent> */}
            <CarouselServer></CarouselServer>
            <div className="flex items-center justify-center my-10">
              <Button
                asChild
                variant="default"  // or create a custom orange variant (see below)
                className="bg-transparent border-2 border-orange-700 hover:bg-orange-700 text-foreground hover:text-white rounded-full px-10 py-5"
              >
                <Link href="/events" className="flex items-center gap-3">
                  Show All Events
                  <MoveRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <CurvedText></CurvedText>
          </div>
          <section className="h-screen">
            <p className="text-6xl text-center font-bold mb-5">Our Features</p>
            <Features></Features>
          </section>
          <section className="min-h-screen">
            <Steps></Steps>
          </section>
          <div className="container mx-auto gap-x-10 my-16">
            <div>
              <p className="text-6xl font-bold text-foreground text-center">They’re Joining…and Loving It</p>
            </div>
            <MovingMarquee></MovingMarquee>
            <p className="text-4xl font-bold  text-foreground text-center my-5">Stories from the insiders</p>
            <IndividualTestimonial></IndividualTestimonial>
          </div>
          {/* <div className="flex">
            <TextGenerateEffect
              words={'Real-time RSVPs, live head-counts, and one-tap “I’m in.” No login needed to peek.'}
            ></TextGenerateEffect>
          </div> */}
        </section>
      </main>
    </div>
  );
}
