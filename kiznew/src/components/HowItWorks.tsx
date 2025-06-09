"use client";
import AnimatedSection from "./AnimatedSection";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { User } from "lucide-react";
import { Search } from "lucide-react";
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HowitWorks() {
  return (
    <>
      <AnimatedSection className="py-16 bg-pink-100">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-block bg-pink-300 px-4 py-1 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Our Process
            </div>
            <h2 className="text-4xl font-bold mb-4">How LoveMatch Works</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Our unique approach to dating makes finding your soulmate easier
              than ever
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Create Your Love Profile",
                description:
                  "Sign up and create your unique profile to showcase your personality and what you're looking for in a partner",
                icon: User,
                color: "bg-red-200",
              },
              {
                title: "Discover Potential Soulmates",
                description:
                  "Browse through potential matches based on your preferences and our smart compatibility algorithm",
                icon: Search,
                color: "bg-pink-300",
              },
              {
                title: "Connect & Fall in Love",
                description:
                  "Chat with your matches and arrange to meet in person when you feel that special connection",
                icon: Heart,
                color: "bg-red-300",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-6 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-5px] transition-transform duration-300"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-xl border-2 border-black flex items-center justify-center mb-4`}
                >
                  <feature.icon
                    className="h-8 w-8"
                    fill={feature.icon === Heart ? "#ec4899" : "none"}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
