"use client";
import { useState, ChangeEvent, useRef } from "react";
import { ResearchDocumentMarketABI } from "@/contract/ResearchDocumentMarketABI";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";

export default function UploadDocument() {
  const router = useRouter();
  const [txhash, setTxhash] = useState();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [dataName, setDataName] = useState("");
  const [IPA, setIPA] = useState(false);
  const [IPX, setIPX] = useState(false);
  const [description, setDescription] = useState("");
  const [nftId, setNftId] = useState("");
  const [lisId, setLisId] = useState<any>("");
  const [dataUpload, setDataUpload] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("");
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const abi = ResearchDocumentMarketABI;

  const handleFileChange = (e: ChangeEvent<HTMLinputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand("copy");
    }
  };

  const handleUploadSubmit = async () => {
    const formData = new FormData();
    formData.set("author_address", address);
    formData.set("pdfFile", file);
    formData.set("nft_address", address);
    formData.set("cost_per_word", pricePerWord);
    formData.set("IP_ID", address);

    try {
      const response = await fetch("/api/document_upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); // Parse the response as JSON
      console.log("Content uploaded successfully:", data);
      const id = toast.loading("Data is being sent for review");
      setTimeout(() => {
        toast.update(id, {
          render: "Data is Approved by DAO sucessfully",
          type: "success",
          isLoading: false,
          closeOnClick: true,
          closeButton: true,
        });
      }, 3000);
      // Clear the form or handle success state (optional)
    } catch (error) {
      console.error("Error uploading content:", error);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const data = new FormData();
    data.set("pdfFile", file);

    try {
      const response = await fetch("/api/loader", {
        method: "POST",
        body: data,
      });
      const id = toast.loading("Data is being processed for the RAG model");
      if (response.ok) {
        setDataUpload(true);
        await handleUploadSubmit();
        toast.update(id, {
          render: "Data Uploaded successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          closeButton: true,
        });
      } else {
        toast.update(id, {
          render: "Data Upload Failed",
          type: "error",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleUploadDocument = async () => {
    try {
      await handleSubmit();
      toast.success("Document Registered successfully!");
    } catch (error) {
      console.error(error);
      alert("Error uploading document. Please try again.");
    }
  };

  const handleJoinDAO = async () => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contractAddress = "0x5AfA5a5268D6621546ad2e04957F7113bA1CbBC5";

      const contract = new Contract(contractAddress, abi, signer);

      await contract.joinDAO(name, description);

      toast.success("Applied to join the DAO successfully");
      setName("");
      setDescription("");
      setIPA(true);
    } catch (error) {
      console.error(error);
      toast.error("Error joining DAO. Please try again.");
    }
  };

  const handleMint = async () => {
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contractAddress = "0x5AfA5a5268D6621546ad2e04957F7113bA1CbBC5";

      const contract = new Contract(contractAddress, abi, signer);

      const trx = await contract.mintNFT();

      setTxhash(trx.hash);
      toast.success("Applied to join the DAO successfully");
      setName("");
      setDescription("");
      setIPX(true);
    } catch (error) {
      console.error(error);
      toast.error("Error joining DAO. Please try again.");
    }
  };

  return (
    <div>
      {isConnected ? (
        <>
          <div className="flex flex-row gap-12 items-center justify-center pt-10 m-3 h-[100%] ">
            <div className=" indicator card w-96 bg-primary text-primary-content">
              <span className="indicator-item badge badge-secondary">
                {" "}
                Step 1
              </span>
              <div className="card-body">
                <h2 className="card-title">Apply to join ExperDAO</h2>
                <p className="mb-2 font-semibold">
                  {" "}
                  join the ExperDAO by applying to a community to contribute
                </p>

                <label htmlFor="description">Select community to join</label>
                <select
                  onChange={handleSelectChange}
                  className="select text-white select-bordered w-full max-w-xs"
                >
                  <option disabled selected>
                    Select Community
                  </option>
                  <option>UBIT USC trading/investing </option>
                  <option>AI research</option>
                </select>

                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Vitalik Buterin"
                  className="input input-bordered text-white w-full max-w-xs"
                  onChange={(e) => setName(e.target.value)}
                />

                {/* <label htmlFor="upload">Upload file</label>  
  <input type="file" className="file-input file-input-bordered text-white w-full max-w-xs " accept=".pdf" onChange={handleFileChange} /> */}

                <label htmlFor="description">
                  Description and proof of work
                </label>
                <input
                  type="text"
                  id="proof of work"
                  placeholder="links to your previous work in the related field to community"
                  className="input input-bordered text-white w-full max-w-xs"
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="card-actions justify-end mt-2">
                  <button onClick={handleJoinDAO} className="btn">
                    Apply
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`${
                IPA ? "opacity-100" : "opacity-50 "
              } indicator card w-96 bg-primary text-primary-content`}
            >
              <span className="indicator-item badge badge-secondary">
                {" "}
                Step 2
              </span>
              <div className="card-body">
                <h2 className="card-title">Approved to Join community</h2>
                <p className="mb-2 font-semibold">
                  {" "}
                  Now mint your membership pass as proof of membership and
                  access
                </p>

                <label htmlFor="name">DAO contract address</label>
                <div className="flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={nftId}
                    placeholder="0x5AfA5a5268D6621546ad2e04957F7113bA1CbBC5"
                    readOnly
                    className="input input=bordered text-white flex-grow p-2 focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="btn btn-secondary outline-none"
                  >
                    Copy
                  </button>
                </div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  readOnly
                  placeholder={name}
                  className="input input-bordered text-white w-full max-w-xs"
                  onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="txhash">transaction details</label>
                <div className="flex items-center input input-bordered overflow-hidden">
                  <a
                    href={`https://testnet.ubitscan.io/tx/${txhash}`}
                    target="_blank"
                    className="text-xs overflow-hidden text-blue-400"
                  >
                    {txhash}
                  </a>
                </div>

                <div className="card-actions justify-end mt-2">
                  <button onClick={handleMint} className="btn" disabled={!IPA}>
                    Mint
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`${
                IPX ? "opacity-100" : "opacity-50 "
              } indicator card w-96 bg-primary text-primary-content`}
            >
              <span className="indicator-item badge badge-secondary">
                {" "}
                Step 3
              </span>
              <div className="card-body">
                <h2 className="card-title">Now Upload your data</h2>
                <p className="mb-2 font-semibold">
                  {" "}
                  With your membership pass, you upload your data for review to
                  contribute
                </p>

                <label htmlFor="name">Name of the dataset</label>
                <input
                  type="text"
                  id="name"
                  placeholder="UBIT NFT's report"
                  className="input input-bordered text-white w-full max-w-xs"
                  onChange={(e) => setDataName(e.target.value)}
                />

                <label htmlFor="upload">Upload data file</label>
                <input
                  type="file"
                  className="file-input file-input-bordered text-white w-full max-w-xs "
                  accept=".pdf"
                  onChange={handleFileChange}
                />

                <label htmlFor="priceperword">
                  current price per token/(~word)
                </label>
                <div className="flex items-center input input-bordered">
                  <p className="text-white">0.00003$</p>
                </div>
                <div className="card-actions justify-end mt-2">
                  <button
                    disabled={!IPX}
                    className="btn"
                    onClick={handleUploadDocument}
                  >
                    Submit data
                  </button>
                </div>
              </div>
            </div>
            {dataUpload && (
              <div className="indicator">
                <span className="indicator-item badge badge-secondary">
                  {" "}
                  Step 4
                </span>
                <div className=" w-48 h-36 flex flex-col gap-2 justify-center items-center rounded-xl bg-primary">
                  {" "}
                  <label className=" text-black" htmlFor="name">
                    access dashboard
                  </label>{" "}
                  <button
                    className="btn"
                    onClick={() => router.push(`user/${address}`)}
                  >
                    Dashboard
                  </button>
                </div>{" "}
              </div>
            )}{" "}
          </div>
          <ToastContainer
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable
            pauseOnHover
            theme="dark"
            closeButton={true}
          />
        </>
      ) : (
        <div className="flex flex-column justify-center items-center h-[85vh]">
          <div className="text-3xl font-bold text-gray-400">
            Please log in to access this feature.
          </div>
        </div>
      )}{" "}
    </div>
  );
}
