"use client";

import ConnectButton from './WalletButton';

import { usePathname } from 'next/navigation';

import Image from "next/image";

export function Navbar() {

  const pathname = usePathname();
  
  return (
  <div className="navbar bg-neutral text-neutral-content rounded-xl">
   
 <div className="flex-1">
 
    <a className="btn btn-ghost text-xl " href="/"> <div className="rounded-2xl w-fit h-fit"></div><Image className="rouned-xl" width={40} height={40} src="/images/exper.png" alt="logo"/> 
    Exper</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-2">
      <li ><a href="/onboard" >Contribute</a></li>
      <li><a href="/chat">Chat</a></li>
    </ul><div>
      <ConnectButton/>
    </div>

  </div>
    </div>
  );
}