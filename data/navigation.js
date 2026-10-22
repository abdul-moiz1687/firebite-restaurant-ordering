import { siteConfig } from "@/data/siteConfig";

export const navigationLinks = [
  { label: "Menu", href: "/menu" },
  { label: "Offers", href: "/#offers" },
  { label: "Our Story", href: "/our-story" },
  {
    label: "Locations",
    href: siteConfig.mapUrl,
    external: true,
  },
  {
    label: "Contact",
    href: `https://wa.me/${siteConfig.whatsappNumber}`,
    external: true,
  },
];