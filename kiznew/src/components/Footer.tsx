"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Instagram, Youtube, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8 border-t-2 border-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-400 p-3 rounded-xl border-2 border-black">
                <Heart className="h-6 w-6 text-white" fill="white" />
              </div>
              <h1 className="text-2xl font-bold ml-3">Kizuna</h1>
            </div>
            <p className="mb-4">
              Connecting hearts and creating meaningful relationships since
              2025. Our mission is to help people find true love.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="bg-pink-100 p-2 rounded-lg border-2 border-black hover:bg-pink-200 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="bg-pink-100 p-2 rounded-lg border-2 border-black hover:bg-pink-200 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="bg-pink-100 p-2 rounded-lg border-2 border-black hover:bg-pink-200 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="bg-pink-100 p-2 rounded-lg border-2 border-black hover:bg-pink-200 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-pink-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Dating Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Relationship Advice
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Dating Safety
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-500">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="mb-4">
              Get dating tips and love advice delivered to your inbox
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-4 py-2 rounded-l-lg border-2 border-black focus:outline-none"
              />
              <button className="bg-pink-400 text-white px-4 py-2 rounded-r-lg border-2 border-l-0 border-black hover:bg-pink-500 transition-colors">
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-black pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} LoveMatch. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-sm hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Cookie Policy
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Community Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
