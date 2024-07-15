"use client";
import { ChatWindow } from "@/components/ChatWindow";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

export default function AgentsPage() {
  const { isConnected } = useWeb3ModalAccount();

  const InfoCard = (
    <div className="md:p-8 mb-5 bg-neutral-base-100 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg p-8 shadow-lg backdrop-blur-lg w-[90%] max-h-[85%] overflow-hidden">
      <h1 className="text-5xl font-semibold gap-2 md:text-4xl mb-4">
        📊 Empower Your Insight with Exper
      </h1>
      <ul className="text-lg">
        <li>
          💡
          <span className="ml-2">
            Exper revolutionizes access to diverse data—from research documents
            to DeFi strategies—powered by Web3 technology and AI.
          </span>
        </li>
        <li>
          🚀
          <span className="ml-2">
            Embrace flexible access: no more traditional paywalls. Prepay for up
            to 5M tokens per instance and unlock precise information as needed.
          </span>
        </li>
        <li>
          💻
          <span className="ml-2">
            Explore a vast repository of data sets, research documents, and
            expert insights on various topics.
          </span>
        </li>
        <li>
          🔍
          <span className="ml-2">
            Efficiently search and access specific information, paying only for
            the exact content you require.
          </span>
        </li>
        <li>
          🛡️
          <span className="ml-2">
            Enhance data quality with extensive prompts. Valid publishers can
            contribute research documents to enrich the Exper repository.
          </span>
        </li>
      </ul>
      <p className="mt-4 text-sm text-gray-500">
        ExperDAO, the governance contract for Exper, is deployed on the UBIT
        Smart Chain, ensuring decentralized management and secure transactions.
      </p>
    </div>
  );

  return (
    <div>
      {isConnected ? (
        <ChatWindow
          endpoint="api/chat/retrieval_agents"
          emptyStateComponent={InfoCard}
          showIngestForm={true}
          placeholder={"Ask anything and unlock knowledge with Exper!"}
          titleText="Exper UBIT SmartChain Model"
        />
      ) : (
        <div className="flex flex-column h-[85vh] justify-center items-center ">
          <div className="text-3xl font-bold text-gray-400">
            Please log in to access this feature.
          </div>
        </div>
      )}
    </div>
  );
}
