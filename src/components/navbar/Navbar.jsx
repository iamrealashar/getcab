"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

// Navigation data
const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "de", label: "German (Deutsch)" },
  { code: "fr", label: "French (Français)" },
  { code: "es", label: "Spanish (Español)" },
];

const services = [
  { label: "Airport Transfers", href: "/services/airport-transfers" },
  { label: "Chauffeur Service", href: "/services/chauffeur" },
  { label: "Executive Travel", href: "/services/executive-travel" },
];

const businessLinks = [
  { label: "Corporate Accounts", href: "/business/corporate-accounts" },
  { label: "Business Travel", href: "/business/travel-management" },
  { label: "Become a Partner", href: "/business/partners" },
];

const regularLinks = [
  { label: "Chauffeurs", href: "/chauffeurs" },
  { label: "Help", href: "/help" },
];

const localeCodes = languages.map((language) => language.code);

// Locale helpers
function getLocale(pathname = "/") {
  const firstSegment = pathname.split("/")[1];
  return localeCodes.includes(firstSegment) ? firstSegment : "en";
}

function getBasePath(pathname = "/") {
  const segments = pathname.split("/");
  if (localeCodes.includes(segments[1])) segments.splice(1, 1);

  return segments.join("/") || "/";
}

function getLocalizedPath(pathname, locale) {
  const basePath = getBasePath(pathname);

  if (locale === "en") return basePath;

  return `/${locale}${basePath === "/" ? "" : basePath}`;
}

// Icons
function ArrowIcon({ diagonal = false, className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      {diagonal ? (
        <path
          d="M5 15 15 5M6 5h9v9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M3 10h13m-5-5 5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function Chevron({ open = false, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={`h-3.5 w-3.5 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      } ${className}`}
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <span className="relative flex h-5 w-5 items-center justify-center">
      <span
        className={`absolute h-px w-5 bg-current transition-transform duration-300 ${
          open ? "rotate-45" : "-translate-y-[4px]"
        }`}
      />
      <span
        className={`absolute h-px w-5 bg-current transition-transform duration-300 ${
          open ? "-rotate-45" : "translate-y-[4px]"
        }`}
      />
    </span>
  );
}

function Brand({ logoSrc, logoText }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5">
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={logoText}
          className="h-9 w-auto max-w-36 object-contain"
        />
      ) : (
        <>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
            {logoText.charAt(0).toUpperCase()}
          </span>

          <span className="text-[15px] font-semibold tracking-[-0.055em] text-neutral-950 sm:text-base">
            {logoText}
            <span className="text-orange-500">.</span>
          </span>
        </>
      )}
    </span>
  );
}

