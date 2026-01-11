'use client';

import { Input } from '@/shadcn-components/ui/input';
import { SearchIcon, Clock, X } from 'lucide-react';
import React, { useId, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Searchbar = () => {
    const id = useId();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);
    const debounceTimer = useRef(null);

    // Load recent searches from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('recentEventSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search function
    const searchEvents = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        try {
            const response = await fetch(`/api/search/events?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        }
    };

    // Handle input change with debouncing
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(true);
        setSelectedIndex(-1);

        // Clear existing timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set new timer for debounced search
        debounceTimer.current = setTimeout(() => {
            searchEvents(value);
        }, 300); // 300ms debounce
    };

    // Save to recent searches
    const saveToRecent = (eventTitle) => {
        const updated = [eventTitle, ...recentSearches.filter(s => s !== eventTitle)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentEventSearches', JSON.stringify(updated));
    };

    // Handle event selection
    const handleSelectEvent = (event) => {
        saveToRecent(event.eventTitle);
        setQuery('');
        setIsOpen(false);
        router.push(`/events/${event.id}`);
    };

    // Handle recent search click
    const handleRecentClick = (searchTerm) => {
        setQuery(searchTerm);
        searchEvents(searchTerm);
    };

    // Clear recent searches
    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentEventSearches');
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen) return;

        const totalItems = results.length;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    handleSelectEvent(results[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const showDropdown = isOpen && (query.trim() !== '' || recentSearches.length > 0);

    return (
        <div ref={searchRef} className="relative mx-auto w-full max-w-xs">
            <div className="relative">
                <Input
                    id={id}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="peer h-8 ps-8 pe-10"
                    placeholder="Search events..."
                    type="search"
                    autoComplete="off"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                    <SearchIcon size={16} />
                </div>
            </div>

            {/* Glassmorphism Dropdown */}
            {showDropdown && (
                <div className="absolute mt-2 w-full z-50 rounded-lg border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {/* Search Results */}
                    {query.trim() !== '' && results.length > 0 && (
                        <div className="max-h-80 overflow-y-auto">
                            {results.map((event, index) => (
                                <button
                                    key={event.id}
                                    onClick={() => handleSelectEvent(event)}
                                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${selectedIndex === index
                                            ? 'bg-blue-500/20 dark:bg-blue-400/20'
                                            : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                                        }`}
                                >
                                    {event.eventImage && (
                                        <img
                                            src={event.eventImage}
                                            alt={event.eventTitle}
                                            className="w-12 h-12 rounded object-cover flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                            {event.eventTitle}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                            {formatDate(event.eventDate)} • {event.location}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {query.trim() !== '' && results.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            No events found for "{query}"
                        </div>
                    )}

                    {/* Recent Searches */}
                    {query.trim() === '' && recentSearches.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Recent Searches
                                </span>
                                <button
                                    onClick={clearRecent}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {recentSearches.map((search, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleRecentClick(search)}
                                        className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <Clock size={14} className="text-gray-400 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                            {search}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Searchbar;