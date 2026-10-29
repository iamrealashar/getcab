
export const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "de", label: "German (Deutsch)" },
  { code: "fr", label: "French (Français)" },
  { code: "es", label: "Spanish (Español)" },
];

export const services = [
  { label: "Airport Transfers", href: "/services/airport-transfers" },
  { label: "Chauffeur Service", href: "/services/chauffeur" },
  { label: "Executive Travel", href: "/services/executive-travel" },
];

export const businessLinks = [
  { label: "Corporate Accounts", href: "/business/corporate-accounts" },
  { label: "Business Travel", href: "/business/travel-management" },
  { label: "Become a Partner", href: "/business/partners" },
];

export const regularLinks = [
  { label: "Chauffeurs", href: "/chauffeurs" },
  { label: "Help", href: "/help" },
];

const localeCodes = languages.map(({ code }) => code);

export function getLocale(pathname = "/") {
  const firstSegment = pathname.split("/")[1];
  return localeCodes.includes(firstSegment) ? firstSegment : "en";
}

export function getBasePath(pathname = "/") {
  const segments = pathname.split("/");

  if (localeCodes.includes(segments[1])) {
    segments.splice(1, 1);
  }

  return segments.join("/") || "/";
}

export function getLocalizedPath(pathname = "/", locale = "en") {
  const basePath = getBasePath(pathname);

  if (locale === "en") return basePath;

  return `/${locale}${basePath === "/" ? "" : basePath}`;
}
