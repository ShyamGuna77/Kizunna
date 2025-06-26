import Link from "next/link";
import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-10 py-12 flex flex-col items-center">
        <div className="bg-yellow-200 border-2 border-black rounded-full p-6 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Frown className="w-16 h-16 text-pink-400" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-pink-500">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
          <br />
          Try going back to the homepage or explore other sections.
        </p>
        <Link
          href="/"
          className="bg-pink-300 border-2 border-black rounded-lg px-6 py-3 font-bold text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
