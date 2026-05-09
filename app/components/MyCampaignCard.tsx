import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type MyCampaignCardProps = {
  contractAddress: string;
};

export const MyCampaignCard: React.FC<MyCampaignCardProps> = ({
  contractAddress,
}) => {
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: contractAddress,
  });

  // Get Campaign Name
  const { data: name } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
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
      {/* Content */}
      <div>
        <div
          className="
        inline-flex items-center gap-2
        px-3 py-1 rounded-full
        bg-emerald-50 border border-emerald-100
        mb-4
      "
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500" />

          <p
            className="
          text-xs uppercase tracking-wide
          font-semibold text-emerald-700
        "
          >
            SDG Impact Initiative
          </p>
        </div>

        <h5
          className="
        text-2xl font-bold
        text-slate-800 leading-snug
        mb-3
      "
        >
          {name}
        </h5>

        <p
          className="
        text-slate-500
        leading-relaxed text-sm
      "
        >
          {description}
        </p>
      </div>

      {/* CTA */}
      <Link href={`/campaign/${contractAddress}`} passHref={true}>
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
          Manage Campaign
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
};
