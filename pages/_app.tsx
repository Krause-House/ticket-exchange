import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";
import Cursor from "../components/Cursor";

function KrauseTicketExchange({ Component, pageProps }: AppProps) {
  return (
    <Cursor>
      <WagmiProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </WagmiProvider>
    </Cursor>
  );
}

export default KrauseTicketExchange;
