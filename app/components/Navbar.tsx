"use client";
import { client } from "../client";
import Link from "next/link";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import Image from "next/image";
// import thirdwebIcon from "@public/thirdweb.svg";

const Navbar = () => {
  const account = useActiveAccount();

  return (
    <nav
      className="
    sticky top-0 z-50
    bg-white/80 backdrop-blur-md
    border-b border-emerald-100
  "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href={"/"}>
              <div className="flex items-center gap-3 cursor-pointer">
                {/* SDG Style Logo */}
                <div
                  className="
                w-12 h-12 rounded-2xl
                bg-gradient-to-r
                from-emerald-500
                via-teal-500
                to-cyan-600
                flex items-center justify-center
                shadow-lg
              "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12h18"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c3.5 3.5 3.5 14.5 0 18"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c-3.5 3.5-3.5 14.5 0 18"
                    />

                    <circle cx="12" cy="12" r="9" stroke="currentColor" />
                  </svg>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    SDG FundChain
                  </h1>

                  <p className="text-xs text-slate-500">
                    Blockchain For Social Impact
                  </p>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <Link href={"/campaignPage"}>
                <div
                  className="
                px-4 py-2 rounded-xl
                text-slate-600 font-medium
                hover:bg-emerald-50
                hover:text-emerald-700
                transition
              "
                >
                  Explore Campaigns
                </div>
              </Link>

              {account && (
                <Link href={`/dashboard/${account?.address}`}>
                  <div
                    className="
                  px-4 py-2 rounded-xl
                  text-slate-600 font-medium
                  hover:bg-emerald-50
                  hover:text-emerald-700
                  transition
                "
                  >
                    My Dashboard
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center">
            <div
              className="
            bg-white border border-emerald-100
            rounded-2xl p-1 shadow-sm
          "
            >
              <ConnectButton
                client={client}
                theme={lightTheme()}
                detailsButton={{
                  style: {
                    maxHeight: "48px",
                    borderRadius: "14px",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
