"use client";

import React from "react";

import AnimatedSection from "./AnimatedSection";
import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Check } from "lucide-react";
import { X } from "lucide-react";
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Pricing = () => {
  const [yearlyBilling, setYearlyBilling] = useState(false);
  return (
    <>
      <AnimatedSection className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-block bg-pink-300 px-4 py-1 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Pricing Plans
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Choose Your Love Journey
            </h2>
            <p className="text-xl max-w-2xl mx-auto">
              Select the plan that fits your needs and start your journey to
              finding true love
            </p>

            <div className="flex items-center justify-center mt-8 mb-4">
              <span
                className={`mr-3 font-medium ${
                  !yearlyBilling ? "text-pink-600" : ""
                }`}
              >
                Monthly
              </span>
              <div
                className="relative w-16 h-8 bg-pink-200 rounded-full border-2 border-black cursor-pointer"
                onClick={() => setYearlyBilling(!yearlyBilling)}
              >
                <motion.div
                  className="absolute top-1 w-6 h-6 bg-pink-500 rounded-full border-2 border-black"
                  animate={{
                    left: yearlyBilling ? "calc(100% - 24px - 4px)" : "2px",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
              <span
                className={`ml-3 font-medium ${
                  yearlyBilling ? "text-pink-600" : ""
                }`}
              >
                Yearly{" "}
                <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full border border-black">
                  Save 25%
                </span>
              </span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`${
                  plan.color
                } rounded-xl border-2 border-black p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative ${
                  plan.popular ? "transform md:-translate-y-4" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-4 py-1 rounded-full border-2 border-black font-bold text-sm">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4 mb-2">
                    <span className="text-4xl font-bold">
                      ${yearlyBilling ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600">
                      /{yearlyBilling ? "year" : "month"}
                    </span>
                  </div>
                  {yearlyBilling && plan.monthlyPrice > 0 && (
                    <p className="text-sm text-pink-600">
                      Save $
                      {(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2)}{" "}
                      per year
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-pink-500 mr-2" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mr-2" />
                      )}
                      <span className={feature.included ? "" : "text-gray-500"}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Link
                    href="#"
                    className={`block w-full py-3 rounded-xl border-2 border-black font-semibold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                      plan.popular ? "bg-pink-400 text-white" : "bg-white"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  );
};

export default Pricing;

const pricingPlans = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: "Basic Profile Creation", included: true },
      { name: "Browse Profiles", included: true },
      { name: "Limited Matches Per Day", included: true },
      { name: "Basic Messaging", included: true },
      { name: "Compatibility Reports", included: false },
      { name: "Advanced Filters", included: false },
      { name: "See Who Likes You", included: false },
    ],
    cta: "Sign Up Free",
    popular: false,
    color: "bg-white",
  },
  {
    name: "Premium",
    monthlyPrice: 19.99,
    yearlyPrice: 179.91,
    features: [
      { name: "Enhanced Profile Creation", included: true },
      { name: "Unlimited Browsing", included: true },
      { name: "Unlimited Matches", included: true },
      { name: "Advanced Messaging", included: true },
      { name: "Compatibility Reports", included: true },
      { name: "Advanced Filters", included: true },
      { name: "See Who Likes You", included: true },
    ],
    cta: "Get Premium",
    popular: true,
    color: "bg-pink-300",
  },
  {
    name: "VIP",
    monthlyPrice: 29.99,
    yearlyPrice: 269.9,
    features: [
      { name: "Priority Profile Visibility", included: true },
      { name: "Exclusive VIP Matches", included: true },
      { name: "Unlimited Everything", included: true },
      { name: "Video Chat", included: true },
      { name: "Personal Matchmaking", included: true },
      { name: "Date Planning Assistance", included: true },
      { name: "24/7 Priority Support", included: true },
    ],
    cta: "Go VIP",
    popular: false,
    color: "bg-red-200",
  },
];
