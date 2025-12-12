import CarouselComponent from "@/components/Carousel/Carousel";
import CarouselServer from "@/components/Carousel/CarouselServer";
import CurvedText from "@/components/CurvedText/CurvedText";
import Hero from "@/components/Hero/hero";
import IndividualTestimonial from "@/components/Testimonial/IndividualTestimonial";
import MovingMarquee from "@/components/Testimonial/MovingMarquee";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import CurvedLoop from "@/shadcn-components/CurvedLoop";
import SplitText from "@/shadcn-components/SplitText";
import Image from "next/image";

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
            <div>
              <CarouselServer></CarouselServer>
              <CurvedText></CurvedText>
            </div>
          </div>
          <div className="container mx-auto gap-x-10">
              <MovingMarquee></MovingMarquee>
              <IndividualTestimonial></IndividualTestimonial>
          </div>
          <div className="flex">
            <TextGenerateEffect
              words={'Real-time RSVPs, live head-counts, and one-tap “I’m in.” No login needed to peek.'}
            ></TextGenerateEffect>
          </div>
        </section>
      </main>
    </div>
  );
}
