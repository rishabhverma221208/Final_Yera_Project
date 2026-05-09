"use client";

import CampaignCard from "../components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "../constants/contracts";
// import { getContract } from "thirdweb";
// import { client } from "./client";
// import { CROWDFUNDING_FACTORY } from "./constants/contracts";
// import { sepolia } from "thirdweb/chains";
import Link from "next/link";
// import { useReadContract } from "thirdweb/react";
import { getContract, readContract } from "thirdweb";

import { useReadContract } from "thirdweb/react";

import { client } from "../client";

import { sepolia } from "thirdweb/chains";

const factoryAddress = CROWDFUNDING_FACTORY;

export default function CampaignsPage() {
  // Factory Contract
  const contract = getContract({
    client,
    chain: sepolia,
    address: factoryAddress,
  });

  // Fetch Campaigns
  const { data: campaigns, isLoading } = useReadContract({
    contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [],
  });

  return (
    <main
      className="
      bg-slate-50 min-h-screen
      mx-auto max-w-7xl
      px-4 sm:px-6 lg:px-8
      py-12
    "
    >
      {/* Heading */}
      <div className="mb-10">
        <h1
          className="
          text-5xl font-bold
          text-slate-800
        "
        >
          Campaigns
        </h1>

        <p
          className="
          text-slate-500
          mt-3 text-lg
        "
        >
          Support impactful SDG-driven initiatives.
        </p>
      </div>

      {/* Campaign Grid */}
      <div
        className="
        grid grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      "
      >
        {isLoading ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-500 text-lg">Loading campaigns...</p>
          </div>
        ) : campaigns && campaigns.length > 0 ? (
          campaigns.map((campaign: any) => (
            <CampaignCard
              key={campaign.campaignAddress}
              campaignAddress={campaign.campaignAddress}
            />
          ))
        ) : (
          <div
            className="
            col-span-full
            bg-white border border-emerald-100
            rounded-3xl
            p-14 text-center
            shadow-sm
          "
          >
            <div
              className="
              w-20 h-20 rounded-full
              bg-emerald-100
              flex items-center justify-center
              text-4xl
              mx-auto mb-6
            "
            >
              🌱
            </div>

            <h3
              className="
              text-3xl font-bold
              text-slate-800 mb-4
            "
            >
              No Campaigns Available
            </h3>

            <p
              className="
              text-slate-500
              leading-relaxed
            "
            >
              Campaigns will appear here once created.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
