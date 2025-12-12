'use client'
import React, { useEffect, useState } from 'react';
import CircularTestimonials from './circular-testimonials';

const IndividualTestimonial = () => {

    const [isDark, setIsDark] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {

        const checkTheme = () => {
            const darkMode = document.documentElement.classList.contains("dark");
            setIsDark(darkMode);
            setIsMounted(true);
        };

        checkTheme();

        const timer = setTimeout(checkTheme, 100);

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    const testimonials = [
        {
            quote:
                "I was impressed by the food! And I could really tell that they use high-quality ingredients. The staff was friendly and attentive. I'll definitely be back for more!",
            name: "Tamar Mendelson",
            designation: "Restaurant Critic",
            src:
                "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            quote:
                "This place exceeded all expectations! The atmosphere is inviting, and the staff truly goes above and beyond. I'll keep returning for more exceptional dining experience.",
            name: "Joe Charlescraft",
            designation: "Frequent Visitor",
            src:
                "https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
        },
        {
            quote:
                "Shining Yam is a hidden gem! The impeccable service and overall attention to detail created a memorable experience. I highly recommend it!",
            name: "Martina Edelweist",
            designation: "Satisfied Customer",
            src:
                "https://images.unsplash.com/photo-1524267213992-b76e8577d046?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
        },
    ];

    return (
        <div className={`${isDark ? 'bg-[#060507]' : 'bg-[#f7f7fa]'} p-20 rounded-lg min-h-[300px] flex flex-wrap gap-6 items-center justify-center relative`}>
            <div
                className="items-center justify-center relative flex"
                style={{ maxWidth: "1456px" }}
            >
                <CircularTestimonials
                    testimonials={testimonials}
                    autoplay={true}
                    colors={{
                        name: isDark ? '#f7f7ff' :"#0a0a0a",
                        designation: isDark ? '#e1e1e1' : "#454545",
                        testimony: isDark ? '#f1f1f7' : "#171717",
                        arrowBackground: isDark ? '#0582CA' : "#141414",
                        arrowForeground: isDark ? '#141414' : "#f1f1f7",
                        arrowHoverBackground: isDark ? '#f7f7ff' : "#00A6FB",
                    }}
                    fontSizes={{
                        name: "28px",
                        designation: "20px",
                        quote: "20px",
                    }}
                />
            </div>
        </div>
    );
};

export default IndividualTestimonial;