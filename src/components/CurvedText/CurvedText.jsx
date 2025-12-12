'use client'

import CurvedLoop from "@/shadcn-components/CurvedLoop";
import { useEffect, useState } from "react";

const CurvedText = () => {

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

    return (
        <div>
            <CurvedLoop
                marqueeText="Never miss out on campus events! ⭐ Join the buzz now! ⭐"
                speed={3}
                curveAmount={300}
                direction="right"
                interactive={false}
                className={`custom-text-style ${isDark ? 'fill-white' : 'fill-black'}`}
            />
        </div>
    );
};

export default CurvedText;