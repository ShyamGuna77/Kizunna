"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Home,
  Menu,
  MessageCircle,
  User,
} from "lucide-react";

const Hero = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 mt-12 px-6 ">
      <motion.div
        className="md:w-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-block bg-red-300 px-4 py-1 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          #1 Dating App of 2025
        </div>
        <Link href="/dashboard">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
          Find Your{" "}
          <span className="bg-pink-500 text-white px-2 -rotate-2 inline-block">
            Soulmate
          </span>{" "}
          Today!
        </h2>
        </Link>
        <p className="text-lg md:text-xl mt-6 mb-8">
          Join thousands of singles looking for true love and meaningful
          connections. Our unique matching algorithm helps you find people who
          share your heart&apos;s desires. Love is just a click away!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="bg-pink-400 px-6 py-3 rounded-xl border-2 border-black font-semibold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-white"
          >
            Find Love Now
          </Link>
          <Link
            href="#"
            className="bg-white px-6 py-3 rounded-xl border-2 border-black font-semibold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            How It Works
          </Link>
        </div>
        <div className="flex items-center mt-8">
          <div className="flex -space-x-4">
            {images.map((img, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-white"
              >
                <Image
                  src={img.url}
                  alt={`Profile ${i}`}
                  width={40}
                  height={40}
                  className="object-cover object-top w-full h-full"
                />
              </div>
            ))}
          </div>
          <div className="ml-4">
            <span className="font-bold">1,000+</span> new love stories today
          </div>
        </div>
      </motion.div>

      <motion.div
        className="md:w-1/2 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="relative w-[280px] h-[560px] mx-auto">
          <div className="absolute top-0 left-0 w-full h-full bg-pink-300 rounded-[40px] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-3">
            <div className="bg-white h-full w-full rounded-[30px] border-2 border-black overflow-hidden relative">
              <div className="bg-pink-300 p-4 flex items-center justify-between border-b-2 border-black">
                <div className="bg-white p-2 rounded-lg border-2 border-black">
                  <ArrowLeft className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-xl">Discover</h3>
                <div className="bg-white p-2 rounded-lg border-2 border-black">
                  <Menu className="h-5 w-5" />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-xl mb-3">New Matches</h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img) => (
                    <div key={img.id} className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-pink-200 border-2 border-black overflow-hidden flex items-center justify-center relative">
                        <Image
                          src={img.url}
                          alt={`Image ${img.id}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right mt-1">
                  <span className="text-pink-500 font-medium">View more</span>
                </div>
                <h4 className="font-bold text-xl mt-4 mb-3">Your Dates</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      img: "https://images.unsplash.com/photo-1647058517574-27dddbe12afc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGN1dGUlMjB3b21hbiUyMHRlZW58ZW58MHx8MHx8fDA%3D",
                      name: "Nami",
                    },
                    {
                      img: "https://plus.unsplash.com/premium_photo-1714195646981-221ce73e0d5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fGN1dGUlMjB3b21hbiUyMHRlZW58ZW58MHx8MHx8fDA%3D",
                      name: "Sia",
                    },
                  ].map((profile, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border-2 border-black"
                    >
                      <div className="w-full aspect-square rounded-lg bg-white border-2 border-black overflow-hidden mb-2 flex items-center justify-center">
                        <Image
                          src={profile.img}
                          alt={profile.name}
                          width={100}
                          height={100}
                          className="object-cover object-center"
                        />
                      </div>
                      <p className="font-bold">{profile.name}, 29</p>
                      <div className="flex items-center text-sm">
                        <div className="w-3 h-3 bg-pink-500 rounded-full mr-1"></div>
                        <span>USA</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-black p-3 flex justify-around">
                <div className="bg-pink-500 p-2 rounded-lg">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <Heart className="h-6 w-6 text-pink-400" fill="#f472b6" />
                <MessageCircle className="h-6 w-6" />
                <User className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;

const images = [
  {
    id: 1,
    url: "https://plus.unsplash.com/premium_photo-1668896122605-debd3fed81a4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1613397872384-3647751890b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTZ8fGN1dGUlMjB3b21hbiUyMHRlZW58ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 3,
    url: "https://plus.unsplash.com/premium_photo-1668896123841-2ddfc6c6e8da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGdvb2QlMjBsb29raW5nJTIwdGVlbiUyMGdpcmx8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 4,
    url: "https://plus.unsplash.com/premium_photo-1664379518976-01f6f1735ae4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z29vZCUyMGxvb2tpbmclMjB0ZWVuJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1708534098593-e4f7d6f285dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGdvb2QlMjBsb29raW5nJTIwdGVlbiUyMGdpcmx8ZW58MHx8MHx8fDA%3D",
  },
];
