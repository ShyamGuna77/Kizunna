import { SignUp } from "@/components/auth/Sign-up";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-[400px] space-y-6">
      <div className="space-y-2 text-center">
        
      </div>
      <SignUp />
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/Sign-in"
          className="text-black font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
