"use client";

import { client } from "../../client";
import { sepolia } from "thirdweb/chains";
// import { getContract } from "thirdweb";
import {
  getContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { CROWDFUNDING_FACTORY } from "../../constants/contracts";
import { useState } from "react";
import { deployPublishedContract } from "thirdweb/deploys";
import { MyCampaignCard } from "../../components/MyCampaignCard";

export default function DashboardPage() {
  const account = useActiveAccount();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY,
  });

  // Get Campaigns
  const {
    data: myCampaigns,
    isLoading: isLoadingMyCampaigns,
    refetch,
  } = useReadContract({
    contract: contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 mt-12 sm:px-6 lg:px-8">
      {/* Dashboard Hero */}
      <div
        className="
      bg-gradient-to-r
      from-emerald-600
      via-teal-600
      to-cyan-700
      rounded-3xl
      p-8
      shadow-xl
      text-white
      mb-10
    "
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-wide text-emerald-100 font-semibold mb-3">
              SDG Impact Dashboard
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Empower Communities Through
              <span className="text-emerald-200"> Blockchain Funding</span>
            </h1>

            <p className="text-emerald-50 text-lg mt-4 leading-relaxed">
              Manage your impact-driven campaigns, track community
              contributions, and create sustainable change through decentralized
              crowdfunding.
            </p>
          </div>

          <div>
            <button
              className="
            px-6 py-4 rounded-2xl
            bg-white text-teal-700
            font-semibold
            shadow-lg
            hover:bg-emerald-50
            transition-all duration-300
          "
              onClick={() => setIsModalOpen(true)}
            >
              + Launch Impact Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Campaign Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Your Initiatives
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-1">
              My Campaigns
            </h2>
          </div>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoadingMyCampaigns ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-slate-500 text-lg">
                Loading impact campaigns...
              </p>
            </div>
          ) : myCampaigns && myCampaigns.length > 0 ? (
            myCampaigns.map((campaign, index) => (
              <MyCampaignCard
                key={index}
                contractAddress={campaign.campaignAddress}
              />
            ))
          ) : (
            <div
              className="
            col-span-full
            bg-emerald-50
            border border-emerald-100
            rounded-3xl
            p-12
            text-center
          "
            >
              <h3 className="text-2xl font-bold text-slate-700 mb-3">
                No Campaigns Yet
              </h3>

              <p className="text-slate-500 max-w-lg mx-auto mb-6">
                Start your first SDG-focused fundraising initiative and inspire
                communities to support meaningful impact.
              </p>

              <button
                className="
              px-6 py-3 rounded-2xl
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
                Create Your First Campaign
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          refetch={refetch}
        />
      )}
    </div>
  );
}

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
  refetch: () => void;
};

const CreateCampaignModal = ({
  setIsModalOpen,
  refetch,
}: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [isDeployingContract, setIsDeployingContract] =
    useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState<string>("1");
  const [campaignDeadline, setCampaignDeadline] = useState<string>("30");

  const handleDeployContract = async () => {
    if (!account) {
      alert("Connect wallet first");
      return;
    }

    try {
      setIsDeployingContract(true);

      const contract = getContract({
        client,
        chain: sepolia,
        address: "0x7a012897Dd3ec19D7A8646F51609610B105D7D57",
      });

      const transaction = prepareContractCall({
        contract,
        method:
          "function createCampaign(string _name, string _description, uint256 _goal, uint256 _durationInDays)",
        params: [
          campaignName,
          campaignDescription,
          BigInt(campaignGoal),
          BigInt(campaignDeadline),
        ],
      });

      const result = await sendTransaction({
        transaction,
        account,
      });

      console.log("Submitted:", result.transactionHash);

      // IMPORTANT
      await waitForReceipt({
        client,
        chain: sepolia,
        transactionHash: result.transactionHash,
      });

      console.log("Transaction mined");

      // NOW refetch updated blockchain data
      await refetch();

      alert("Campaign created successfully!");

      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsDeployingContract(false);
    }
  };

  return (
    <div
      className="
    fixed inset-0 z-50
    bg-black/60 backdrop-blur-sm
    flex justify-center items-center
    p-4
  "
    >
      <div
        className="
      w-full max-w-2xl
      bg-white rounded-3xl
      shadow-2xl overflow-hidden
    "
      >
        {/* Header */}
        <div
          className="
        bg-gradient-to-r
        from-emerald-600
        via-teal-600
        to-cyan-700
        px-8 py-6 text-white
      "
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm uppercase tracking-wide text-emerald-100 font-semibold mb-2">
                SDG Impact Funding
              </p>

              <h2 className="text-3xl font-bold">Launch Impact Campaign</h2>

              <p className="text-emerald-50 mt-2">
                Create a decentralized fundraising initiative that empowers
                communities and drives sustainable change.
              </p>
            </div>

            <button
              className="
            w-10 h-10 rounded-full
            bg-white/20 hover:bg-white/30
            transition
            flex items-center justify-center
          "
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="flex flex-col gap-6">
            {/* Campaign Name */}
            <div>
              <label
                htmlFor="name"
                className="
              block text-sm font-semibold
              text-slate-700 mb-2
            "
              >
                Campaign Title
              </label>

              <input
                id="name"
                type="text"
                placeholder="Clean Water For Rural Communities"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="
              w-full px-4 py-3 rounded-2xl
              border border-slate-200
              bg-slate-50
              focus:ring-2 focus:ring-emerald-500
              outline-none transition
            "
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="desc"
                className="
              block text-sm font-semibold
              text-slate-700 mb-2
            "
              >
                Mission Description
              </label>

              <textarea
                id="desc"
                placeholder="Describe how your initiative will create sustainable social impact and support SDG goals..."
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
                className="
              w-full px-4 py-3 rounded-2xl
              border border-slate-200
              bg-slate-50 h-32
              focus:ring-2 focus:ring-emerald-500
              outline-none transition
            "
              />
            </div>

            {/* Goal + Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="goal"
                  className="
                block text-sm font-semibold
                text-slate-700 mb-2
              "
                >
                  Funding Goal (₹)
                </label>

                <input
                  id="goal"
                  type="number"
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  placeholder="50000"
                  className="
                w-full px-4 py-3 rounded-2xl
                border border-slate-200
                bg-slate-50
                focus:ring-2 focus:ring-emerald-500
                outline-none transition
              "
                />
              </div>

              <div>
                <label
                  htmlFor="deadline"
                  className="
                block text-sm font-semibold
                text-slate-700 mb-2
              "
                >
                  Campaign Duration (Days)
                </label>

                <input
                  id="deadline"
                  type="number"
                  value={campaignDeadline}
                  onChange={(e) => setCampaignDeadline(e.target.value)}
                  placeholder="30"
                  className="
                w-full px-4 py-3 rounded-2xl
                border border-slate-200
                bg-slate-50
                focus:ring-2 focus:ring-emerald-500
                outline-none transition
              "
                />
              </div>
            </div>

            {/* CTA */}
            <button
              disabled={isDeployingContract || !campaignName}
              className="
            mt-2 w-full px-6 py-4 rounded-2xl
            bg-gradient-to-r
            from-emerald-500
            to-teal-600
            text-white font-bold
            shadow-lg
            hover:opacity-90
            transition-all
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
              onClick={handleDeployContract}
            >
              {isDeployingContract
                ? "Deploying Campaign To Blockchain..."
                : "Launch Impact Campaign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
