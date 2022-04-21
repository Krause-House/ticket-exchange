import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiProvider } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";
import Cursor from "../components/Cursor";
import { TicketProvider } from "../contexts/TicketContext";

function KrauseTicketExchange({ Component, pageProps }: AppProps) {
  return (
    <Cursor>
      <WagmiProvider>
        <ChakraProvider>
          <TicketProvider>
            <Component {...pageProps} />
          </TicketProvider>
        </ChakraProvider>
      </WagmiProvider>
    </Cursor>
  );
}

export default KrauseTicketExchange;
