import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({ reset }: { reset?: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-10 py-12 flex flex-col items-center">
        <div className="bg-orange-200 border-2 border-black rounded-full p-6 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AlertTriangle className="w-16 h-16 text-pink-400" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900">
          Something went wrong
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
          Sorry, an unexpected error occurred. Please try again or go back to
          the homepage.
        </p>
        <div className="flex gap-4">
          {reset && (
            <button
              onClick={() => reset()}
              className="bg-yellow-300 border-2 border-black rounded-lg px-6 py-3 font-bold text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Retry
            </button>
          )}
          <Link
            href="/"
            className="bg-pink-300 border-2 border-black rounded-lg px-6 py-3 font-bold text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
