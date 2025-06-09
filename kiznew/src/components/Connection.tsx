"use client";

import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "motion/react";
import FemaleChat from "../../public/logo/FemaleChat.png";
import Heart from "../../public/logo/Heart.png";
import MaleChat from "../../public/logo/Malechat.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Connection() {
  return (
    <>
      <div>
        <AnimatedSection className="py-8 md:py-16 bg-pink-50">
          <div className="container mx-auto px-4">
            <motion.div variants={fadeInUp} className="text-center mb-4">
              <div className="inline-block bg-pink-300 px-4 py-1 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Connect & Chat
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Find Your Perfect Connection
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                Our app brings people together through meaningful conversations
                that lead to real connections
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="relative max-w-5xl mx-auto h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
            >
              {/* Left Person (Female) */}
              <div className="absolute left-0 bottom-10 sm:bottom-16 md:bottom-20 lg:bottom-24 w-1/3 md:w-2/5 h-full flex items-end justify-center">
                <Image
                  src={FemaleChat}
                  alt="Female chatting Svg"
                  className="object-contain w-4/5 md:w-4/5 lg:w-full max-h-[80%] md:max-h-full"
                  priority
                />
              </div>

              {/* Center Heart */}
              <div className="absolute left-1/2 top-1/3 md:top-1/4 transform -translate-x-1/2 w-1/5 md:w-1/5 z-10">
                <Image
                  src={Heart}
                  alt="Heart pic"
                  className="object-contain mx-auto w-full"
                  priority
                />
              </div>

              {/* Right Person (Male) */}
              <div className="absolute right-0 bottom-10 sm:bottom-16 md:bottom-20 lg:bottom-24 w-1/3 md:w-2/5 h-full flex items-end justify-center">
                <Image
                  src={MaleChat}
                  alt="Male chatting"
                  className="object-contain w-4/5 md:w-4/5 lg:w-full max-h-[80%] md:max-h-full"
                  priority
                />
              </div>

              {/* Message Lines with Animation */}
              <svg
                className="absolute inset-0 w-full h-full z-0"
                viewBox="0 0 800 500"
                preserveAspectRatio="none"
              >
                {/* Path from Female to before Heart */}
                <path
                  d="M200,200 Q300,150 350,160"
                  fill="none"
                  stroke="#F472B6"
                  strokeWidth="1.5"
                  strokeDasharray="15,8"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="100"
                    to="0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Path from after Heart to Male */}
                <path
                  d="M450,160 Q500,150 600,200"
                  fill="none"
                  stroke="#F472B6"
                  strokeWidth="1.5"
                  strokeDasharray="15,8"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="100"
                    to="0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Path from Male to before Heart */}
                <path
                  d="M600,240 Q500,290 450,260"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="1.5"
                  strokeDasharray="15,8"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="100"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Path from after Heart to Female */}
                <path
                  d="M350,260 Q300,290 200,240"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="1.5"
                  strokeDasharray="15,8"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="100"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
              {[
                {
                  title: "Match & Connect",
                  description:
                    "Find people who share your interests and values for deeper connections",
                  color: "bg-red-100",
                },
                {
                  title: "Chat & Share",
                  description:
                    "Engage in meaningful conversations that go beyond small talk",
                  color: "bg-pink-200",
                },
                {
                  title: "Meet & Fall in Love",
                  description:
                    "Take your online connection to the real world and find true love",
                  color: "bg-pink-300",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`${item.color} p-4 md:p-6 transform rounded-xl border-2 md:border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-5px] transition-transform duration-300 hover:scale-105`}
                >
                  <h3 className="text-lg md:text-xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </>
  );
}
