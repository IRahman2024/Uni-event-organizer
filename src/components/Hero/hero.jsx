'use client';
import LaserFlow from "@/shadcn-components/LaserFlow";
import { useRef, useEffect, useState } from 'react';

const Hero = () => {
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

    // Laser configurations for both themes
    const laserConfig = {
        dark: {
            color: "#A85FF2",                    // Your original purple
            fogIntensity: 0.68,
            wispIntensity: 5.0,
            wispDensity: 1.0,
            flowSpeed: 0.35,
            verticalSizing: 2.9,
            horizontalSizing: 1.31,
            flowStrength: 0.25,
            decay: 2.2,
            falloffStart: 1.5,
            fogFallSpeed: 0.9,
            fogScale: 0.3,
            wispSpeed: 15.0,
            mouseTiltStrength: 0.01,
        },
        light: {
            color: "#CB4D4D",
            fogIntensity: 0.68,
            wispIntensity: 5.5,                  // INCREASED for better visibility
            wispDensity: 0.9,                    // More wisps
            flowSpeed: 0.35,
            verticalSizing: 1.2,
            horizontalSizing: 1.31,
            flowStrength: 0.5,
            fogFallSpeed: 0.9,
            fogScale: 0.5,                       // INCREASED for more fog coverage
            wispSpeed: 12.0,
            mouseTiltStrength: 0.4,
            decay: 2.0,
            falloffStart: 1.15,
        }
    };

    const backgroundColors = {
        dark: '#060010',     // Keep your original dark background
        // light: '#c6c2dcba'     // NEW: Light background for bright mode
        // Other light options:
        light: '#609097ff'  // Warm cream
    };

    const currentBackground = isDark ? backgroundColors.dark : backgroundColors.light;

    const currentConfig = isDark ? laserConfig.dark : laserConfig.light;

    // Background gradient for better fog reflections
    // const backgroundGradient = isDark
    //     ? 'radial-gradient(ellipse at center, #0a0015 0%, #060010 50%, #030005 100%)'
    //     : 'radial-gradient(ellipse at center, #f8f9ff 0%, #e6edff 50%, #d4e0ff 100%)';

    if (!isMounted) {
        return (
            <div className="relative overflow-hidden h-[800px]" style={{ backgroundColor: currentBackground }}>
                <div className="absolute inset-0 opacity-60">
                    <LaserFlow {...laserConfig.light} />
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative overflow-hidden h-[800px] transition-all duration-500"
            style={{ background: currentBackground }}
        >
            {/* Laser animation background */}
            <div className={`absolute inset-0 ${isDark ? 'opacity-80' : 'opacity-90'} transition-opacity duration-100`}>
                <LaserFlow {...currentConfig} />
            </div>

            {/* Subtle overlay for text readability */}
            <div
                className={`absolute inset-0 ${isDark ? 'opacity-0' : 'opacity-10'}`}
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
                }}
            />

            {/* Two-part layout container */}
            <div className="relative z-10 h-full flex items-center justify-center">
                <div className="w-full max-w-7xl mx-auto px-8">

                    {/* Main content - two columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                        {/* Left Side - Welcome/Emotional */}
                        <div className="text-left">
                            <div className="">
                                <p className={`text-lg font-medium ${isDark ? 'text-purple-300' : 'text-[#23c633]'} mb-2`}>
                                    Welcome to Campus Life! 🎉
                                </p>
                                <h1 className={`text-4xl md:text-5xl font-bold leading-tight ${isDark ? 'text-white' : 'text-white'}`}>
                                    Your Campus Events Hub
                                </h1>
                                <div className={`w-24 h-1 ${isDark ? 'bg-purple-500' : 'bg-blue-500'} rounded-full`}></div>
                                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-white'}`}>
                                    Discover events that spark your interests, connect with students who share your passion,
                                    and create memories that last a lifetime.
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Action/Value */}
                        <div className="text-left">
                            <div className="">
                                <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-white'}`}>
                                    Ready to dive in?
                                </h2>
                                <p className={`text-base ${isDark ? 'text-gray-300' : 'text-white'}`}>
                                    From study groups to parties, workshops to concerts -
                                    find what's happening on campus and never miss out again.
                                </p>

                                {/* Action buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${isDark
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25'
                                        }`}>
                                        Explore Events
                                    </button>
                                    <button className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 ${isDark
                                        ? 'border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white'
                                        : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                                        }`}>
                                        Create Event
                                    </button>
                                </div>

                                {/* Trust indicators */}
                                <div className={`pt-6 text-sm ${isDark ? 'text-gray-400' : 'text-white'}`}>
                                    <div className="flex flex-wrap gap-4">
                                        <span>✓ 2,500+ students</span>
                                        <span>• 350+ events</span>
                                        <span>• 12 campuses</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;