"use client";
import Link from "next/link";

export default function Progresstracker() {
  return (
    <div className="flex flex-col items-center mt-10">

      {/* Progress Bar Container */}
      <div className="relative flex items-center w-full max-w-md">
        {/* Line Behind Buttons */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 z-0"></div>

        {/* Step Buttons */}
        <ul className="relative flex justify-between w-full z-10">
          <li>
            <Link href="/profile">
              <button className="bg-green-300 border border-amber-200 w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold">
                1
              </button>
            </Link>
          </li>

          <li>
            <Link href="/profile/SkillsForm">
              <button className="bg-green-300 border border-amber-200 w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold">
                2
              </button>
            </Link>
          </li>

          <li>
            <Link href="/profile/BioForm">
              <button className="bg-green-300 border border-amber-200 w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold">
                3
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
