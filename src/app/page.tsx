"use client";

import Link from "next/link";
import { SignedIn } from "../components/signed-in";
import { SignedOut } from "../components/signed-out";
import { GrFingerPrint } from "react-icons/gr";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { RoleBasedRedirect } from "@/components/RoleBasedRedirect";

export default function Home() {

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
              <RoleBasedRedirect/>
              <div className="text-3xl md:text-7xl font-bold dark:text-white text-center flex items-center justify-center">
                H<GrFingerPrint className="mx-2" />man Resources Info System
              </div>

              <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                All of your need for human resources management.
              </div>
              <button
                className="bg-primary dark:bg-primary rounded-full w-fit text-white dark:text-white px-4 py-2"
              >
                Signing in...
              </button>
            </SignedIn>
            <SignedOut>
              <div className="grid grid-cols-1 gap-4">
                <span className="text-3xl md:text-7xl font-bold dark:text-white text-center flex items-center justify-center">
                  H<GrFingerPrint className="mx-2" />man
                </span>
                <span className="text-3xl md:text-7xl font-bold dark:text-white text-center flex items-center justify-center">
                  Resources Info System
                </span>
              </div>
              <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4 text-center">
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
