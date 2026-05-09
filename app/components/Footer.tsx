"use client";

import Link from "next/link";
import { useActiveAccount } from "thirdweb/react";

const Footer = () => {
  const account = useActiveAccount();

  return (
    <footer
      className="
        mt-20
        bg-gradient-to-r
        from-slate-900
        via-slate-800
        to-slate-900
        border-t border-emerald-500/20
        text-white
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-10
          "
        >
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={"/"}>
              <div className="flex items-center gap-4 cursor-pointer mb-5">
                {/* Logo */}
                <div
                  className="
                    w-14 h-14 rounded-2xl
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
                    className="w-7 h-7 text-white"
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
                  <h2 className="text-2xl font-bold">SDG FundChain</h2>

                  <p className="text-slate-400 text-sm">
                    Blockchain For Social Impact
                  </p>
                </div>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-xl">
              Empowering communities through transparent blockchain crowdfunding
              aligned with the United Nations Sustainable Development Goals.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Navigation</h3>

            <div className="flex flex-col gap-3">
              <Link href={"/"}>
                <p className="text-slate-400 hover:text-emerald-400 transition cursor-pointer">
                  Explore Campaigns
                </p>
              </Link>

              {account && (
                <Link href={`/dashboard/${account?.address}`}>
                  <p className="text-slate-400 hover:text-emerald-400 transition cursor-pointer">
                    My Dashboard
                  </p>
                </Link>
              )}
            </div>
          </div>

          {/* Mission */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Our Mission</h3>

            <div className="flex flex-col gap-3 text-slate-400">
              <p>🌱 Sustainable Communities</p>

              <p>💧 Clean Water Access</p>

              <p>📚 Education For All</p>

              <p>⚡ Transparent Funding</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
            mt-12 pt-6
            border-t border-slate-700
            flex flex-col md:flex-row
            items-center justify-between
            gap-4
          "
        >
          <p className="text-slate-500 text-sm">
            © 2026 SDG FundChain. Built for sustainable impact.
          </p>

          <p className="text-slate-500 text-sm">
            Decentralized • Transparent • Community Driven
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
