"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Contract, BrowserProvider, formatUnits } from "ethers";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ResearchDocumentMarketABI } from "@/contract/ResearchDocumentMarketABI";

// ABI for the DAO contract
const DAO_ABI = ResearchDocumentMarketABI;
const NFT_CONTRACT_ADDRESS = "0x5AfA5a5268D6621546ad2e04957F7113bA1CbBC5";

export default function UserDashboard() {
  const { addr } = useParams();
  const { address: walletAddress, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [userAddress, setUserAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [earnings, setEarnings] = useState("0");
  const [daoBalance, setDaoBalance] = useState("0");

  useEffect(() => {
    if (isConnected && walletProvider && walletAddress && addr) {
      const addressFromUrl = addr.toString().toLowerCase();

      if (addressFromUrl === walletAddress.toLowerCase()) {
        setUserAddress(addressFromUrl);
      } else {
        toast.error("Wallet address does not match the address in the URL.");
      }
    }
  }, [isConnected, walletProvider, walletAddress, addr]);

  const fetchUserData = async () => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contractAddress = "0x5AfA5a5268D6621546ad2e04957F7113bA1CbBC5";

      const contract = new Contract(contractAddress, DAO_ABI, signer);
      const userData = await contract.daoUsers(walletAddress);
      console.log(userData);

      setUserName(userData.name);
      setUserEmail(userData.email);
      setIsMember(userData.isMember);
      setEarnings(formatUnits(userData.earnings));

      // Fetch DAO balance
      const balance = await ethersProvider.getBalance(contractAddress);
      setDaoBalance(formatUnits(balance));
    } catch (error) {
      console.error(error);
      toast.error("Error fetching user data from DAO contract.");
    }
  };

  const handleWithdrawEarnings = async () => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contractAddress = "0x5AfA5a5268D6621546ad2e04957F7113bA1CbBC5";

      const contract = new Contract(contractAddress, DAO_ABI, signer);
      await contract.withdrawEarnings();
      toast.success("Earnings withdrawn successfully!");

      // Refresh DAO balance and user earnings
      fetchUserData();
    } catch (error) {
      console.error(error);
      toast.error("Error withdrawing earnings. Please try again.");
    }
  };

  return (
    <div>
      {isConnected ? (
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            User Dashboard
          </h1>
          {isMember ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card bg-primary text-primary-content shadow-xl p-4">
                <h2 className="card-title">DAO Contract Balance</h2>
                <p>{daoBalance} USC</p>
              </div>
              <div className="card bg-secondary text-secondary-content shadow-xl p-4">
                <h2 className="card-title">User Earnings</h2>
                <p>{earnings} USC</p>
                <button onClick={handleWithdrawEarnings} className="btn  mt-4">
                  Withdraw Earnings
                </button>
              </div>
              <div className="card bg-accent text-accent-content shadow-xl p-4">
                <h2 className="card-title">User Details</h2>
                <p>
                  <strong>Name:</strong> {userName}
                </p>
                <p>
                  <strong>Details:</strong> {userEmail}
                </p>
              </div>
            </div>
          ) : (
            <div className=" text-center">
              <button onClick={fetchUserData} className="btn btn-secondary">
                Sign In
              </button>
            </div>
          )}
          <ToastContainer
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable
            pauseOnHover
            theme="dark"
            closeButton={true}
          />
        </div>
      ) : (
        <div className="flex flex-column justify-center items-center h-[85vh]">
          <div className="text-3xl font-bold text-gray-400">
            Please log in to access this feature.
          </div>
        </div>
      )}
    </div>
  );
}
