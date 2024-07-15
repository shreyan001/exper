import React, { useState } from 'react';
import { Contract, BrowserProvider, parseEther } from 'ethers';
import { treasuryABI } from '@/contract/treasury'; 
import { useWeb3ModalProvider } from '@web3modal/ethers/react';

const TransactionModal = ({ txSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abi = treasuryABI;
  const { walletProvider } = useWeb3ModalProvider();

  const handlePurchase = async () => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
      const contractAddress = '0x00897Acc92715d095D120e10f42eC4Da9808440f';
      const contract = new Contract(contractAddress, abi, signer);

      const amountToPay = parseEther('0.0005'); // Amount in USC to pay
      const overrides = {
        value: amountToPay
      };

      setLoading(true);
      await contract.makePayment(overrides); // Call the makePayment function with payment

      // Payment successful, close modal
      setLoading(false);
      setIsOpen(false);
      txSuccess();
    } catch (error) {
      // Handle error
      setLoading(false);
      setError(error.message || 'An error occurred');
    }
  };

  const renderModalContent = () => (
    <dialog id="transaction_modal" className="modal py-3 modal-bottom sm:modal-middle" open>
      <div className="modal-box">
        <div className="text-center mb-4">
          <button onClick={() => setIsOpen(false)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          <h2 className="text-2xl py-2 font-bold">Subscribe to access an instance</h2>
          <p className="text-gray-600 ">{`You need to pay 0.0005 USC to use an instance upto 5M tokens(~word) worth of data with the AI model`}</p>
        </div>
        <div className="flex justify-center">
          <button
            className={`btn btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePurchase}
            disabled={loading}
          >
            {loading ? 'Purchasing...' : 'Purchase'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </dialog>
  );

  return (
    <div>
      <button className="btn" onClick={() => setIsOpen(true)}>Chat</button>
      {isOpen && renderModalContent()}
    </div>
  );
};

export default TransactionModal;


