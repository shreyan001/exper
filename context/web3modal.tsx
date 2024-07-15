'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '0793c35a8b46aac855d2e132d25aab6a'

// 2. Set chains
const testnet = {
  chainId: 44433,
  name: 'UBIT-testnet',
  currency: 'USC',
  explorerUrl: 'https://testnet.ubitscan.io',
  rpcUrl: 'https://testnet-rpc.ubitscan.io/'
}
  
// 3. Create a metadata object
const metadata = {
  name: 'Exper',
  description: 'web3 x AI',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  icons: ['/public/images/exper.png']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [testnet],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

export function Web3Modal({ children }) {
  return children
}