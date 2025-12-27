"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import UserProfileMenu from "@/components/layout/UserProfileMenu";
import { useAuth } from "@/lib/hooks/useAuth";

// Lessons data
const lessons = [
  { level: 1, title: "The Fiat Money System", slug: "level-1-fiat-system", category: "Beginner" },
  { level: 2, title: "Banking System and Debt", slug: "level-2-banking-debt", category: "Beginner" },
  { level: 3, title: "Bitcoin Revolution", slug: "level-3-bitcoin-revolution", category: "Beginner" },
  { level: 4, title: "Bitcoin and Geopolitics", slug: "level-4-bitcoin-geopolitics-intro", category: "Intermediate" },
  { level: 5, title: "Store of Value", slug: "level-5-store-of-value", category: "Intermediate" },
  { level: 6, title: "Economic Freedom", slug: "level-6-economic-freedom", category: "Intermediate" },
  { level: 7, title: "Geopolitical Future", slug: "level-7-geopolitical-future", category: "Advanced" },
  { level: 8, title: "Protection Strategies", slug: "level-8-protection-strategies", category: "Advanced" },
  { level: 9, title: "Financial Freedom", slug: "level-9-financial-freedom", category: "Advanced" },
];

// Search data
const searchableContent = [
  ...lessons.map(l => ({ title: l.title, url: `/lessons/${l.slug}`, category: "Learn" })),
  { title: "DCA Calculator", url: "/tools/dca", category: "Tools" },
  { title: "What If Calculator", url: "/tools/what-if-calculator", category: "Tools" },
  { title: "Satoshi Converter", url: "/tools/satoshi-converter", category: "Tools" },
  { title: "Fear & Greed Index", url: "/tools/fear-greed-index", category: "Tools" },
  { title: "Halving Countdown", url: "/tools/halving-countdown", category: "Tools" },
  { title: "All Tools", url: "/tools", category: "Tools" },
  { title: "Books", url: "/resources/books", category: "Resources" },
  { title: "Podcasts", url: "/resources/podcasts", category: "Resources" },
  { title: "Videos", url: "/resources/videos", category: "Resources" },
  { title: "Reflections & Blog", url: "/reflections", category: "Resources" },
  { title: "Newsletter", url: "/substack", category: "Resources" },
  { title: "Glossary", url: "/glossary", category: "Resources" },
  { title: "FAQ", url: "/faq", category: "Resources" },
  { title: "Ask Question (Lightning Q&A)", url: "/qa", category: "Q&A" },
  { title: "About soundsfair", url: "/about", category: "Company" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = useMemo(() => {
    if (searchQuery.length === 0) {
      return [];
    }

    const results = searchableContent.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return results.slice(0, 8);
  }, [searchQuery]);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const learnDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (learnDropdownRef.current && !learnDropdownRef.current.contains(target)) {
        setLearnDropdownOpen(false);
      }

      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(target)) {
        setToolsDropdownOpen(false);
      }

      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(target)) {
        setResourcesDropdownOpen(false);
      }

      if (!target.closest(".search-container")) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect scroll for header shrink effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSelect = (url: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    if (url !== "#") {
      router.push(url);
    }
  };

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
      isScrolled
        ? 'border-brand-gold/20 bg-surface-black/95 backdrop-blur-xl shadow-glow'
        : 'border-border-default/50 bg-surface-black/80 backdrop-blur-md'
    } supports-[backdrop-filter]:bg-black/60`}>
      <div className="container mx-auto px-4 lg:px-6">
        {/* Main Header */}
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-6'
        }`}>
          {/* Logo */}
          <Link href="/" className="group">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className={`font-bold text-white transition-all duration-300 group-hover:text-gray-300 ${
                  isScrolled ? 'text-xl' : 'text-2xl'
                }`}>
                  sounds
                </span>
                <span className={`font-bold text-brand-yellow transition-all duration-300 group-hover:scale-110 ${
                  isScrolled ? 'text-xl' : 'text-2xl'
                }`}>
                  fair
                </span>
              </div>
              <span className={`hidden text-gray-500 md:block transition-all duration-300 ${
                isScrolled ? 'text-[10px]' : 'text-xs'
              }`}>
                Learn Bitcoin
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 lg:flex">
            {/* Home */}
            <Link
              href="/"
              className={`relative text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                pathname === "/"
                  ? "text-brand-yellow bg-brand-yellow/10"
                  : "text-gray-300 hover:text-white hover:bg-gray-900/50"
              }`}
            >
              Home
            </Link>

            {/* Learn Dropdown */}
            <div
              ref={learnDropdownRef}
              className="relative"
              onMouseEnter={() => {
                setLearnDropdownOpen(true);
                setToolsDropdownOpen(false);
                setResourcesDropdownOpen(false);
              }}
              onMouseLeave={() => setLearnDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setLearnDropdownOpen(!learnDropdownOpen);
                  setToolsDropdownOpen(false);
                  setResourcesDropdownOpen(false);
                }}
                className={`flex items-center gap-1 text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                  isActive("/learn") || isActive("/lessons")
                    ? "text-brand-yellow bg-brand-yellow/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-900/50"
                }`}
              >
                <span>Learn</span>
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    learnDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Learn Dropdown Menu */}
              {learnDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-96 rounded-lg border border-gray-800 bg-black shadow-2xl"
                >
                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-yellow">
                        Learning Path
                      </h3>
                      <Link
                        href="/lessons"
                        onClick={() => setLearnDropdownOpen(false)}
                        className="text-xs text-gray-400 hover:text-brand-yellow"
                      >
                        View All →
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {["Beginner", "Intermediate", "Advanced"].map((category) => (
                        <div key={category} className="space-y-1">
                          <div className="text-xs font-semibold text-gray-500 px-2 py-1">
                            {category}
                          </div>
                          {lessons
                            .filter((l) => l.category === category)
                            .map((lesson) => (
                              <Link
                                key={lesson.slug}
                                href={`/lessons/${lesson.slug}`}
                                onClick={() => setLearnDropdownOpen(false)}
                                className="block rounded px-2 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-900 hover:text-brand-yellow"
                              >
                                <span className="font-semibold text-brand-yellow">
                                  Level {lesson.level}:
                                </span>{" "}
                                {lesson.title}
                              </Link>
                            ))}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-800 pt-3">
                      <Link
                        href="/learn"
                        onClick={() => setLearnDropdownOpen(false)}
                        className="block rounded-lg bg-brand-yellow/10 px-3 py-2 text-center text-sm font-semibold text-brand-yellow transition-colors hover:bg-brand-yellow/20"
                      >
                        Start Learning Journey
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div
              ref={toolsDropdownRef}
              className="relative"
              onMouseEnter={() => {
                setToolsDropdownOpen(true);
                setLearnDropdownOpen(false);
                setResourcesDropdownOpen(false);
              }}
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setToolsDropdownOpen(!toolsDropdownOpen);
                  setLearnDropdownOpen(false);
                  setResourcesDropdownOpen(false);
                }}
                className={`flex items-center gap-1 text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                  isActive("/tools")
                    ? "text-brand-yellow bg-brand-yellow/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-900/50"
                }`}
              >
                <span>Tools</span>
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    toolsDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Tools Dropdown Menu */}
              {toolsDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-80 rounded-lg border border-gray-800 bg-black shadow-2xl"
                >
                  <div className="p-3">
                    {/* Calculators Section */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Calculators
                      </div>
                      <Link
                        href="/tools/dca"
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">📊</div>
                        <div>
                          <div className="font-semibold text-white">DCA Calculator</div>
                          <div className="text-xs text-gray-400">
                            Compare Bitcoin vs traditional assets
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/tools/what-if-calculator"
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">💰</div>
                        <div>
                          <div className="font-semibold text-white">What If Calculator</div>
                          <div className="text-xs text-gray-400">
                            Historical Bitcoin returns
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Converters Section */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Converters
                      </div>
                      <Link
                        href="/tools/satoshi-converter"
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">₿</div>
                        <div>
                          <div className="font-semibold text-white">Satoshi Converter</div>
                          <div className="text-xs text-gray-400">
                            BTC, sats, and fiat currencies
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Market Intelligence Section */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Market Intelligence
                      </div>
                      <Link
                        href="/tools/fear-greed-index"
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">😨</div>
                        <div>
                          <div className="font-semibold text-white">Fear & Greed Index</div>
                          <div className="text-xs text-gray-400">
                            Real-time market sentiment
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/tools/halving-countdown"
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">⏰</div>
                        <div>
                          <div className="font-semibold text-white">Halving Countdown</div>
                          <div className="text-xs text-gray-400">
                            Next Bitcoin halving tracker
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* View All Link */}
                    <div className="border-t border-gray-800 mt-2 pt-2">
                      <Link
                        href="/tools"
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-brand-yellow/10 px-3 py-2 text-sm font-semibold text-brand-yellow transition-colors hover:bg-brand-yellow/20"
                      >
                        <span>View All Tools</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              ref={resourcesDropdownRef}
              className="relative"
              onMouseEnter={() => {
                setResourcesDropdownOpen(true);
                setLearnDropdownOpen(false);
                setToolsDropdownOpen(false);
              }}
              onMouseLeave={() => setResourcesDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setResourcesDropdownOpen(!resourcesDropdownOpen);
                  setLearnDropdownOpen(false);
                  setToolsDropdownOpen(false);
                }}
                className={`flex items-center gap-1 text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                  isActive("/resources") || isActive("/reflections") || isActive("/substack") || isActive("/glossary") || isActive("/faq")
                    ? "text-brand-yellow bg-brand-yellow/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-900/50"
                }`}
              >
                <span>Resources</span>
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    resourcesDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Resources Dropdown Menu */}
              {resourcesDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-80 rounded-lg border border-gray-800 bg-black shadow-2xl"
                >
                  <div className="p-3">
                    {/* Learning Resources */}
                    <div className="mb-2">
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Learning Resources
                      </div>
                      <Link
                        href="/resources/books"
                        onClick={() => setResourcesDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">📚</div>
                        <div>
                          <div className="font-semibold text-white">Bitcoin Books</div>
                          <div className="text-xs text-gray-400">
                            Curated reading list with reviews
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/resources/podcasts"
                        onClick={() => setResourcesDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">🎙️</div>
                        <div>
                          <div className="font-semibold text-white">Podcasts</div>
                          <div className="text-xs text-gray-400">
                            Best Bitcoin shows to follow
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/resources/videos"
                        onClick={() => setResourcesDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">🎬</div>
                        <div>
                          <div className="font-semibold text-white">Video Library</div>
                          <div className="text-xs text-gray-400">
                            Curated YouTube videos
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Content & Community */}
                    <div className="border-t border-gray-800 mb-2 pt-2">
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Content & Community
                      </div>
                      <Link
                        href="/reflections"
                        onClick={() => setResourcesDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">✍️</div>
                        <div>
                          <div className="font-semibold text-white">Reflections</div>
                          <div className="text-xs text-gray-400">
                            Our thoughts on Bitcoin & freedom
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/substack"
                        onClick={() => setResourcesDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">📬</div>
                        <div>
                          <div className="font-semibold text-white">Newsletter</div>
                          <div className="text-xs text-gray-400">
                            Weekly Bitcoin insights
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Reference */}
                    <div className="border-t border-gray-800 mb-2 pt-2">
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Reference
                      </div>
                      <Link
                        href="/glossary"
                        onClick={() => setResourcesDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">📖</div>
                        <div>
                          <div className="font-semibold text-white">Glossary</div>
                          <div className="text-xs text-gray-400">
                            50+ Bitcoin terms explained
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/faq"
                        onClick={() => setResourcesDropdownOpen(false)}
                        className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                      >
                        <div className="text-2xl">❓</div>
                        <div>
                          <div className="font-semibold text-white">FAQ</div>
                          <div className="text-xs text-gray-400">
                            Common questions answered
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Q&A Link (Featured) */}
            <Link
              href="/qa"
              className={`relative flex items-center gap-1.5 text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                isActive("/qa")
                  ? "text-brand-yellow bg-brand-yellow/10"
                  : "text-gray-300 hover:text-white hover:bg-gray-900/50"
              }`}
            >
              <span>Q&A</span>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs">
                ⚡
              </span>
            </Link>

            {/* About */}
            <Link
              href="/about"
              className={`relative text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                isActive("/about")
                  ? "text-brand-yellow bg-brand-yellow/10"
                  : "text-gray-300 hover:text-white hover:bg-gray-900/50"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Search, Profile & CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Search Bar */}
            <div className="search-container relative">
              {!searchOpen ? (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-gray-900/50 border border-gray-800/50 px-3 py-2
                             text-gray-400 transition-all hover:border-brand-yellow/50 hover:text-gray-300
                             hover:bg-gray-900"
                  aria-label="Open search"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-sm hidden xl:inline">Search</span>
                  <kbd className="hidden xl:inline-flex items-center gap-1 rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-500 border border-gray-700">
                    ⌘K
                  </kbd>
                </button>
              ) : (
                <div className="relative">
                  <div className="flex items-center">
                    <svg
                      className="absolute left-3 h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search lessons, tools..."
                      className="w-72 rounded-lg border border-brand-yellow bg-gray-900 py-2 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                    />
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="absolute right-3 text-gray-400 hover:text-white"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Search Results Dropdown */}
                  {searchQuery.length > 0 && (
                    <div className="absolute top-full mt-2 w-full rounded-lg border border-gray-800 bg-black shadow-xl">
                      {searchResults.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto">
                          {searchResults.map((result, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearchSelect(result.url)}
                              className="flex w-full items-center justify-between border-b border-gray-800 px-4 py-3 text-left transition-colors hover:bg-gray-900 last:border-b-0"
                            >
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {result.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {result.category}
                                </div>
                              </div>
                              <svg
                                className="h-4 w-4 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                          No results found for &quot;{searchQuery}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Menu (when authenticated) or Login Button */}
            {!authLoading && (
              <>
                {isAuthenticated ? (
                  <UserProfileMenu />
                ) : (
                  <Link
                    href="/login"
                    className="group relative overflow-hidden rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-display font-semibold uppercase tracking-wider
                               text-surface-black transition-all hover:bg-brand-gold-hover hover:shadow-glow hover:shadow-glow-lg
                               active:scale-95"
                  >
                    <span className="relative z-10">Login</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-gold-hover to-brand-gold opacity-0
                                    group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center justify-center space-y-1.5 lg:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-brand-yellow transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-brand-yellow transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-brand-yellow transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-800 py-4 lg:hidden">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow"
                />
              </div>

              {/* Mobile Search Results */}
              {searchQuery.length > 0 && searchResults.length > 0 && (
                <div className="mt-2 space-y-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleSearchSelect(result.url);
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border border-gray-800 px-3 py-2 text-left transition-colors hover:bg-gray-900"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">
                          {result.title}
                        </div>
                        <div className="text-xs text-gray-500">{result.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors ${
                  pathname === "/"
                    ? "text-brand-yellow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Home
              </Link>

              <Link
                href="/lessons"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors ${
                  isActive("/lessons") || isActive("/learn")
                    ? "text-brand-yellow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Learn (All Lessons)
              </Link>

              <Link
                href="/tools"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors ${
                  isActive("/tools")
                    ? "text-brand-yellow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Tools & Calculators
              </Link>

              <div className="pt-2 border-t border-gray-800">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                  Resources
                </div>
                <Link
                  href="/resources/books"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors block mb-3 ${
                    isActive("/resources/books")
                      ? "text-brand-yellow"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  📚 Books
                </Link>
                <Link
                  href="/resources/podcasts"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors block mb-3 ${
                    isActive("/resources/podcasts")
                      ? "text-brand-yellow"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  🎙️ Podcasts
                </Link>
                <Link
                  href="/resources/videos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors block mb-3 ${
                    isActive("/resources/videos")
                      ? "text-brand-yellow"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  🎬 Videos
                </Link>
                <Link
                  href="/reflections"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors block mb-3 ${
                    isActive("/reflections")
                      ? "text-brand-yellow"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  ✍️ Reflections
                </Link>
                <Link
                  href="/substack"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors block mb-3 ${
                    isActive("/substack")
                      ? "text-brand-yellow"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  📬 Newsletter
                </Link>
                <Link
                  href="/glossary"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors block mb-3 ${
                    isActive("/glossary")
                      ? "text-brand-yellow"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  📖 Glossary
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors block mb-3 ${
                    isActive("/faq")
                      ? "text-brand-yellow"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  ❓ FAQ
                </Link>
              </div>

              <Link
                href="/qa"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 text-base font-medium transition-colors ${
                  isActive("/qa")
                    ? "text-brand-yellow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span>Q&A (Lightning)</span>
                <span className="rounded-full bg-brand-yellow px-1.5 py-0.5 text-xs font-bold text-black">
                  ⚡
                </span>
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors ${
                  isActive("/about")
                    ? "text-brand-yellow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                About
              </Link>

              {!authLoading && (
                <Link
                  href={isAuthenticated ? "/lessons" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-block rounded-lg bg-brand-yellow px-5 py-3 text-center text-sm font-semibold text-black transition-all hover:bg-primary-dark"
                >
                  {isAuthenticated ? "Start Learning" : "LOGIN"}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {(pathname.startsWith("/learn") || pathname.startsWith("/lessons")) && (
        <div className="h-1 w-full bg-gray-900">
          <div className="h-full w-0 bg-brand-yellow transition-all duration-300"></div>
        </div>
      )}
    </header>
  );
}
