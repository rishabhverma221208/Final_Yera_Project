import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

type Tier = {
  name: string;
  amount: bigint;
  backers: bigint;
};

type TierCardProps = {
  tier: Tier;
  index: number;
  contract: ThirdwebContract;
  isEditing: boolean;
};

export const TierCard: React.FC<TierCardProps> = ({
  tier,
  index,
  contract,
  isEditing,
}) => {
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
      {/* Top Content */}
      <div>
        {/* Badge */}
        <div
          className="
        inline-flex items-center gap-2
        px-3 py-1 rounded-full
        bg-emerald-50 border border-emerald-100
        mb-5
      "
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500" />

          <p
            className="
          text-xs uppercase tracking-wide
          font-semibold text-emerald-700
        "
          >
            Contribution Level
          </p>
        </div>

        {/* Tier Info */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3
              className="
            text-2xl font-bold
            text-slate-800 leading-snug
          "
            >
              {tier.name}
            </h3>

            <p className="text-slate-500 text-sm mt-1">
              Support sustainable community impact
            </p>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold text-emerald-600">
              ₹{tier.amount.toString()}
            </p>
          </div>
        </div>

        {/* Backers */}
        <div
          className="
        flex items-center justify-between
        bg-emerald-50
        border border-emerald-100
        rounded-2xl px-4 py-3
        mb-5
      "
        >
          <p className="text-sm font-medium text-slate-600">
            Community Supporters
          </p>

          <p className="text-lg font-bold text-emerald-700">
            {tier.backers.toString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <TransactionButton
          transaction={() =>
            prepareContractCall({
              contract: contract,
              method: "function fund(uint256 _tierIndex) payable",
              params: [BigInt(index)],
              value: tier.amount,
            })
          }
          onError={(error) => alert(`Error: ${error.message}`)}
          onTransactionConfirmed={async () =>
            alert("Thank you for supporting this mission!")
          }
          style={{
            marginTop: "0.5rem",
            background: "linear-gradient(to right, #10B981, #0D9488)",
            color: "white",
            padding: "0.9rem 1rem",
            borderRadius: "1rem",
            cursor: "pointer",
            fontWeight: "600",
            border: "none",
            width: "100%",
          }}
        >
          Support This Cause
        </TransactionButton>

        {isEditing && (
          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract: contract,
                method: "function removeTier(uint256 _index)",
                params: [BigInt(index)],
              })
            }
            onError={(error) => alert(`Error: ${error.message}`)}
            onTransactionConfirmed={async () =>
              alert("Contribution level removed successfully!")
            }
            style={{
              background: "#EF4444",
              color: "white",
              padding: "0.8rem 1rem",
              borderRadius: "1rem",
              cursor: "pointer",
              fontWeight: "600",
              border: "none",
              width: "100%",
            }}
          >
            Remove Support Level
          </TransactionButton>
        )}
      </div>
    </div>
  );
};
