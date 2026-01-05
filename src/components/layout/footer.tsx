
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    // This effect runs only on the client-side after initial hydration.
    // This prevents a server-client mismatch for the year.
    setCurrentYear(new Date().getFullYear());
  }, []);

  const kasupdaAddress = "No. 1 KASUPDA Road, Off Independence Way, Kaduna, Nigeria";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(kasupdaAddress)}`;

  const physicalAddress = "No 4 Bida Road, Business District Area, Kaduna State.";
  const hotline = "09037236253";

  return (
    <footer className="border-t border-border/40 bg-background/95 py-8">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 md:px-6">
        
        {/* Social Media and Navigation Links Section */}
        <div className="flex flex-col md:flex-row md:justify-between items-center w-full max-w-4xl gap-6 md:gap-8">
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Facebook" className="text-blue-600 hover:text-blue-700 transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="X (formerly Twitter)" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.931ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
              </svg>
            </Link>
            <Link href="#" aria-label="Instagram" className="text-pink-600 hover:text-pink-700 transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
          </div>

          <nav className="flex flex-col items-center text-center gap-2 md:flex-row md:gap-4">
            <Link
              href="/faq"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              prefetch={false}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              prefetch={false}
            >
              Contact
            </Link>
            <Link
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
              prefetch={false}
            >
              <MapPin className="mr-1 h-4 w-4" /> Map
            </Link>
          </nav>
        </div>

        {/* Copyright, Address, and Hotline Section - Centered at the bottom */}
        <div className="flex flex-col items-center text-center gap-2 mt-6 pt-6 border-t border-border/20 w-full">
          <Image src="/image/logo.png" alt="KASUPDA Logo" width={32} height={32} className="h-8 w-8 mb-2" />
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear || new Date().getFullYear()} KASUPDA. All rights reserved.
          </p>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>{physicalAddress}</span>
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Phone className="h-3 w-3 shrink-0" />
            <span>Hotline: {hotline}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
