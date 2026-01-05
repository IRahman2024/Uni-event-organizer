'use client';
import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const OfferCard = React.forwardRef(({ eventData }, ref) => (
    <motion.a
        ref={ref}
        href={`/events/${eventData.id}`}
        className="relative flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] h-[500px] sm:h-[540px] md:h-[580px] rounded-2xl overflow-hidden group snap-start"
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ perspective: "1000px" }}
    >
        {/* Background Image */}
        <img
            src={eventData.eventImage}
            alt={eventData.eventTitle || 'Event image'}
            className="absolute inset-0 w-full h-2/5 sm:h-2/4 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Card Content */}
        <div className="absolute bottom-0 left-0 right-0 h-3/5 sm:h-2/4 bg-card p-4 sm:p-5 flex flex-col justify-between">
            <div className="space-y-2">
                {/* Tag */}
                <div className="flex items-center text-xs text-muted-foreground">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
                    <span>{eventData.location}</span>
                </div>
                {/* Title & Description */}
                <h3 className="text-lg sm:text-xl font-bold text-card-foreground leading-tight line-clamp-3">{eventData.eventTitle}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 sm:line-clamp-2">{eventData.description}</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-bold">Event Date: {eventData.eventDate.slice(0, 10)}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border mt-auto">
                <p className="text-sm">Price: <span className="text-green-600">{eventData.price} Taka</span></p>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground transform transition-transform duration-300 group-hover:rotate-[-45deg] group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    </motion.a>
));
OfferCard.displayName = "OfferCard";

const EventCarousel = React.forwardRef(
    ({ eventDatas, className, ...props }, ref) => {
        const scrollContainerRef = React.useRef(null);
        const [showButtons, setShowButtons] = React.useState(false);

        React.useEffect(() => {
            // Only show scroll buttons on larger screens
            const checkWidth = () => {
                setShowButtons(window.innerWidth >= 768); // md breakpoint
            };

            checkWidth();
            window.addEventListener('resize', checkWidth);
            return () => window.removeEventListener('resize', checkWidth);
        }, []);

        const scroll = (direction) => {
            if (scrollContainerRef.current) {
                const { current } = scrollContainerRef;
                const scrollAmount = current.clientWidth * 0.8;
                current.scrollBy({
                    left: direction === "left" ? -scrollAmount : scrollAmount,
                    behavior: "smooth",
                });
            }
        };

        // Handle empty or undefined data
        if (!eventDatas || eventDatas.length === 0) {
            return (
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                    <p className="text-sm sm:text-base">No events available in this category.</p>
                </div>
            );
        }

        return (
            <div ref={ref} className={cn("relative w-full group", className)} {...props}>
                {/* Left Scroll Button - Hidden on mobile */}
                {showButtons && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute top-1/2 -translate-y-1/2 left-2 md:left-0 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-background shadow-lg"
                        aria-label="Scroll Left"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-4 sm:px-6 md:px-0 -mx-4 sm:-mx-6 md:mx-0"
                >
                    {eventDatas.map((eventData) => (
                        <OfferCard key={eventData.id} eventData={eventData} />
                    ))}
                </div>

                {/* Right Scroll Button - Hidden on mobile */}
                {showButtons && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute top-1/2 -translate-y-1/2 right-2 md:right-0 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-background shadow-lg"
                        aria-label="Scroll Right"
                    >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                )}
            </div>
        );
    }
);
EventCarousel.displayName = "EventCarousel";

export { EventCarousel, OfferCard };