"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import UserProgress from "./UserProgress";

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
  { title: "Glossary", url: "/glossary", category: "Resources" },
  { title: "FAQ", url: "/faq", category: "Resources" },
  { title: "Ask Question (Lightning Q&A)", url: "/qa", category: "Q&A" },
  { title: "About soundsfair", url: "/about", category: "Company" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof searchableContent>([]);
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const learnDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchableContent.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

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

      if (!target.closest(".search-container")) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSelect = (url: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    if (url !== "#") {
      router.push(url);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="group">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white transition-colors group-hover:text-gray-300">
                  sounds
                </span>
                <span className="text-2xl font-bold text-brand-yellow transition-all group-hover:scale-110">
                  fair
                </span>
              </div>
              <span className="hidden text-xs text-gray-500 md:block">
                Learn Bitcoin
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 lg:flex">
            {/* Home */}
            <Link
              href="/"
              className={`relative text-base font-medium transition-all duration-200 ${
                pathname === "/"
                  ? "text-brand-yellow"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
              {pathname === "/" && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-yellow"></span>
              )}
            </Link>

            {/* Learn Dropdown */}
            <div ref={learnDropdownRef} className="relative">
              <button
                onClick={() => {
                  setLearnDropdownOpen(!learnDropdownOpen);
                  setToolsDropdownOpen(false);
                }}
                onMouseEnter={() => setLearnDropdownOpen(true)}
                className={`flex items-center space-x-1 text-base font-medium transition-all duration-200 ${
                  isActive("/learn") || isActive("/lessons")
                    ? "text-brand-yellow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span>Learn</span>
                <svg
                  className={`h-4 w-4 transition-transform ${
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
                  onMouseLeave={() => setLearnDropdownOpen(false)}
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
            <div ref={toolsDropdownRef} className="relative">
              <button
                onClick={() => {
                  setToolsDropdownOpen(!toolsDropdownOpen);
                  setLearnDropdownOpen(false);
                }}
                onMouseEnter={() => setToolsDropdownOpen(true)}
                className={`flex items-center space-x-1 text-base font-medium transition-all duration-200 ${
                  isActive("/tools") || isActive("/faq") || isActive("/glossary")
                    ? "text-brand-yellow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span>Tools</span>
                <svg
                  className={`h-4 w-4 transition-transform ${
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
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                  className="absolute left-0 top-full mt-2 w-64 rounded-lg border border-gray-800 bg-black shadow-2xl"
                >
                  <div className="p-3">
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
                      href="/glossary"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                    >
                      <div className="text-2xl">📖</div>
                      <div>
                        <div className="font-semibold text-white">Bitcoin Glossary</div>
                        <div className="text-xs text-gray-400">
                          50+ essential Bitcoin terms
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/faq"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-900"
                    >
                      <div className="text-2xl">❓</div>
                      <div>
                        <div className="font-semibold text-white">FAQ</div>
                        <div className="text-xs text-gray-400">
                          Frequently asked questions
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Q&A Link (Featured) */}
            <Link
              href="/qa"
              className={`relative flex items-center space-x-1 text-base font-medium transition-all duration-200 ${
                isActive("/qa")
                  ? "text-brand-yellow"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <span>Q&A</span>
              <span className="rounded-full bg-brand-yellow px-1.5 py-0.5 text-xs font-bold text-black">
                ⚡
              </span>
              {isActive("/qa") && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-yellow"></span>
              )}
            </Link>

            {/* About */}
            <Link
              href="/about"
              className={`relative text-base font-medium transition-all duration-200 ${
                isActive("/about")
                  ? "text-brand-yellow"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              About
              {isActive("/about") && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-yellow"></span>
              )}
            </Link>
          </nav>

          {/* Search, Progress & CTA */}
          <div className="hidden items-center space-x-4 lg:flex">
            {/* User Progress Tracker */}
            <UserProgress />

            {/* Search Bar */}
            <div className="search-container relative">
              {!searchOpen ? (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center space-x-2 rounded-lg border border-gray-800 px-4 py-2 text-gray-400 transition-all hover:border-brand-yellow hover:text-brand-yellow"
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
                  <span className="text-sm">Search</span>
                  <kbd className="hidden rounded bg-gray-900 px-2 py-0.5 text-xs text-gray-500 xl:inline-block">
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
                          No results found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href="/lessons"
              className="rounded-lg border-2 border-brand-yellow px-5 py-2 text-sm font-semibold text-brand-yellow transition-all hover:bg-brand-yellow hover:text-black"
            >
              Start Learning
            </Link>
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
                href="/tools/dca"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors ${
                  isActive("/tools")
                    ? "text-brand-yellow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                DCA Calculator
              </Link>

              <Link
                href="/glossary"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors ${
                  isActive("/glossary")
                    ? "text-brand-yellow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Glossary
              </Link>

              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors ${
                  isActive("/faq")
                    ? "text-brand-yellow"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                FAQ
              </Link>

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

              <Link
                href="/lessons"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-block rounded-lg bg-brand-yellow px-5 py-3 text-center text-sm font-semibold text-black transition-all hover:bg-primary-dark"
              >
                Start Learning
              </Link>
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
