"use client";

import Link from "next/link";
import { SignedIn } from "../components/signed-in";
import { SignedOut } from "../components/signed-out";
import { GrFingerPrint } from "react-icons/gr";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { RoleBasedRedirect } from "@/components/RoleBasedRedirect";
import animationData from "../../public/img/hr-animation.json";
import Lottie from "react-lottie";

export default function Home() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <main>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <>
            <SignedIn>
              <RoleBasedRedirect />
              <div className="grid grid-cols-1">
                <Lottie options={defaultOptions} height={260} />
              </div>
              <p className="text-4xl p-2 px-4 bg-zinc-50 bg-opacity-20 rounded-lg border-2 border-zinc-100 text-white shadow-md font-bold">SMART HR</p>

              <div className="font-extralight text-sm md:text-base dark:text-neutral-200 text-center">
                All of your need for human resources management.
              </div>
              <Link
                className=" bg-primary hover:bg-secondary text-white font-bold py-2 px-9 rounded-md mt-4 transition ease-in-out duration-150"
                href="/sign-in"
              >
                Sign in
              </Link>
            </SignedIn>
            <SignedOut>
              <div className="grid grid-cols-1">
                <Lottie options={defaultOptions} height={260} />
              </div>
              <p className="text-4xl p-2 px-4 bg-zinc-50 bg-opacity-20 rounded-lg border-2 border-zinc-100 text-white shadow-md font-bold">SMART HR</p>

              <div className="font-extralight text-sm md:text-base dark:text-neutral-200 text-center">
                All of your need for human resources management.
              </div>
              <Link
                className=" bg-primary hover:bg-secondary text-white font-bold py-2 px-9 rounded-md mt-4 transition ease-in-out duration-150"
                href="/sign-in"
              >
                Sign in
              </Link>
            </SignedOut>
          </>
        </motion.div>
      </AuroraBackground>
    </main>
  );
}
