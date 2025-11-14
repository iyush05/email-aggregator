"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Connect Your Gmail</h1>
        <p className="text-gray-600 mb-6">
          Sign in securely with Google to sync your emails.
        </p>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center w-full gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.25 1.45 7.69 2.66l5.65-5.65C33.83 3.5 29.26 1.5 24 1.5 14.61 1.5 6.43 6.86 2.9 14.42l6.59 5.12C11.01 13.52 16.94 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.5c0-1.46-.13-2.87-.37-4.25H24v8.06h12.4c-.55 2.96-2.2 5.46-4.69 7.17l7.14 5.52C43.33 37.07 46.1 31.3 46.1 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M9.49 28.04A14.4 14.4 0 0 1 8.5 24c0-1.4.23-2.76.65-4.04L2.56 14.8A22.03 22.03 0 0 0 1 24c0 3.53.84 6.87 2.34 9.8l6.15-5.76z"
            />
            <path
              fill="#4285F4"
              d="M24 46c5.96 0 10.96-1.96 14.61-5.34l-7.14-5.52c-1.98 1.32-4.49 2.09-7.47 2.09-7.06 0-13-4.02-15.51-9.69l-6.59 5.12C6.43 41.14 14.61 46 24 46z"
            />
          </svg>
          {loading ? "Connecting..." : "Continue with Google"}
        </button>
      </div>
    </main>
  );
}
