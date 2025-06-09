import { SignIn } from "@/components/auth/Sign-in";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="w-full max-w-[400px] space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-gray-500">
          Enter your credentials to access your account
        </p>
      </div>
      <SignIn />
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/Sign-up"
          className="text-black font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
