import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBoolean,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { chain } from "wagmi";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CHAIN, CHAIN_ID } from "../constants";

function Connect() {
  const [
    { data: account, error: accountError, loading: accountLoading },
    disconnect,
  ] = useAccount();
  const [{ data, error, loading }, connect] = useConnect();
  const [{ data: network }, switchNetwork] = useNetwork();
  const [modal, setModal] = useBoolean();
  const coinbase = new WalletLinkConnector({
    options: {
      appName: "Krause House Ticket Exchange",
      jsonRpcUrl: process.env.ALCHEMY,
    },
  });
  const walletConnect = new WalletConnectConnector({
    chains: [chain.mainnet],
    options: {
      qrcode: true,
    },
  });

  useEffect(() => {
    if (account) {
      setModal.off();
    }
  }, [account]);

  return (
    <>
      {network.chain?.id == CHAIN_ID || !account ? (
        <motion.div
          className={`font-bold text-xs h-20 p-2 px-4 flex items-center button ${
            data.connected ? "text-xl pb-4" : "font-vibes pb-6"
          }`}
          onClick={account ? disconnect : setModal.on}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          {data.connected
            ? account?.ens?.name ||
              account?.address.slice(0, 6) + "..." + account?.address.slice(-4)
            : "Connect Wallet"}
        </motion.div>
      ) : (
        <motion.div
          className="font-vibes font-bold text-xs h-20 mt-4 p-2 px-4 pb-5 flex items-center button"
          onClick={() => switchNetwork && switchNetwork(CHAIN_ID)}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          <img src="/ethereum.png" className="w-8 h-8" />
          <div className="mb-1">Switch Network</div>
        </motion.div>
      )}
      <Modal
        motionPreset="scale"
        isOpen={modal}
        onClose={setModal.off}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent pb={5}>
          <ModalHeader className="font-vibes">Select your wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center justify-center">
            {data.connectors.map((x) => (
              <div className="relative flex justify-center w-72" key={x.name}>
                <button
                  key={x.name}
                  onClick={() => connect(x)}
                  className="z-10 border-2 border-black rounded-md flex items-center justify-center hover:bg-black hover:text-white font-semibold transition px-4 py-2 my-2"
                >
                  {x.name === "MetaMask" && (
                    <img src="/metamask.png" className="mr-2 w-6 h-6" />
                  )}
                  {x.name}
                </button>
              </div>
            ))}
            <div className="relative flex justify-center w-72" key="Coinbase">
              <button
                key="coinbase"
                onClick={() => connect(coinbase)}
                className="z-10 border-2 border-black rounded-md flex items-center justify-center hover:bg-black hover:text-white font-semibold transition px-4 py-2 my-2"
              >
                <img src="/coinbase.png" className="mr-2 w-6 h-6" />
                Coinbase
              </button>
            </div>
            <div
              className="relative flex justify-center w-72"
              key="WalletConnect"
            >
              <button
                key="walletConnect"
                onClick={() => connect(walletConnect)}
                className="z-10 border-2 border-black rounded-md flex items-center justify-center hover:bg-black hover:text-white font-semibold transition px-4 py-2 my-2"
              >
                <img src="/wallet-connect.png" className="mr-2 w-6 h-6" />
                Wallet Connect
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Connect;
