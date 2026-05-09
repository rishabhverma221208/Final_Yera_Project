"use client";
import { getContract, prepareContractCall, ThirdwebContract } from "thirdweb";
import { client } from "@/app/client";
import { useParams } from "next/navigation";
import { sepolia } from "thirdweb/chains";
// import { useReadContract } from "thirdweb/react";
import { TierCard } from "@/app/components/TierCard";
import { useState } from "react";
import {
  lightTheme,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
  contract: ThirdwebContract;
};

function CreateCampaignModal({
  setIsModalOpen,
  contract,
}: CreateCampaignModalProps) {
  const [tierName, setTierName] = useState<string>("");

  const [tierAmount, setTierAmount] = useState<bigint>(BigInt(1));

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/50 backdrop-blur-sm
        flex items-center justify-center
        px-4
      "
    >
      <div
        className="
          w-full max-w-2xl
          bg-white rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            bg-gradient-to-r
            from-emerald-600
            to-teal-600
            px-6 py-5
            text-white
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-emerald-100">
                Community Support
              </p>

              <h2 className="text-2xl font-bold mt-1">
                Create Contribution Level
              </h2>
            </div>

            <button
              className="
                px-4 py-2 rounded-xl
                bg-white/20 hover:bg-white/30
                transition
              "
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-slate-500 mb-6">
            Define a support level that empowers contributors to participate in
            your impact mission.
          </p>

          <div className="flex flex-col gap-5">
            {/* Contribution Name */}
            <div>
              <label
                htmlFor="tier-name"
                className="
                  block mb-2
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Contribution Level Name
              </label>

              <input
                id="tier-name"
                type="text"
                value={tierName}
                onChange={(e) => setTierName(e.target.value)}
                placeholder="Education Supporter"
                title="Tier name"
                className="
                  w-full px-4 py-3 rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  focus:outline-none
                  focus:ring-2 focus:ring-emerald-500
                "
              />
            </div>

            {/* Contribution Amount */}
            <div>
              <label
                htmlFor="tier-cost"
                className="
                  block mb-2
                  text-sm font-semibold
                  text-slate-700
                "
              >
                Contribution Amount (₹)
              </label>

              <input
                id="tier-cost"
                type="number"
                value={parseInt(tierAmount.toString())}
                onChange={(e) => setTierAmount(BigInt(e.target.value))}
                placeholder="1000"
                title="Tier cost"
                className="
                  w-full px-4 py-3 rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  focus:outline-none
                  focus:ring-2 focus:ring-emerald-500
                "
              />
            </div>

            {/* Action */}
            <div className="pt-2">
              <TransactionButton
                transaction={() =>
                  prepareContractCall({
                    contract: contract,
                    method: "function addTier(string _name, uint256 _amount)",
                    params: [tierName, tierAmount],
                  })
                }
                onTransactionConfirmed={async () => {
                  alert("Contribution level created successfully!");

                  setIsModalOpen(false);
                }}
                onError={(error) => alert(`Error: ${error.message}`)}
                theme={lightTheme()}
              >
                Launch Contribution Level
              </TransactionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CampaignCard() {
  const account = useActiveAccount();
  const { campaignAddress } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExtendDeadline, setShowExtendDeadline] = useState(false);
  const [daysToAdd, setDaysToAdd] = useState<string>("");

  const contract = getContract({
    client,
    address: campaignAddress as string,
    chain: sepolia,
  });

  const { data: name, isLoading: isLoadingName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });

  const deadlineDate = new Date(
    parseInt(deadline?.toString() as string) * 1000,
  );
  const hasDeadlinePassed = deadlineDate < new Date();

  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
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
  let balancePercentage =
    (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

  if (balancePercentage >= 100) {
    balancePercentage = 100;
  }

  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    contract,
    method:
      "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const { data: state, isLoading: isLoadingState } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Campaign Hero */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-8 shadow-xl text-white">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left Content */}
          <div className="max-w-3xl">
            {!isLoadingName && (
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                {name}
              </h1>
            )}

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <p className="text-sm uppercase tracking-wide text-emerald-100 mb-2">
                Mission Overview
              </p>

              <p className="text-lg text-emerald-50 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Deadline + Status */}
            <div className="flex flex-wrap gap-4 mt-6">
              {!isLoadingDeadline && (
                <div className="bg-white/15 border border-white/10 backdrop-blur-md rounded-2xl px-5 py-3">
                  <p className="text-xs uppercase tracking-wide text-emerald-100">
                    Impact Timeline
                  </p>

                  <p className="font-semibold text-lg mt-1">
                    {deadlineDate.toDateString()}
                  </p>
                </div>
              )}

              {isEditing && (
                <div
                  className={
                    Number(state) === 0
                      ? "bg-green-400 text-slate-900 px-5 py-3 rounded-2xl font-semibold"
                      : Number(state) === 1
                        ? "bg-blue-400 text-slate-900 px-5 py-3 rounded-2xl font-semibold"
                        : "bg-red-400 text-slate-900 px-5 py-3 rounded-2xl font-semibold"
                  }
                >
                  {Number(state) === 0
                    ? "Campaign Active"
                    : Number(state) === 1
                      ? "Funding Goal Achieved"
                      : Number(state) === 2
                        ? "Campaign Closed"
                        : "Unknown"}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          {owner === account?.address && (
            <div className="flex flex-col gap-3 min-w-[220px]">
              <button
                className="
              px-5 py-3 rounded-2xl
              bg-white text-teal-700
              font-semibold shadow-md
              hover:bg-emerald-50
              transition-all duration-300
            "
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing
                  ? "Close Campaign Controls"
                  : "Manage Impact Campaign"}
              </button>

              {isEditing && (
                <button
                  onClick={() => setShowExtendDeadline(!showExtendDeadline)}
                  className="
                px-5 py-3 rounded-2xl
                bg-teal-900/40 border border-white/10
                text-white font-medium
                hover:bg-teal-900/60
                transition-all duration-300
              "
                >
                  {showExtendDeadline
                    ? "Cancel Timeline Update"
                    : "Extend Impact Timeline"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Extend Timeline Section */}
      {showExtendDeadline && (
        <div className="mt-6 bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Extend Campaign Timeline
          </h2>

          <p className="text-slate-500 mb-5">
            Give your mission more time to connect with supporters and create
            meaningful impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              placeholder="Add additional campaign days"
              value={daysToAdd}
              onChange={(e) => setDaysToAdd(e.target.value)}
              className="
            flex-1 px-4 py-3 rounded-2xl
            border border-slate-200
            bg-slate-50
            focus:outline-none
            focus:ring-2 focus:ring-emerald-500
          "
            />

            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract,
                  method: "function extendDeadline(uint256 _daysToAdd)",
                  params: [BigInt(daysToAdd)],
                })
              }
              onTransactionConfirmed={() => {
                alert("Campaign timeline extended successfully!");

                setShowExtendDeadline(false);

                setDaysToAdd("");
              }}
              onError={(error) => alert(error.message)}
              disabled={!daysToAdd || Number(daysToAdd) <= 0}
              theme={lightTheme()}
            >
              Extend Mission Timeline
            </TransactionButton>
          </div>
        </div>
      )}

      {/* Funding Progress */}
      {!isLoadingBalance && (
        <div>
          <div className="mt-8 bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                  Funding Progress
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-1">
                  ₹{goal?.toString()}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Community Impact Goal
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">
                  {balancePercentage.toFixed(1)}%
                </p>

                <p className="text-sm text-slate-500">Goal Achieved</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 bg-emerald-100 rounded-full overflow-hidden">
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

            <div className="flex justify-between mt-3 text-sm text-slate-500">
              <p>Raised: ₹{balance?.toString()}</p>

              <p>Target: ₹{goal?.toString()}</p>
            </div>
          </div>

          {/* Campaign Actions */}
          {hasDeadlinePassed && (
            <div className="mt-8">
              {/* Withdraw Section */}
              {owner === account?.address &&
                Number(balance) >= Number(goal) && (
                  <div
                    className="
          bg-white border border-emerald-100
          rounded-3xl p-6 shadow-sm
        "
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className="
              w-14 h-14 rounded-2xl
              bg-emerald-100
              flex items-center justify-center
              text-2xl
            "
                      >
                        💰
                      </div>

                      <div>
                        <p
                          className="
                text-sm uppercase tracking-wide
                text-emerald-600 font-semibold
              "
                        >
                          Campaign Successful
                        </p>

                        <h3 className="text-2xl font-bold text-slate-800">
                          Withdraw Community Funds
                        </h3>
                      </div>
                    </div>

                    <p className="text-slate-500 leading-relaxed mb-6">
                      Your campaign has successfully achieved its funding goal.
                      You can now securely withdraw community contributions and
                      continue creating meaningful impact.
                    </p>

                    <TransactionButton
                      transaction={() =>
                        prepareContractCall({
                          contract,
                          method: "function withdraw()",
                          params: [],
                        })
                      }
                      onTransactionConfirmed={() =>
                        alert("Funds withdrawn successfully!")
                      }
                      onError={(error) => alert(error.message)}
                      theme={lightTheme()}
                    >
                      Withdraw Funds
                    </TransactionButton>
                  </div>
                )}

              {/* Refund Section */}
              {Number(balance) < Number(goal) && (
                <div
                  className="
          mt-6
          bg-white border border-red-100
          rounded-3xl p-6 shadow-sm
        "
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="
              w-14 h-14 rounded-2xl
              bg-red-100
              flex items-center justify-center
              text-2xl
            "
                    >
                      ↩️
                    </div>

                    <div>
                      <p
                        className="
                text-sm uppercase tracking-wide
                text-red-600 font-semibold
              "
                      >
                        Campaign Unsuccessful
                      </p>

                      <h3 className="text-2xl font-bold text-slate-800">
                        Refund Available
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-500 leading-relaxed mb-6">
                    This campaign did not reach its funding goal before the
                    deadline. Contributors are eligible to securely claim
                    refunds for their support.
                  </p>

                  <TransactionButton
                    transaction={() =>
                      prepareContractCall({
                        contract,
                        method: "function refund()",
                        params: [],
                      })
                    }
                    onTransactionConfirmed={() =>
                      alert("Refund claimed successfully!")
                    }
                    onError={(error) => alert(error.message)}
                    theme={lightTheme()}
                  >
                    Claim Refund
                  </TransactionButton>
                </div>
              )}
            </div>
          )}

          <div className="mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                  SDG Community Support
                </p>

                <h2 className="text-2xl font-bold text-slate-800 mt-1">
                  Contribution Levels
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Support this mission through meaningful contributions.
                </p>
              </div>

              {isEditing && (
                <button
                  className="
          px-5 py-3 rounded-2xl
          bg-gradient-to-r
          from-emerald-500
          to-teal-600
          text-white font-semibold
          shadow-md
          hover:opacity-90
          transition
        "
                  onClick={() => setIsModalOpen(true)}
                >
                  + Create Support Level
                </button>
              )}
            </div>

            {/* Tier Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoadingTiers ? (
                <div className="col-span-full text-center py-10">
                  <p className="text-slate-500">
                    Loading contribution levels...
                  </p>
                </div>
              ) : tiers && tiers.length > 0 ? (
                tiers.map((tier, index) => (
                  <TierCard
                    key={index}
                    tier={tier}
                    index={index}
                    contract={contract}
                    isEditing={isEditing}
                  />
                ))
              ) : (
                !isEditing && (
                  <div
                    className="
            col-span-full
            bg-emerald-50
            border border-emerald-100
            rounded-3xl
            p-8
            text-center
          "
                  >
                    <h3 className="text-xl font-bold text-slate-700 mb-2">
                      No Support Levels Yet
                    </h3>

                    <p className="text-slate-500 text-sm">
                      Contribution opportunities will appear here soon.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          contract={contract}
        />
      )}
    </div>
  );
}
