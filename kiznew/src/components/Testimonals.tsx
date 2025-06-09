"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { PiButterflyDuotone } from "react-icons/pi";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const testimonials = [
  {
    names: "Jessica & Mike",
    location: "New York",
    story:
      "We matched on Kizuna and had our first date a week later. Six months in and we couldn't be happier! The compatibility matching is spot on. We're planning our wedding now!",
    bg: "bg-red-100",
    image:
      "https://images.unsplash.com/photo-1634659929132-70b1d5951cdd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    names: "David & Sarah",
    location: "Los Angeles",
    story:
      "Kizuna's personality matching is incredible! We had so much in common from day one. Now we're engaged and planning our wedding for next summer! Thank you for helping us find true love.",
    bg: "bg-pink-200",
    image:
      "https://images.unsplash.com/photo-1706565029362-06f74a8c2654?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    names: "Alex & Jordan",
    location: "Chicago",
    story:
      "We were both skeptical about dating apps until we tried Kizuna. The profile questions really helped us connect on a deeper level. After 3 months of dating, we're now living together!",
    bg: "bg-[#FECACA]",
    image:
      "https://plus.unsplash.com/premium_photo-1664299276304-743abd6eb3cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y291cGxlJTIwd2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
  },
];

const TestimonialSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const { names, location, story, bg, image } = testimonials[activeTestimonial];

  return (
    <>
      <AnimatedSection className="relative py-16 bg-pink-100">
        <div className="text-center mb-8">
          <p className="inline-block border-2 border-pink-600 px-4 py-2 bg-red-300 rounded-full text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]   font-medium">
            Love Stories
          </p>
          <h2 className="text-3xl font-bold mt-4 text-gray-800">
            Hear from Our Happy Couples
          </h2>
        </div>
        <div className="container mx-auto px-4">
          <motion.div
            className={`relative max-w-4xl mx-auto p-6 md:p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] ${bg}`}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute -top-6 -left-5">
              <PiButterflyDuotone size={40} className="text-pink-400" />
            </div>

            <div className="absolute -bottom-5 -right-5">
              <Heart className="h-8 w-8 text-pink-400 fill-pink-200" />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between w-full absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-2 md:px-8 pointer-events-none">
              <button
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-pink-300 pointer-events-auto"
              >
                <ChevronLeft size={24} className="text-gray-800" />
              </button>

              <button
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-pink-300 pointer-events-auto"
              >
                <ChevronRight size={24} className="text-gray-800" />
              </button>
            </div>

            <div className="md:flex items-center justify-between gap-6 md:gap-8 px-6 md:px-12">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-1 text-center md:text-left">
                  {names}
                </h3>
                <p className="text-sm text-center mb-4 text-gray-700 italic md:text-left">
                  from {location}
                </p>
                <p className="text-lg text-gray-800 text-center md:text-left">
                  {story}
                </p>
              </div>

              <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                <Image
                  src={image}
                  alt={`${names} testimonial`}
                  width={160}
                  height={160}
                  className="rounded-lg border-4 border-white object-top shadow-lg object-cover w-32 h-32 md:w-40 md:h-40"
                />
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex">
              {[...Array(3)].map((_, index) => (
                <Heart
                  key={index}
                  className={`h-6 w-6 text-pink-500 fill-pink-200 mx-1`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </AnimatedSection>
      <AnimatedSection className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: "1M+", label: "Happy Singles" },
              { number: "500K+", label: "Successful Matches" },
              { number: "10K+", label: "Love Stories" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-pink-300 p-6 rounded-xl border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <h3 className="text-4xl font-bold mb-2">{stat.number}</h3>
                <p className="text-xl">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
      <AnimatedSection className="py-16 bg-pink-200">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            variants={fadeInUp}
            className="max-w-3xl mx-auto bg-white p-8 rounded-xl border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="w-20 h-20 mx-auto bg-pink-300 rounded-full border-2 border-black flex items-center justify-center mb-6">
              <Heart className="h-10 w-10" fill="#ec4899" />
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Ready to Find Your Soulmate?
            </h2>
            <p className="text-xl mb-8">
              Join Kizuna today and start your journey to finding true love with
              someone who shares your passions and dreams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#"
                className="bg-pink-400 px-8 py-4 rounded-xl border-2 border-black font-semibold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-white"
              >
                Find Love Now
              </Link>
              <Link
                href="#"
                className="bg-red-300 px-8 py-4 rounded-xl border-2 border-black font-semibold text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
};

export default TestimonialSection;
