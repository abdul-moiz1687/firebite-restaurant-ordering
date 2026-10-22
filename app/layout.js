import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "@/context/LocationContext";
import LocationModal from "@/components/location/LocationModal";
import SiteHeader from "@/components/layout/SiteHeader";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import SiteFooter from "@/components/layout/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Restaurant Ordering | Fresh Food Delivered",
  description:
    "Explore the menu, customize your order, and order your favorite food.",
};

export default function RootLayout({ children }) {
  return (
    <html
 lang="en"
  data-scroll-behavior="smooth"
  className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <body className="min-h-screen">
  <LocationProvider>
    <CartProvider>
      <SiteHeader />

      {children}
  <SiteFooter />
      <LocationModal />

      <Toaster position="bottom-center" />
    </CartProvider>
  </LocationProvider>
</body>
    </html>
  );
}