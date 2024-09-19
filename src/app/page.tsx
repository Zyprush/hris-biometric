"use client";
import Link from "next/link";
import { SignedIn } from "../components/signed-in";
import { SignedOut } from "../components/signed-out";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { RoleBasedRedirect } from "@/components/RoleBasedRedirect";

export default function Home() {
  const text = "SMART HR";
  
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.5, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay: i * 0.5, duration: 0.01 }
      }
    })
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
              <div className="grid grid-cols-1 pl-10 p-5 py-0 bg-zinc-900 bg-opacity-80">
                <motion.svg
                  width="300"
                  height="100"
                  viewBox="0 0 300 100"
                  initial="hidden"
                  animate="visible"
                >
                  {text.split("").map((char, index) => (
                    <motion.path
                      key={index}
                      d={getPath(char, index)}
                      fill="transparent"
                      strokeWidth="4"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={pathVariants}
                      custom={index}
                    />
                  ))}
                </motion.svg>
              </div>
              <div className="font-extralight text-sm md:text-base dark:text-neutral-200 text-center">
                All of your need for human resources management.
              </div>
              <Link
                className="bg-primary hover:bg-secondary text-white font-bold py-2 px-9 rounded-md mt-4 transition ease-in-out duration-150"
                href="/sign-in"
              >
                Sign in
              </Link>
            </SignedIn>
            <SignedOut>
            <div className="grid grid-cols-1 pl-10 p-5 py-0 bg-zinc-900 bg-opacity-80">
                <motion.svg
                  width="300"
                  height="100"
                  viewBox="0 0 300 100"
                  initial="hidden"
                  animate="visible"
                >
                  {text.split("").map((char, index) => (
                    <motion.path
                      key={index}
                      d={getPath(char, index)}
                      fill="transparent"
                      strokeWidth="4"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={pathVariants}
                      custom={index}
                    />
                  ))}
                </motion.svg>
              </div>
              <div className="font-extralight text-sm md:text-base dark:text-neutral-200 text-center">
                All of your need for human resources management.
              </div>
              <Link
                className="bg-primary hover:bg-secondary text-white font-bold py-2 px-9 rounded-md mt-4 transition ease-in-out duration-150"
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

// Explicitly define the type for getPath
function getPath(char: string, index: number): string {
  const baseX = 30 + index * 30;
  const baseY = 50;
  
  // Simple paths for each character
  const paths: { [key: string]: string } = {
    'S': `M${baseX},${baseY+20} C${baseX+10},${baseY+10} ${baseX-10},${baseY-10} ${baseX},${baseY-20}`,
    'M': `M${baseX-10},${baseY+20} L${baseX-5},${baseY-20} L${baseX},${baseY+10} L${baseX+5},${baseY-20} L${baseX+10},${baseY+20}`,
    'A': `M${baseX-10},${baseY+20} L${baseX},${baseY-20} L${baseX+10},${baseY+20} M${baseX-5},${baseY} L${baseX+5},${baseY}`,
    'R': `M${baseX-10},${baseY+20} L${baseX-10},${baseY-20} Q${baseX+10},${baseY-20} ${baseX+10},${baseY} L${baseX-10},${baseY} L${baseX+10},${baseY+20}`,
    'T': `M${baseX-10},${baseY-20} L${baseX+10},${baseY-20} M${baseX},${baseY-20} L${baseX},${baseY+20}`,
    'H': `M${baseX-10},${baseY+20} L${baseX-10},${baseY-20} M${baseX+10},${baseY+20} L${baseX+10},${baseY-20} M${baseX-10},${baseY} L${baseX+10},${baseY}`,
  };
  
  return paths[char] || '';
}