'use client'
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const DEFAULT_TESTIMONIALS = [
  {
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Briar Martin",
    handle: "@briarmartin",
    content: "This product made undercutting all of our competitors an absolute breeze.",
  },
  {
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Avery Johnson",
    handle: "@averywrites",
    content: "Incredible experience from start to finish. Highly recommend to anyone.",
  },
  {
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    name: "Jordan Lee",
    handle: "@jordantalks",
    content: "The best decision we made for our business this year. Game changer!",
  },
  {
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    name: "Alex Rivera",
    handle: "@alexcodes",
    content: "Outstanding support team and an even better product. Five stars!",
  },
];

const VerifyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 48 48"
    className="inline-block flex-shrink-0"
  >
    <polygon
      fill="#42a5f5"
      points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
    />
    <polygon
      fill="#fff"
      points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
    />
  </svg>
);

const TestimonialCard = ({ testimonial }) => (
  <div
    className={cn(
      "mx-2 w-64 flex-shrink-0 rounded-lg border border-border bg-card p-4",
      "shadow-sm transition-all duration-300 ease-out",
      "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
      "sm:mx-3 sm:w-72"
    )}
  >
    <div className="flex items-start gap-3">
      <img
        className="h-10 w-10 flex-shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
        src={testimonial.image}
        alt={testimonial.name}
      />
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-1">
          <p className="truncate text-sm font-medium text-card-foreground">
            {testimonial.name}
          </p>
          <VerifyIcon />
        </div>
        <span className="text-xs text-muted-foreground">{testimonial.handle}</span>
      </div>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-card-foreground/90">
      {testimonial.content}
    </p>
  </div>
);

const MarqueeRow = ({ testimonials, reverse = false, speed = 30 }) => {
  const tripled = useMemo(
    () => [...testimonials, ...testimonials, ...testimonials],
    [testimonials]
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-33.333%); }
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-33.333%); }
            100% { transform: translateX(0%); }
          }
        `}
      </style>
      <div
        className="flex w-max"
        style={{
          animation: `${reverse ? "marquee-reverse" : "marquee"} ${speed}s linear infinite`,
        }}
      >
        {tripled.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} />
        ))}
      </div>
    </div>
  );
};

export const MovingMarquee = ({
  row1 = DEFAULT_TESTIMONIALS,
  row2 = DEFAULT_TESTIMONIALS,
  speed = 30,
  className,
}) => (
  <div
    className={cn(
      "relative left-1/2 w-screen -translate-x-1/2",
      "flex flex-col gap-4 overflow-hidden py-8 sm:gap-6",
      className
    )}
  >
    <MarqueeRow testimonials={row1} speed={speed} />
    <MarqueeRow testimonials={row2} reverse speed={speed} />
  </div>
);

export default MovingMarquee;