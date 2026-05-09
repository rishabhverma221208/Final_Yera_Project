"use client";
import { getContract } from "thirdweb";
import { client } from "./client";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";
import { sepolia } from "thirdweb/chains";
import Link from "next/link";
import { useReadContract } from "thirdweb/react";
import CampaignCard from "./components/CampaignCard";

export default function Home() {
  const contract = getContract({
    client,
    address: CROWDFUNDING_FACTORY,
    chain: sepolia,
  });

  const { data: campaigns, isLoading } = useReadContract({
    contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [],
  });
  console.log(campaigns);

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="
        relative overflow-hidden
        min-h-[90vh]
        flex items-center
      "
      >
        {/* Background */}
        <div
          className="
          absolute inset-0
          bg-gradient-to-br
          from-emerald-600
          via-teal-600
          to-cyan-700
        "
        />

        {/* Glow Effects */}
        <div
          className="
          absolute top-0 left-0
          w-[500px] h-[500px]
          bg-white/10 rounded-full
          blur-3xl
        "
        />

        <div
          className="
          absolute bottom-0 right-0
          w-[400px] h-[400px]
          bg-cyan-300/20 rounded-full
          blur-3xl
        "
        />

        {/* Content */}
        <div
          className="
          relative z-10
          mx-auto max-w-7xl
          px-6 lg:px-8 py-20
        "
        >
          <div className="max-w-4xl">
            {/* Badge */}
            <p
              className="
              inline-flex items-center gap-2
              px-4 py-2 rounded-full
              bg-white/10 border border-white/20
              text-emerald-50 text-sm
              uppercase tracking-wide
              font-semibold
              backdrop-blur-sm
              mb-6
            "
            >
              🌍 Blockchain Powered SDG Crowdfunding
            </p>

            {/* Heading */}
            <h1
              className="
              text-5xl md:text-7xl
              font-bold text-white
              leading-tight
            "
            >
              Fund Ideas That
              <span className="text-emerald-200"> Create Real Impact</span>
            </h1>

            {/* Description */}
            <p
              className="
              mt-8 text-xl
              text-emerald-50
              leading-relaxed
              max-w-3xl
            "
            >
              Empowering communities through transparent, decentralized
              crowdfunding aligned with the United Nations Sustainable
              Development Goals.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-5 mt-10">
              <Link href="/campaignPage">
                <button
                  className="
                  px-8 py-4 rounded-2xl
                  bg-white text-teal-700
                  font-bold text-lg
                  shadow-xl
                  hover:bg-emerald-50
                  transition-all duration-300
                "
                >
                  Explore Campaigns
                </button>
              </Link>

              <button
                className="
                px-8 py-4 rounded-2xl
                border border-white/30
                bg-white/10
                text-white font-semibold text-lg
                backdrop-blur-sm
                hover:bg-white/20
                transition-all duration-300
              "
              >
                Learn More
              </button>
            </div>

            {/* Impact Stats */}
            <div
              className="
              grid grid-cols-2 md:grid-cols-4
              gap-6 mt-16
            "
            >
              {/* Campaigns */}
              <div
                className="
                bg-white/10 border border-white/10
                backdrop-blur-md
                rounded-3xl p-6
              "
              >
                <h3 className="text-4xl font-bold text-white">100+</h3>

                <p className="text-emerald-100 mt-2">Active Campaigns</p>
              </div>

              {/* Contributions */}
              <div
                className="
                bg-white/10 border border-white/10
                backdrop-blur-md
                rounded-3xl p-6
              "
              >
                <h3 className="text-4xl font-bold text-white">₹10L+</h3>

                <p className="text-emerald-100 mt-2">Community Contributions</p>
              </div>

              {/* SDGs */}
              <div
                className="
                bg-white/10 border border-white/10
                backdrop-blur-md
                rounded-3xl p-6
              "
              >
                <h3 className="text-4xl font-bold text-white">17</h3>

                <p className="text-emerald-100 mt-2">SDG Goals Supported</p>
              </div>

              {/* Communities */}
              <div
                className="
                bg-white/10 border border-white/10
                backdrop-blur-md
                rounded-3xl p-6
              "
              >
                <h3 className="text-4xl font-bold text-white">50+</h3>

                <p className="text-emerald-100 mt-2">Communities Empowered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        className="
        mx-auto max-w-7xl
        px-4 sm:px-6 lg:px-8
        py-20
      "
      >
        {/* Section Heading */}
        <div className="text-center mb-14">
          <p
            className="
            text-sm uppercase tracking-wide
            text-emerald-600 font-semibold
          "
          >
            Our Purpose
          </p>

          <h2
            className="
            text-5xl font-bold
            text-slate-800 mt-3
          "
          >
            Building Sustainable Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div
            className="
            bg-white border border-emerald-100
            rounded-3xl p-8
            shadow-sm hover:shadow-lg
            transition-all duration-300
          "
          >
            <div
              className="
              w-16 h-16 rounded-2xl
              bg-emerald-100
              flex items-center justify-center
              text-3xl mb-6
            "
            >
              🌱
            </div>

            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              Our Mission
            </h3>

            <p className="text-slate-500 leading-relaxed text-lg">
              To create a decentralized and transparent crowdfunding ecosystem
              where blockchain technology empowers individuals and organizations
              to fund meaningful SDG-driven initiatives.
            </p>
          </div>

          {/* Vision */}
          <div
            className="
            bg-white border border-cyan-100
            rounded-3xl p-8
            shadow-sm hover:shadow-lg
            transition-all duration-300
          "
          >
            <div
              className="
              w-16 h-16 rounded-2xl
              bg-cyan-100
              flex items-center justify-center
              text-3xl mb-6
            "
            >
              🌍
            </div>

            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              Our Vision
            </h3>

            <p className="text-slate-500 leading-relaxed text-lg">
              To become the leading blockchain-powered platform for funding
              SDG-focused initiatives with trust, transparency, and measurable
              impact.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
