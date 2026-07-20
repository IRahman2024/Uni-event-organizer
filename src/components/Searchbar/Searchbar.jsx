"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, SearchIcon } from "lucide-react";
import { Input } from "@/shadcn-components/ui/input";

export default function Searchbar() {
  const id = useId();
  const router = useRouter();
  const rootRef = useRef(null);
  const timerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    try { setRecent(JSON.parse(localStorage.getItem("recentEventSearches") || "[]")); } catch { setRecent([]); }
    const close = (event) => { if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const search = async (value) => {
    if (!value.trim()) { setResults([]); return; }
    try { const response = await fetch(`/api/search/events?q=${encodeURIComponent(value)}`); const data = await response.json(); setResults(data.results || []); }
    catch { setResults([]); }
  };

  const onChange = (event) => {
    const value = event.target.value;
    setQuery(value); setOpen(true); setSelected(-1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(value), 250);
  };

  const choose = (event) => {
    const next = [event.eventTitle, ...recent.filter((item) => item !== event.eventTitle)].slice(0, 5);
    setRecent(next); localStorage.setItem("recentEventSearches", JSON.stringify(next));
    setOpen(false); setQuery(""); router.push(`/events/${event.id}`);
  };

  const onKeyDown = (event) => {
    if (!open) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setSelected((index) => Math.min(index + 1, results.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setSelected((index) => Math.max(index - 1, -1)); }
    if (event.key === "Enter" && selected >= 0) { event.preventDefault(); choose(results[selected]); }
    if (event.key === "Escape") setOpen(false);
  };

  const show = open && (query.trim() || recent.length);
  return (
    <div ref={rootRef} className="relative mx-auto w-full">
      <div className="relative"><SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" /><Input id={id} value={query} onChange={onChange} onFocus={() => setOpen(true)} onKeyDown={onKeyDown} placeholder="Search events" type="search" autoComplete="off" className="h-10 bg-background/70 pl-9" aria-label="Search events" aria-expanded={Boolean(show)} /></div>
      {show && <div className="glass-panel absolute mt-2 w-full overflow-hidden rounded-xl p-1">
        {query.trim() && results.map((event, index) => <button key={event.id} onClick={() => choose(event)} className={`focus-ring flex w-full gap-3 rounded-lg p-2.5 text-left transition-colors ${selected === index ? "bg-accent" : "hover:bg-accent/60"}`}>{event.eventImage && <img src={event.eventImage} alt="" className="size-10 rounded-lg object-cover" />}<span className="min-w-0"><span className="block truncate text-sm font-semibold">{event.eventTitle}</span><span className="block truncate text-xs text-muted-foreground">{event.location || "Campus event"}</span></span></button>)}
        {query.trim() && results.length === 0 && <div className="p-5 text-center text-sm text-muted-foreground">No matching events</div>}
        {!query.trim() && recent.length > 0 && <div><div className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground"><span>Recent searches</span><button onClick={() => { setRecent([]); localStorage.removeItem("recentEventSearches"); }} className="hover:text-primary">Clear</button></div>{recent.map((item) => <button key={item} onClick={() => { setQuery(item); search(item); }} className="focus-ring flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-accent/60"><Clock className="size-3.5 text-muted-foreground" />{item}</button>)}</div>}
      </div>}
    </div>
  );
}
