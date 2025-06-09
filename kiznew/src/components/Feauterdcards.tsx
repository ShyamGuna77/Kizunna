"use client";
import AnimatedSection from "./AnimatedSection";
import { motion } from "motion/react";
import Image from "next/image";
import { Heart } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Feauterdcards = () => {
  return (
    <div>
      <AnimatedSection className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="inline-block bg-pink-300 px-4 py-1 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Featured Singles
            </div>
            <h2 className="text-4xl font-bold mb-4">Meet Amazing People</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Discover our vibrant community of singles ready to connect and
              find their perfect match!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Alex",
                age: 28,
                location: "New York",
                color: "bg-[#FFD7E9]",
                interests: ["Travel", "Photography", "Hiking"],
                url: "https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
              },
              {
                name: "Hailey",
                age: 25,
                location: "Los Angeles",
                color: "bg-[#F0C0FE]",
                interests: ["Music", "Art", "Coffee"],
                url: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGdpcmwlMjBwcm9maWxlJTIwcGljdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
              },
              {
                name: "Jordan",
                age: 24,
                location: "Chicago",
                color: "bg-pink-300",
                interests: ["Fitness", "Cooking", "Movies"],
                url: "https://images.unsplash.com/photo-1648218943004-5ec604ef627a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fE1lbiUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
              },
              {
                name: "Casey",
                age: 27,
                location: "Miami",
                color: "bg-[#F1DDCF]",
                interests: ["Reading", "Yoga", "Beach"],
                url: "https://images.unsplash.com/photo-1695827163796-c26a087bd728?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJldHR5JTIwd29tZW58ZW58MHx8MHx8fDA%3D",
              },
            ].map((profile, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className={`${profile.color} rounded-xl border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}
              >
                <div className="relative mb-4">
                  <div className="w-full aspect-square rounded-lg border-2 border-black overflow-hidden bg-white flex items-center justify-center">
                    <Image
                      src={profile.url}
                      alt="A person profile picture"
                      width={80}
                      height={80}
                      className="object-cover object-top w-full h-full"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-white p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Heart className="h-5 w-5 text-pink-500" fill="#ec4899" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">
                  {profile.name}, {profile.age}
                </h3>
                <div className="flex items-center text-sm mb-3">
                  <div className="w-3 h-3 bg-pink-500 rounded-full mr-1"></div>
                  <span>{profile.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="bg-white px-2 py-1 rounded-md border border-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Feauterdcards;
