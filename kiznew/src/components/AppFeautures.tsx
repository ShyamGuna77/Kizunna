"use client";

import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  CheckCircle,
  Coffee,
  Sparkles,
} from "lucide-react";
import React from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AppFeauters = () => {
  return (
    <AnimatedSection className="py-16 bg-pink-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div variants={fadeInUp} className="md:w-1/2">
            <div className="relative">
              <div className="w-full rounded-xl border-3 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-pink-300 p-3">
                <div className="rounded-lg border-2 border-black overflow-hidden bg-pink-100 flex items-center justify-center p-8">
                  <div className="w-full max-w-xs aspect-[3/4] bg-gradient-to-b from-pink-100 to-pink-200 rounded-xl border-2 border-black p-4 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-pink-200 border-2 border-black mb-4 flex items-center justify-center overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1619687174476-03650bed65c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y291cGxlfGVufDB8fDB8fHww"
                        alt="Couple Image"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-xl">Find Love</h3>
                      <p className="text-sm mt-2">
                        Our app connects hearts across the world
                      </p>
                      <div className="mt-4">
                        <p className="font-semibold text-pink-600">
                          We don’t match faces. We connect souls
                        </p>
                        <p className="text-xs text-gray-700">
                          The right person is out there. Let us help you find
                          them
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-4">
                      <div className="bg-pink-500 p-2 rounded-lg border-2 border-black">
                        <Heart className="h-6 w-6 text-white" fill="white" />
                      </div>
                      <div className="bg-white p-2 rounded-lg border-2 border-black">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-red-300 p-4 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Heart className="h-8 w-8" fill="black" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="md:w-1/2">
            <div className="inline-block bg-pink-300 px-4 py-1 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Premium Features
            </div>
            <h2 className="text-4xl font-bold mb-6">Designed for True Love</h2>
            <p className="text-xl mb-8">
              Our app is designed to help you find genuine connections based on
              shared interests, values, and goals. Because true love deserves
              the best tools.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Heart,
                  title: "Compatibility Matching",
                  description:
                    "Our AI learns your preferences to suggest your perfect match",
                },
                {
                  icon: CheckCircle,
                  title: "Verified Profiles",
                  description:
                    "All profiles are verified to ensure you're meeting real people looking for love",
                },
                {
                  icon: Coffee,
                  title: "Romantic Date Ideas",
                  description:
                    "Get personalized date suggestions based on shared interests",
                },
                {
                  icon: Sparkles,
                  title: "Love Insights",
                  description:
                    "Receive relationship advice and compatibility reports",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-pink-300 p-2 rounded-lg border-2 border-black mr-4">
                    <item.icon
                      className="h-5 w-5"
                      fill={item.icon === Heart ? "#ec4899" : "none"}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default AppFeauters;
