"use client";

import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-center border-2 rounded-xl mt-3 border-gray-700 items-center h-screen">
      <div className="max-w-xl px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">Welcome to Exper</h1>
        </div>
        <div className="mt-4 text-sm text-center text-gray-600">
          Explore Exper, powered by ExperDAO on Web3 and AI. Unlock diverse data
          types—from research insights to DeFi strategies—token by token,
          revolutionizing access to information.
        </div>
      </div>
      <div className="mt-8">
        <button
          className="btn btn-primary mr-4"
          onClick={() => {
            if (pathname !== "/chat") {
              window.location.href = "/chat";
            }
          }}
        >
          Chat with AI
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (pathname !== "/upload") {
              window.location.href = "/upload";
            }
          }}
        >
          Upload Data
        </button>
      </div>
    </div>
  );
}
