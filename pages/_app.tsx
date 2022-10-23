import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import toast, { Toaster } from "react-hot-toast";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      chainRpc={{ "80001": process.env.NEXT_PUBLIC_RPC }}
      desiredChainId={activeChainId}
    >
      <Component {...pageProps} />
      <Toaster />
    </ThirdwebProvider>
  );
}

export default MyApp;
