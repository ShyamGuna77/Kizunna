"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { updateUser } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      });

      console.log("Sign in response:", response);

      if (response.error) {
        toast.error(response.error.message || "Failed to sign in");
        return;
      }

      // Handle redirect case
      if (response.data.redirect && response.data.url) {
        window.location.href = response.data.url;
        return;
      }

      // Handle successful sign in with user data
      if ("user" in response.data) {
        const userData = {
          id: response.data.user.id,
          name:
            response.data.user.name || response.data.user.email.split("@")[0],
          email: response.data.user.email,
          image: response.data.user.image || null,
        };

        updateUser(userData);
        toast.success("Signed in successfully!");
        router.push("/dashboard");
      } else {
        toast.error("No user data received");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSocialLogin = async (provider: "github" | "google") => {
    try {
      const response = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });

      console.log("Social login response:", response);

      if (response.error) {
        toast.error(
          response.error.message || `Failed to sign in with ${provider}`
        );
        return;
      }

      // Handle redirect case
      if (response.data.redirect && response.data.url) {
        window.location.href = response.data.url;
        return;
      }

      // Handle successful sign in with user data
      if ("user" in response.data) {
        const userData = {
          id: response.data.user.id,
          name:
            response.data.user.name || response.data.user.email.split("@")[0],
          email: response.data.user.email,
          image: response.data.user.image || null,
        };

        updateUser(userData);
        toast.success(`Signed in with ${provider} successfully!`);
        router.push("/dashboard");
      } else {
        toast.error("No user data received");
      }
    } catch (err) {
      console.error("Social login error:", err);
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="border-2 border-black rounded-md focus:ring-2 focus:ring-black focus:ring-offset-2"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="border-2 border-black rounded-md focus:ring-2 focus:ring-black focus:ring-offset-2"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black rounded-md transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-black hover:bg-gray-100"
            onClick={() => handleSocialLogin("github")}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
            GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-black hover:bg-gray-100"
            onClick={() => handleSocialLogin("google")}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Google
          </Button>
        </div>
      </div>
    </div>
  );
}
