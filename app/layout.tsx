import "./globals.css";
import { Inter } from 'next/font/google';

import { Navbar } from "@/components/Navbar";

import { Web3Modal } from '../context/web3modal'

export const metadata = {
  title: 'Web3Modal',
  description: 'Web3Modal Example'
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html  data-theme="cupcake" lang="en">
      <head>
        <title>Glok - Web3</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
  name="description"
  content="Unlocking Knowledge, One Token at a Time: Revolutionizing Research Access with Web3 and AI."
/>
<meta property="og:title" content="Glok Research Platform" />
<meta
  property="og:description"
  content="Unlocking Knowledge, One Token at a Time: Revolutionizing Research Access with Web3 and AI."
/>
<meta property="og:image" content="/images/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Glok Research Platform" />
<meta
  name="twitter:description"
  content="Unlocking Knowledge, One Token at a Time: Revolutionizing Research Access with Web3 and AI."
/>
<meta name="twitter:image" content="/images/og-image.png" />

      </head>
      <body data-theme="cupcake" className={inter.className}>
      <Web3Modal>  <div className="flex flex-col p-4 md:p-12 h-[100vh]">
          <Navbar></Navbar>
          {children}
        </div></Web3Modal>
      </body>
    </html>
  );
}
