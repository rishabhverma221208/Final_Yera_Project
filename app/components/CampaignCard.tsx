import { getContract } from "thirdweb";
import { client } from "../client";
// import { CROWDFUNDING_FACTORY } from "../constants/contracts";
import { sepolia } from "thirdweb/chains";
import { useEffect, useRef } from "react";
import { useReadContract } from "thirdweb/react";
import Link from "next/link";

type CampaignCardProps = {
    campaignAddress: string;  
}

export default function CampaignCard({ campaignAddress }: CampaignCardProps) {
    
    const contract = getContract({
        client,
        address: campaignAddress,
        chain: sepolia,
    });

    const { data: campaignName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
    });

    const { data: campaignDescription } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
    });

    const { data: goal , isLoading: isLoadingGoal } = useReadContract({
    contract,
    method: "function goal() view returns (uint256)",
    params: [],
    });

    const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
    });

    const totalBalance = balance?.toString();
    const totalGoal = goal?.toString();
    let balancePercentage = (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

    if (balancePercentage >= 100) {
        balancePercentage = 100;
    }

    const progressRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.setProperty("--progress-width", `${balancePercentage?.toString()}%`);
        }
    }, [balancePercentage]);

    const { data: state } = useReadContract({
        contract,
        method: "function state() view returns (uint8)",
        params: [],
    });
    return (
  <div
    className="
      flex flex-col justify-between
      bg-white border border-emerald-100
      rounded-3xl p-6
      shadow-sm hover:shadow-lg
      transition-all duration-300
    "
  >

    <div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">

        <div>

          <p
            className="
              text-xs font-semibold
              uppercase tracking-wide
              text-emerald-600 mb-2
            "
          >
            SDG Impact Campaign
          </p>

          <h5
            className="
              text-2xl font-bold
              text-slate-800 leading-snug
            "
          >
            {campaignName}
          </h5>

        </div>

        {/* Status Badge */}
        <div
          className={
            Number(state) === 0
              ? "px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700"
              : Number(state) === 1
                ? "px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                : "px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"
          }
        >

          {Number(state) === 0
            ? "Active"
            : Number(state) === 1
              ? "Successful"
              : "Closed"}

        </div>

      </div>

      {/* Progress */}
      {!isLoadingBalance && (
        <div className="mb-5">

          <div className="flex items-center justify-between mb-2">

            <p
              className="
                text-xs font-semibold
                uppercase tracking-wide
                text-emerald-600
              "
            >
              Impact Progress
            </p>

            <p className="text-sm font-bold text-emerald-600">
              {balancePercentage.toFixed(1)}%
            </p>

          </div>

          <div
            ref={progressRef}
            className="
              w-full h-3
              bg-emerald-100
              rounded-full overflow-hidden
            "
          >

            <div
              className="
                h-full
                bg-gradient-to-r
                from-emerald-500
                to-teal-500
                transition-all duration-700
              "
              style={{
                width: `${balancePercentage}%`,
              }}
            />

          </div>

          <div
            className="
              flex justify-between
              mt-2 text-xs text-slate-500
            "
          >

            <p>
              Raised: ₹{balance?.toString()}
            </p>

            <p>
              Goal: ₹{goal?.toString()}
            </p>

          </div>
        </div>
      )}

      {/* Description */}
      <p
        className="
          text-slate-500
          leading-relaxed text-sm
        "
      >
        {campaignDescription}
      </p>

    </div>

    {/* CTA */}
    <Link
      href={`/campaign/${campaignAddress}`}
      passHref={true}
    >

      <button
        className="
          mt-6 w-full
          inline-flex items-center justify-center gap-2
          px-5 py-3 rounded-2xl
          bg-gradient-to-r
          from-emerald-500
          to-teal-600
          text-white font-semibold
          shadow-md
          hover:opacity-90
          transition
        "
      >

        Support This Mission

        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >

          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />

        </svg>

      </button>

    </Link>
  </div>
);
}