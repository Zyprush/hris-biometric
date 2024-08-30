"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen text-center ">
        <h1 className="text-6xl dark:text-white font-bold text-neutral">404</h1>
        <h2 className="text-lg text-neutral font-semibold dark:text-zinc-200">Page Not Found</h2>
        <p className="mt-4 text-zinc-700 dark:text-zinc-300 text-sm mx-20 md:mx-auto">
          The page your looking for does not exist or has been moved.
        </p>
        <button
          onClick={handleGoBack}
          className="mt-8 px-4 py-2 bg-primary text-xs text-white rounded hover:bg-neutral"
        >
          Go back
        </button>
        <Link
          className="mt-8 px-4 py-2 bg-primary text-white rounded hover:bg-neutral text-xs"
          href={"/"}
        >
          Home
        </Link>
        
      </div>
    </div>
  );
}