// Desktop language selector
function LanguageSelect({ language, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleOutside(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selected =
    languages.find((item) => item.code === language) || languages[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full px-3 py-2.5 text-[12px] font-medium text-neutral-600 transition-colors hover:bg-black/[0.045] hover:text-neutral-950"
      >
        <span>{selected.label}</span>
        <Chevron open={open} />
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+12px)] z-[100] w-60 origin-top-right transition-[opacity,transform,visibility] duration-200 ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-white/90 bg-white/95 p-1.5 shadow-[0_18px_55px_rgba(28,25,20,0.14)] backdrop-blur-2xl">
          <p className="px-3 pb-2 pt-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Choose language
          </p>

          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                onSelect(item.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[12px] transition-colors ${
                language === item.code
                  ? "bg-orange-50 text-neutral-950"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
            >
              {item.label}
              {language === item.code && (
                <span className="text-orange-600">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Link-only desktop dropdown
function MegaMenu({ title, items, onNavigate }) {
  return (
    <div className="px-5 py-4 sm:px-8 sm:py-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          {title}
        </p>
        <span className="mx-4 h-px flex-1 bg-black/[0.07]" />
        <span className="text-[10px] text-neutral-400">
          {String(items.length).padStart(2, "0")} links
        </span>
      </div>

      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="group flex min-h-12 items-center justify-between gap-4 border-b border-black/[0.055] px-2 py-3 text-[13px] text-neutral-600 transition-colors hover:text-neutral-950"
          >
            <span className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 transition-colors group-hover:bg-orange-500" />
              {item.label}
            </span>

            <ArrowIcon
              diagonal
              className="h-3.5 w-3.5 -translate-x-1 text-neutral-400 opacity-0 transition-all group-hover:translate-x-0 group-hover:text-orange-600 group-hover:opacity-100"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

// Small reusable drawer row
function DrawerRow({ label, detail, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-black/[0.035]"
    >
      <span>
        <span className="block text-[13px] font-medium text-neutral-800">
          {label}
        </span>
        {detail && (
          <span className="mt-0.5 block text-[11px] text-neutral-400">
            {detail}
          </span>
        )}
      </span>

      {icon || (
        <ArrowIcon className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
      )}
    </button>
  );
}

export default function Navbar({
  logoSrc = null,
  logoText = "Iconic Travel",
  signInHref = "/sign-in",
}) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const language = getLocale(pathname);

  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerView, setDrawerView] = useState("home");

  const closeTimer = useRef(null);
  const navRef = useRef(null);
  const pillRef = useRef(null);
  const navItemsRef = useRef([]);
  const drawerPageRef = useRef(null);

  // Navigate to the equivalent page in the selected language.
  function changeLanguage(locale) {
    const nextPath = getLocalizedPath(pathname, locale);
    const currentUrl =
      window.location.pathname + window.location.search + window.location.hash;

    const nextUrl = nextPath + window.location.search + window.location.hash;

    setDrawerView("home");
    setDrawerOpen(false);
    setActiveDropdown(null);

    if (currentUrl !== nextUrl) router.push(nextUrl);
  }

  function closeAll() {
    window.clearTimeout(closeTimer.current);
    setActiveDropdown(null);
    setDrawerOpen(false);
    setDrawerView("home");
  }

  // Scroll-based compact navbar.
  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 90);

    const trigger = ScrollTrigger.create({
      start: "top -90px",
      end: "max",
      onUpdate: updateScroll,
      onLeaveBack: updateScroll,
      onRefresh: updateScroll,
    });

    updateScroll();

    return () => trigger.kill();
  }, []);

  // Reset menus when the navbar changes between expanded and compact.
  useEffect(() => {
    setActiveDropdown(null);
    setDrawerOpen(false);
    setDrawerView("home");
  }, [scrolled]);

  // Escape key closes the navigation.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") closeAll();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock background scrolling while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  // Clear pending timers when unmounting.
  useEffect(() => {
    return () => window.clearTimeout(closeTimer.current);
  }, []);

  // One shared animated pill for all desktop navigation links.
  function movePill(index) {
    const pill = pillRef.current;
    const item = navItemsRef.current[index];

    if (!pill || !item) return;

    gsap.to(pill, {
      x: item.offsetLeft,
      width: item.offsetWidth,
      opacity: 1,
      duration: 0.38,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  function hidePill() {
    if (!pillRef.current) return;

    gsap.to(pillRef.current, {
      opacity: 0,
      duration: 0.2,
      overwrite: "auto",
    });
  }

  function openDropdown(name) {
    window.clearTimeout(closeTimer.current);
    setActiveDropdown(name);
  }

  function scheduleDropdownClose() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }

  // Animate the drawer's second-level views.
  useEffect(() => {
    if (!drawerOpen || !drawerPageRef.current) return;

    gsap.fromTo(
      drawerPageRef.current,
      { x: 8, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.22,
        ease: "power2.out",
        overwrite: true,
      },
    );
  }, [drawerView, drawerOpen]);

  const shellClass = `
    relative mx-auto w-full overflow-visible border border-white/85
    bg-white/75 backdrop-blur-2xl
    shadow-[0_12px_45px_rgba(30,25,15,0.09),inset_0_1px_0_rgba(255,255,255,0.95)]
    transition-[max-width,border-radius] duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]
    ${scrolled ? "max-w-[440px] rounded-[24px]" : "max-w-7xl rounded-[28px]"}
  `;

  const panelClass = (open) => `
    grid transition-[grid-template-rows,opacity] duration-300
    ease-[cubic-bezier(0.22,1,0.36,1)]
    ${
      open
        ? "grid-rows-[1fr] opacity-100"
        : "pointer-events-none grid-rows-[0fr] opacity-0"
    }
  `;

  const desktopVisible = scrolled
    ? "pointer-events-none invisible opacity-0"
    : "visible opacity-100";

  const compactVisible = scrolled
    ? "visible opacity-100"
    : "pointer-events-none invisible opacity-0";

  const drawerItems = {
    services: { title: "Services", items: services },
    business: { title: "For Business", items: businessLinks },
  };

  return (
    <>
      {drawerOpen && (
        <button
          type="button"
          aria-label="Close navigation drawer"
          onClick={closeAll}
          className="fixed inset-0 z-40 bg-neutral-950/[0.025] backdrop-blur-[1px]"
        />
      )}

      <header className="fixed inset-x-0 top-4 z-50 px-3 sm:top-5 sm:px-5">
        <nav
          aria-label="Main navigation"
          onMouseLeave={scheduleDropdownClose}
          className={shellClass}
        >
          {/* Header row */}
          <div className="relative h-[72px]">
            {/* Expanded desktop navigation */}
            <div
              aria-hidden={scrolled}
              inert={scrolled}
              className={`absolute inset-0 hidden items-center justify-between px-4 transition-opacity duration-200 lg:flex xl:px-6 ${desktopVisible}`}
            >
              <Link
                href="/"
                aria-label={`${logoText} home`}
                onClick={closeAll}
                className="shrink-0"
              >
                <Brand logoSrc={logoSrc} logoText={logoText} />
              </Link>

              {/* Navigation links and shared pill */}
              <div
                ref={navRef}
                onMouseLeave={hidePill}
                className="absolute left-1/2 flex -translate-x-1/2 items-center gap-0.5"
              >
                <span
                  ref={pillRef}
                  className="pointer-events-none absolute inset-y-0 left-0 z-0 rounded-full bg-black/[0.045] opacity-0"
                />

                {[
                  { label: "Services", type: "dropdown", name: "services" },
                  { label: "For Business", type: "dropdown", name: "business" },
                  ...regularLinks.map((item) => ({
                    ...item,
                    type: "link",
                  })),
                ].map((item, index) => (
                  <div key={item.label} className="relative">
                    {item.type === "dropdown" ? (
                      <button
                        ref={(element) => {
                          navItemsRef.current[index] = element;
                        }}
                        type="button"
                        aria-expanded={activeDropdown === item.name}
                        onMouseEnter={() => {
                          movePill(index);
                          openDropdown(item.name);
                        }}
                        onFocus={() => movePill(index)}
                        onClick={() =>
                          setActiveDropdown((current) =>
                            current === item.name ? null : item.name,
                          )
                        }
                        className="nav-link group relative z-10 flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[12px] font-medium text-neutral-700 transition-colors hover:text-neutral-950 xl:px-4 xl:text-[13px]"
                      >
                        {item.label}
                        <Chevron open={activeDropdown === item.name} />
                      </button>
                    ) : (
                      <Link
                        ref={(element) => {
                          navItemsRef.current[index] = element;
                        }}
                        href={item.href}
                        onMouseEnter={() => {
                          movePill(index);
                          setActiveDropdown(null);
                        }}
                        onFocus={() => movePill(index)}
                        onClick={closeAll}
                        className="nav-link relative z-10 block rounded-full px-3.5 py-2.5 text-[12px] font-medium text-neutral-700 transition-colors hover:text-neutral-950 xl:px-4 xl:text-[13px]"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <LanguageSelect language={language} onSelect={changeLanguage} />

                <Button href={signInHref} size="md" className="ml-1">
                  Sign in
                  <ArrowIcon diagonal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Compact header */}
            <div
              className={`absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-200 sm:px-5 ${
                scrolled
                  ? compactVisible
                  : "visible opacity-100 lg:pointer-events-none lg:invisible lg:opacity-0"
              }`}
            >
              <Link href="/" aria-label={`${logoText} home`} onClick={closeAll}>
                <Brand logoSrc={logoSrc} logoText={logoText} />
              </Link>

              <button
                type="button"
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
                aria-expanded={drawerOpen}
                aria-controls="navbar-drawer"
                onClick={() => {
                  setActiveDropdown(null);
                  setDrawerView("home");
                  setDrawerOpen((open) => !open);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.07] bg-white/70 text-neutral-900 transition-colors duration-200 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white active:scale-95"
              >
                <MenuIcon open={drawerOpen} />
              </button>
            </div>
          </div>

          {/* Desktop integrated dropdown */}
          <div
            aria-hidden={!activeDropdown || scrolled}
            inert={!activeDropdown || scrolled}
            onMouseEnter={() => window.clearTimeout(closeTimer.current)}
            onMouseLeave={scheduleDropdownClose}
            className={panelClass(Boolean(activeDropdown && !scrolled))}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="rounded-b-[27px] border-t border-black/[0.065]">
                {activeDropdown === "services" && !scrolled && (
                  <MegaMenu
                    title="Services"
                    items={services}
                    onNavigate={closeAll}
                  />
                )}

                {activeDropdown === "business" && !scrolled && (
                  <MegaMenu
                    title="For Business"
                    items={businessLinks}
                    onNavigate={closeAll}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Compact drawer with dedicated second-level views */}
          <div
            id="navbar-drawer"
            aria-hidden={!drawerOpen}
            inert={!drawerOpen}
            className={panelClass(drawerOpen)}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="max-h-[min(65vh,360px)] overflow-y-auto overscroll-contain rounded-b-[23px] border-t border-black/[0.065] px-4 pb-4 pt-3 sm:px-5">
                <div ref={drawerPageRef}>
                  {drawerView === "home" ? (
                    <>
                      <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        Explore
                      </p>

                      <DrawerRow
                        label="Services"
                        detail="Explore our travel services"
                        onClick={() => setDrawerView("services")}
                      />

                      <DrawerRow
                        label="For Business"
                        detail="Corporate travel and partnerships"
                        onClick={() => setDrawerView("business")}
                      />

                      <DrawerRow
                        label="Language"
                        detail={
                          languages.find((item) => item.code === language)
                            ?.label || "English"
                        }
                        onClick={() => setDrawerView("language")}
                      />

                      {regularLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeAll}
                          className="group flex items-center justify-between rounded-xl px-3 py-3 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-black/[0.035] hover:text-neutral-950"
                        >
                          {item.label}
                          <ArrowIcon className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ))}

                      <Button
                        href={signInHref}
                        fullWidth
                        className="mt-3"
                        onClick={closeAll}
                        rightIcon={<ArrowIcon diagonal className="h-4 w-4" />}
                      >
                        Sign in
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Back navigation */}
                      <button
                        type="button"
                        onClick={() => setDrawerView("home")}
                        className="mb-3 flex items-center gap-2 rounded-lg px-2 py-2 text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-950"
                      >
                        <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
                        Back
                      </button>

                      {drawerView === "language" ? (
                        <>
                          <p className="mb-2 px-2 text-sm font-semibold text-neutral-900">
                            Choose language
                          </p>

                          <div className="space-y-1">
                            {languages.map((item) => (
                              <button
                                key={item.code}
                                type="button"
                                onClick={() => changeLanguage(item.code)}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[12px] transition-colors ${
                                  language === item.code
                                    ? "bg-orange-50 text-neutral-950"
                                    : "text-neutral-600 hover:bg-black/[0.035] hover:text-neutral-950"
                                }`}
                              >
                                {item.label}
                                {language === item.code && (
                                  <span className="text-orange-600">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-2 px-2 text-sm font-semibold text-neutral-900">
                            {drawerItems[drawerView]?.title}
                          </p>

                          <div className="space-y-1">
                            {drawerItems[drawerView]?.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeAll}
                                className="group flex items-center justify-between rounded-xl px-3 py-3 text-[12px] text-neutral-600 transition-colors hover:bg-black/[0.035] hover:text-neutral-950"
                              >
                                {item.label}
                                <ArrowIcon
                                  diagonal
                                  className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
